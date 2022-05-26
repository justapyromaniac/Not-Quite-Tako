"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { MessageActionRow, MessageButton } = require('discord.js');
exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        //return if the message was sent by a bot, or if the message doesn't contain any emotes or if it's in a DM (no webhooks in dms)
        //yes there's a lot of exclamation marks, they're all guarded but typescript is a bit dumb sometimes.
        if (message.author.bot || message.channel.type === "DM") {
            return;
        }
        //A very simple command handler. 
        if (message.content.startsWith(process.env.PREFIX)) {
            const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
            const entercommand = args.shift().toLowerCase();
            switch (true) {
                case (entercommand == `listemojis`): {
                    getEmojis(message, client);
                }
                default: {
                    return;
                }
            }
        }
        //Check for emote matches moved, so commands can be used.
        if (message.content.match(/(?!<a?):[^<:>]+?:(?!\d+>)/g) === null){
             return; 
        }
        let fixedMessage = await fixPoorMessage(message, client);
        if (fixedMessage === undefined) {
            return;
        }
        const webhook = await fetchWebhook(message);
        if (message.channel.isThread()) {
            sendFixedMessage(fixedMessage, message.member, webhook, message.channelId);
        }
        else {
            sendFixedMessage(fixedMessage, message.member, webhook, undefined);
        }
        message.delete();
    });
};
//Karim helped with this piece of code specifically, dumbass me made a new webhook and deleted it every time
//So thank karim for your audit logs not becoming cluttered
//Signed, Pyro
const fetchWebhook = async (message) => {
    const webhookName = process.env.WEBHOOK_NAME;
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
    let emojis = client.emojis.cache;
    let guildEmojis = message.guild.emojis.cache;
    //cache isn't infallable, need to refetch failed emotes
    let filteredEmojis = emojis.filter(emoji => match.includes(`:${emoji.name}:`));
    if (filteredEmojis.filter(emoji => emoji.animated).size <= 0) {
        filteredEmojis.sweep((emoji, key) => guildEmojis.has(key));
    }
    let output;
    if (filteredEmojis.size > 0) {
        output = message.content;
        for (const emoji of filteredEmojis.values()) {
            output = output.replace(new RegExp(`:${emoji.name}:`, "g"), `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`);
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
    })
        .catch(e => {
        console.error(e);
    });
};

//Command function used to get all the emojis available for the bot. 
const getEmojis = async (message, client) => {
    let guilds = client.guilds.cache;
    guilds = [...guilds.keys()];
   //Buttons yay!
    var rowb = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setEmoji('⬅️')
                .setCustomId('back')
                .setLabel('')
                .setStyle('SUCCESS'),

            new MessageButton()
                .setEmoji('➡️')
                .setCustomId('fow')
                .setLabel('')
                .setStyle('SUCCESS'),

            new MessageButton()
                .setEmoji('❌')
                .setCustomId('cancel')
                .setLabel('Close')
                .setStyle('DANGER'),
        );

    const emoteEmbed = {
        color: 0x8F00FF,
        title: 'Not Quite Tako',
        description: 'Here are the lists of all the emotes that NQT has access to. Use the arrows to move between available servers.',
        thumbnail: {
            url: `https://cdn.discordapp.com/attachments/887967589031116820/979246559059382282/TakoRock.png`,
        },
        fields: [],
        footer: {
            text: 'Made by just_a_pyro#9060 and a little help of NxKarim#1744.',
        },
    };

    var sentmessage = await message.channel.send({ embeds: [emoteEmbed], components: [rowb] });
    const collector = sentmessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000 });

    var co = 0,listnum = guilds.length-1;
    collector.on('collect',async i => {
        if (i.user.id === message.author.id) {
            switch (i.customId) {
                case `fow`: {
                    co += 1;
                    if (co > listnum) { co = 0 };
                    emoteEmbed.fields = [];
                    let emojis, output = ``, lists = [];
                    var eguild = client.guilds.cache.get(`${guilds[co]}`);
                    emoteEmbed.description = `Here is a list of all the emotes that NQT has access to.\n**【${eguild.name}】**`
                    emojis = eguild.emojis.cache;
                    for (const emoji of emojis.values()) {
                        output += `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}> \`\`:${emoji.name}:\`\`\n`;
                    }
                    lists = output.match(/[\s\S]{1,1024}(?=\n)/g);
                    for (const display of lists) {
                        emoteEmbed.fields.push({ name: `⠀`, value: `${display}`, inline: true })
                    }

                    emoteEmbed.footer.text = `Made by just_a_pyro#9060 and a little help of NxKarim#1744. Server: ${co + 1}/${listnum + 1}`;
                    sentmessage.edit({ embeds: [emoteEmbed], components: [rowb] }).then(t => i.deferUpdate())

                    break;
                }
                case `back`: {
                    co -= 1;
                    if (co < 0) { co = listnum }
                    emoteEmbed.fields = [];
                    let emojis, output = ``, lists = [];
                    var eguild = client.guilds.cache.get(`${guilds[co]}`);
                    emoteEmbed.description = `Here is a list of all the emotes that NQT has access to.\n**【${eguild.name}】**`
                    emojis = eguild.emojis.cache;
                    for (const emoji of emojis.values()) {
                        output += `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}> \`\`:${emoji.name}:\`\`\n`;
                    }
                    lists = output.match(/[\s\S]{1,1024}(?=\n)/g);
                    for (const display of lists) {
                        emoteEmbed.fields.push({ name: `⠀`, value: `${display}`, inline: true })
                    }

                    emoteEmbed.footer.text = `Made by just_a_pyro#9060 and a little help of NxKarim#1744. Server: ${co + 1}/${listnum + 1}`;
                    sentmessage.edit({ embeds: [emoteEmbed], components: [rowb] }).then(t => i.deferUpdate())

                    break;
                }
                case `cancel`: {
                    sentmessage.edit({ embeds: [emoteEmbed], components: [] })
                    break;
                }
            }

        } else {
            return;
        }
    });

};
