module.exports = {
        data: {
            name: 'notnitro',
            description: 'Makes NQT replace text for real emotes that has available.'
          },
    async execute(message) {
        const client = message.client;

        if (message.content.match(/(?!<a?|`.*):[^<:>\s]+?:(?!\d+>|.*`)/g) === null) {
            return;
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
    const webhookName = process.env.WEBHOOK_NAME; console.log(process.env.WEBHOOK_NAME);
    const webhooks = await message.guild.fetchWebhooks();
    let notQuiteTako = webhooks.find(webhook => webhook.name === webhookName);

    //TEMP
    if (notQuiteTako === undefined /*&& message.channel.type !== "DM"*/) {
        if (message.channel.isThread()) {
            notQuiteTako = await message.channel.parent.createWebhook({ name: webhookName });
        }
        else {
            notQuiteTako = await message.channel.createWebhook({ name: webhookName });
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