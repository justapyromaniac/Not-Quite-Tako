let AllWebhooks = new Map();
module.exports = {
    data: {
        name: 'nottako',
        description: 'Makes NQT replace text for real emotes that has available.'
    },
    async execute(message) {
        const client = message.client;

        if (message.content.match(/(?!<a?|`.*):[^<:>\s]+?:(?!\d+>|.*`)/g) === null) {
            return;
        }

        let config;

        // --- TOGGLE ---
        try {
            const { Config, Feature_Channels } = client.db;
            const guildId = message.guild.id;

            config = await Config.findByPk(guildId);
            if (config && config.features && config.features.nottako === false) {
                return;
            }

            const reactChannels = await Feature_Channels.findOne({ 
                where: { ConfigServer: guildId, feature: 'nottako' } 
            });
            if (reactChannels) {
                const list = reactChannels.channels || [];
                const isAllowList = reactChannels.allow; 

                if (isAllowList) {
                    if (!list.includes(message.channel.id)) return;
                } else {
                    if (list.includes(message.channel.id)) return;
                }
            }
        } catch (err) {
            console.error("Config check failed:", err);
            // not nitro is kindof the point of the bot, continue anyway
        }


        const NQT = async (message, client) => {

            let fixedMessage = await fixPoorMessage(message, client);
            if (fixedMessage === undefined) { return; }

            if (config?.features?.nottako_replies !== false) {
                 const replyHeader = await getReplyHeader(message);
                 fixedMessage = replyHeader + fixedMessage;
            }

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
            let notQuiteTako;
            if (AllWebhooks.has(message.guild.id)) {
                const NQTLocal = AllWebhooks.get(message.guild.id);
                notQuiteTako = await client.fetchWebhook(NQTLocal);
            } else {
                const webhooks = await message.guild.fetchWebhooks();
                notQuiteTako = webhooks.find(webhook => webhook.name === webhookName);
                if (notQuiteTako) {
                    AllWebhooks.set(message.guild.id, notQuiteTako.id);
                } else {
                    console.error(`Webhook not found for guild: ${message.guild.id}`);
                }
            }

            //TEMP
            if (notQuiteTako === undefined) {
                if (message.channel.isThread()) {
                    notQuiteTako = await message.channel.parent.createWebhook({ name: webhookName });
                }
                else {
                    notQuiteTako = await message.channel.createWebhook({ name: webhookName });
                }
            }

            //This looks better
            const editOptions = { channel: message.channel.isThread() ? message.channel.parentId : message.channelId };
            await notQuiteTako.edit(editOptions);
            return notQuiteTako;
        };

        const getReplyHeader = async (message) => {
            if (!message.reference || !message.reference.messageId) return '';

            try {
                const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
                const rawLink = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.reference.messageId}`;
                
                let excerpt = "";
                const content = repliedMessage.content;
                const limit = config?.reply_length || 20;

                if (content) {
                    if (content.includes('||')) {
                         excerpt = " [spoiler]";
                    } else {
                        const parts = content.split(/(<a?:.+?:\d+>)/g);
                        let count = 0;
                        let excerptPart = "";
                        
                        for (const part of parts) {
                            if (part.match(/<a?:.+?:\d+>/)) {
                                if (count < limit) {
                                    excerptPart += part;
                                    count++;
                                }
                            } else {
                                for (const char of Array.from(part)) {
                                    if (count < limit) {
                                        excerptPart += char;
                                        count++;
                                    } else {
                                        break;
                                    }
                                }
                            }
                            if (count >= limit) break;
                        }

                        const totalLength = Array.from(content.replace(/<a?:.+?:\d+>/g, 'E')).length;
                        if (totalLength > limit) excerptPart += "...";
                        
                        excerpt = ` (${excerptPart})`;
                    }
                }

                return `${rawLink}${excerpt}\n`;
            } catch (e) {
                // Fallback for when message cannot be fetched (e.g. deleted or no access)
                const rawLink = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.reference.messageId}`;
                return `${rawLink}\n`;
            }
        };

        const fixPoorMessage = async (message, client) => {
            let match = message.content.match(/(?!<a?|`.*):[^<:>\s]+?:(?!\d+>|.*`)/g);

            if (match === null) { return undefined; }
            let emojis = client.emojis.cache;  //Cache isn't infallible, need to refetch failed Emotes
            let guildEmojis = message.guild.emojis.cache;

            /* let CorrectEmojis = message.content.match(/(<a?|\`.*):[^<:>\s]+?:(\d+>|.*\`)/g);
             let SEmojiIDs = [];
            if(CorrectEmojis){
             for(let Emoji of CorrectEmojis){
                SEmojiIDs.push([Emoji.match(/(?<=\:)(\d+)(?=\>)/g)[0],Emoji.startsWith("<a")?"gif":"png"]);
             }
            }*/

            let filteredEmojis = emojis.filter(emoji => match.includes(`:${emoji.name}:`));
            filteredEmojis.sweep((emoji, key) => guildEmojis.has(key) && !emoji.animated);

            let output;
            output = message.content;

            /* if (SEmojiIDs != []) {
              
                 let testEmojis = SEmojiIDs.filter(arr => !emojis.some(emoji => emoji.id == arr[0]));
         
                 if (testEmojis.length > 0) {
                     var EmojiGuild = client.guilds.cache.get(`1042098513082851328`);
                     for (const semoji of SEmojiIDs) {
                         var url = `https://cdn.discordapp.com/emojis/${semoji[0]}.${semoji[1]}`;
                         let NewEmoji = await EmojiGuild.emojis.create({ attachment: `${url}`, name: `NQTEmoji` }).catch(console.error);
         
                         output = output.replace(new RegExp(`(<a?):[^<:>\s]+:(${semoji[0]}>)`, "g"), `<${NewEmoji.animated ? "a" : ""}:${NewEmoji.name}:${NewEmoji.id}>`);
                         console.log(output);
                         setTimeout(() => { NewEmoji.delete(); }, 5000);
                     }
                 }
             }*/

            if (filteredEmojis.size > 0) {
                for (const emoji of filteredEmojis.values()) {
                    output = output.replace(new RegExp(`(?!<a?|.*\`):${emoji.name}:(?!\\d+>|.*\`)`, "g"), `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`);
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

        await NQT(message, client); //Moved NQT main function to make the code more organized with the adition of reacts.

    },
};