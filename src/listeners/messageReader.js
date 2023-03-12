"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        //return if the message was sent by a bot, or if the message doesn't contain any emotes or if it's in a DM (no webhooks in dms)
        //yes there's a lot of exclamation marks, they're all guarded but typescript is a bit dumb sometimes.
        if (message.author.bot || message.content.match(/(?!<a?):[^<:>]+?:(?!\d+>)/g) === null || message.channel.type === "DM" || message.webhookId) {
            return;
        }

        const fixedMessage = await fixPoorMessage(message, client);
        if (fixedMessage === undefined) { return; }

        const webhook = await fetchWebhook(message);
     
        //Changed the if here so it looks a bit more clean (Nx)
        sendFixedMessage(fixedMessage, message.member, webhook, (message.channel.isThread() ? message.channelId : undefined));
   
        message.delete();

        return;
    });
};

//Karim helped with this piece of code specifically, dumbass me made a new webhook and deleted it every time
//So thank karim for your audit logs not becoming cluttered
//Signed, Pyro
const fetchWebhook = async (message) => {
    const webhookName = process.env.WEBHOOK_NAME;
    const webhooks = await message.guild.fetchWebhooks();
    let notQuiteTako = webhooks.find(webhook => webhook.name === webhookName);

    //The dm check is purely to remove dm channel from the channel union type, bc the bot doesn't work in dms ANYWAY

    if (notQuiteTako === undefined && message.channel.type !== "DM") {
        if (message.channel.isThread()) {
            notQuiteTako = await message.channel.parent.createWebhook(webhookName);
        }
        else {
            notQuiteTako = await message.channel.createWebhook(webhookName);
        }
    }

    //Just one check here it seems to be just fine. (Nx)
    if (message.channel.isThread()) {
        return await notQuiteTako.edit({ channel: message.channel.parentId });
    }
    else {
        return await notQuiteTako.edit({ channel: message.channelId });
    }

};

const fixPoorMessage = async (message, client) => {
    let match = message.content.match(/(?!<a?):[^<:>]+?:(?!\d+>)/g);
    if (match === null) { return undefined; }
    let emojis = client.emojis.cache;  //Cache isn't infallable, need to refetch failed emotes
    let guildEmojis = message.guild.emojis.cache;

    let filteredEmojis = emojis.filter(emoji => match.includes(`:${emoji.name}:`));
    filteredEmojis.sweep((emoji, key) => guildEmojis.has(key) && !emoji.animated);
    let output;
    if (filteredEmojis.size > 0) {
        output = message.content;
        for (const emoji of filteredEmojis.values()) {
            output = output.replace(new RegExp(`(?!<a?):${emoji.name}:(?!\\d+>)`, "g"), `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`);

        }
    }

    if (output == message.content) {
        return undefined;
    }
    return output;
};

const sendFixedMessage = (message, author, webhook, threadId) => {
    webhook.send({
        content: message,
        username: author.displayName,
        avatarURL: author.displayAvatarURL({ format: 'png', size: 1024 }),
        threadId: threadId
    }).catch(e => {
            console.error(e);
        });
};
