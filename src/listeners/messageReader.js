"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        //return if the message was sent by a bot, or if the message doesn't contain any emotes or if it's in a DM (no webhooks in dms)
        //yes there's a lot of exclamation marks, they're all guarded but typescript is a bit dumb sometimes.
        if (message.author.bot || message.content.match(/(?!<a?):[^<:>]+?:(?!\d+>)/g) === null || message.channel.type === "DM") {
            return;
        }
        let fixedMessage = await fixPoorMessage(message, client);
        if (fixedMessage === undefined) {
            return;
        }
        else {
            const webhook = await fetchWebhook(message);
            if (message.channel.isThread()) {
                await sendFixedMessage(fixedMessage, message.member, webhook, message.channelId);
            }
            else {
                await sendFixedMessage(fixedMessage, message.member, webhook, undefined);
            }
            message.delete();
        }
    });
};
//Karim helped with this piece of code specifically, dumbass me made a new webhook and deleted it every time
//So thank karim for your audit logs not becoming cluttered
//Signed, Pyro
const fetchWebhook = async (message) => {
    const webhookName = "NotQuiteTako";
    const webhooks = await message.guild.fetchWebhooks();
    let notQuiteTako = webhooks.find(webhook => webhook.name === webhookName);
    //the dm check is purely to remove dm channel from the channel union type, bc the bot doesn't work in dms ANYWAY
    if (notQuiteTako === undefined && message.channel.type !== "DM") {
        if (message.channel.isThread()) {
            notQuiteTako = await message.channel.parent.createWebhook(webhookName);
        }
        else {
            notQuiteTako = await message.channel.createWebhook(webhookName);
        }
    }
    //getting rid of typescripts error checking because at this point, not quite tako CANNOT be undefined.
    //will make an exception in case it still is, bc then something went wrong
    //(this comment set should show my love/hate relationship with typescript)
    notQuiteTako = notQuiteTako;
    if (notQuiteTako.channelId === message.channelId) {
        return notQuiteTako;
    }
    else {
        if (message.channel.isThread()) {
            return await notQuiteTako.edit({ channel: message.channel.parentId });
        }
        else {
            return await notQuiteTako.edit({ channel: message.channelId });
        }
    }
};
const fixPoorMessage = async (message, client) => {
    let match = message.content.match(/:(.+?):/g);
    let guilds = await client.guilds.fetch();
    let guildEmojis, emojis;
    emojis = new discord_js_1.Collection([]);
    for (const guild of guilds.values()) {
        let baseGuild = await guild.fetch();
        guildEmojis = await baseGuild.emojis.fetch();
        emojis = new discord_js_1.Collection([...emojis, ...guildEmojis.filter(emoji => match.includes(`:${emoji.name}:`))]);
    }
    let output;
    if (emojis.size > 0) {
        output = message.content;
        for (const emoji of emojis.values()) {
            output = output.replace(`:${emoji.name}:`, `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`);
        }
    }
    return output;
};
const sendFixedMessage = async (message, author, webhook, threadId) => {
    webhook.send({
        content: message,
        username: author.displayName,
        avatarURL: author.displayAvatarURL({ format: 'png', size: 1024 }),
        threadId: threadId
    })
        .catch(e => {
        console.error(e);
    });
};
