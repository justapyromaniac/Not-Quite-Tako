const { randomnum } = require('../functions/functions.js');
let cooldown = new Map();
const APBegin = new Date("2023-03-31T20:00:00Z");
const APEnd = new Date("2023-04-02T07:00:00Z");
module.exports = {
    data: {
        name: 'randomreact',
        description: 'Makes NQT react with random emotes to random posts.'
      },
    async execute(message) {
        const client = message.client;

        const Reacts = async (message, client) => {

            //Gets a number between 0 and 99.
            let rand = randomnum(0, 100);
            let chance = 1;
        
            //TEMP
            /* if ((Date.now() >= Date.parse(APBegin)) && (Date.now() <= Date.parse(APEnd))) {
                 chance = 29;
             } */
        
            if (message.content.toLowerCase().includes(`nqt`)) {
                chance = 9;
            }
        
            //Checks the 2% (30% for April Fools)
            if (rand <= chance) {
        
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


        if (message.content.match(/(?!<a?|`.*):[^<:>\s]+?:(?!\d+>|.*`)/g) === null) {
            //If cooldown is not active and the server is the Tentacult then run the reacts function.
            if (!cooldown.has("R") && message.guild.id == `753099492554702908`) {
                await Reacts(message, client);
            }
            return;
        }

    },
};