"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

let cooldown = new Map();
const AP = new Date("2023-03-31T20:00:00Z");

exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        //Return if the message was sent by a bot or if it's in a DM (no webhooks in dms)    
        if (message.author.bot || message.channel.type === "DM" || message.webhookId) {
            return;
        }

        //If cooldown is not active and the server is the Tentacult then run the reacts function.
        if (Date.now() >= Date.parse(AP)) {
            if (!cooldown.has("R") && message.guild.id == `753099492554702908`) {

                await Reacts(message, client);
            }
        }

        if (message.content.match(/(?!<a?|`.*):[^<:>\s]+?:(?!\d+>|.*`)/g) === null) {
            return;
        }

        await NQT(message, client); //Moved NQT main function to make the code more organized with the addition of reacts.

        return;
    });
};

function randomnum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const Reacts = async (message, client) => {

    //Gets a number between 0 and 99.
    var rand = randomnum(0, 100);

    //If less or equals 4 then checks the 5% (30% for April Fools)
    if (rand <= 29) {

        //var TakoEmotes = client.emojis.cache.filter(emoji => emoji.guild.name.includes(`Tentacult`));

        var AllEmotes = message.guild.emojis.cache;
        //Filter certain emotes.
        var AllEmotesfilter = `<:InaHumu:760954227316621333>`
        AllEmotes = AllEmotes.filter(e => !AllEmotesfilter.includes(`${e.id}`))

        //Get a random emote.
        var RandomAllEmotes = randomnum(0, ([...AllEmotes.keys()].length) - 1);
        var EmojiGot = [...AllEmotes.keys()][RandomAllEmotes];

        if (EmojiGot == undefined) { return; }

        //And react with the emote.
        message.react(EmojiGot).catch(async err => { console.log(`Can't React.`) });

        //At last after a reaction was placed start a new cooldown.
        cooldown.set("R", Date.now() + (30 * 1000));
        setTimeout(() => { cooldown.delete("R"); }, 30 * 1000);
    }

}

const NQT = async (message, client) => {

    const fixedMessage = await fixPoorMessage(message, client);
    if (fixedMessage === undefined) { return; }

    const webhook = await fetchWebhook(message);
    
    //Changed the if here so it looks a bit cleaner. (Nx)
    sendFixedMessage(fixedMessage, message.member, webhook, (message.channel.isThread() ? message.channelId : undefined));

    message.delete();

}

//Karim helped with this piece of code specifically, dumbass me made a new webhook and deleted it every time
//So thank karim for your audit logs not becoming cluttered
//Signed, Pyro
const fetchWebhook = async (message) => {
    const webhookName = process.env.WEBHOOK_NAME;
    const webhooks = await message.guild.fetchWebhooks();
    let notQuiteTako = webhooks.find(webhook => webhook.name === webhookName);

    if (notQuiteTako === undefined && message.channel.type !== "DM") {
        if (message.channel.isThread()) {
            notQuiteTako = await message.channel.parent.createWebhook({name: webhookName});
        }
        else {
            notQuiteTako = await message.channel.createWebhook({name: webhookName});
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
    let match = message.content.match(/(?!<a?):[^<:>\s]+?:(?!\d+>)/g);
    if (match === null) { return undefined; }
    let emojis = client.emojis.cache;  //Cache isn't infallible, need to refetch failed Emotes
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
        console.error(`whoops: ${e}`);
    });
};
