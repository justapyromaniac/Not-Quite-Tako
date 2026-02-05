const { randomnum } = require('../functions/functions.js');
let cooldown = new Map();

const currentYear = new Date().getUTCFullYear();
const APBegin = new Date(Date.UTC(currentYear, 2, 31, 22, 0, 0)); // March 31, 22:00 UTC
const APEnd = new Date(Date.UTC(currentYear, 3, 2, 7, 0, 0)); // April 2, 07:00 UTC

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
            let time = 30 * 1000
            //TEMP
            if ((Date.now() >= APBegin.getTime()) && (Date.now() <= APEnd.getTime()) && message.guild.id == `753099492554702908`) {
                chance += 29;
                time = 20 * 1000;
            }
        
            if (message.content.toLowerCase().includes(`nqt`)) {
                chance += 10;
            }
        
            //Checks the 2% (30% for April Fools)
            if (rand <= chance) {
        
                //var TakoEmotes = client.emojis.cache.filter(emoji => emoji.guild.name.includes(`Tentacult`));
        
                var AllEmotes = message.guild.emojis.cache;
                //Filter certain emotes.
                var AllEmotesfilter = `<:InaHumu:760954227316621333> <a:TakoTwerksZoom:893581617916964874> <a:TakoArrivesToTwerkAndLeave:890420989798809701>`
                AllEmotes = AllEmotes.filter(e => !AllEmotesfilter.includes(`${e.id}`))
        
                //Get a random emote.
                var RandomAllEmotes = randomnum(0, ([...AllEmotes.keys()].length) - 1);
                var EmojiGot = [...AllEmotes.keys()][RandomAllEmotes];
        
                if (EmojiGot == undefined) { return; }
        
                //And react with the emote.
                message.react(EmojiGot).catch(err => { console.log(`Can't React.`) });
        
                //At last after a reaction was placed start a new cooldown.
                cooldown.set("R", Date.now() + time);
                setTimeout(() => { cooldown.delete("R"); }, time);
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