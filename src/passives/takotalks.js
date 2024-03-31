const { getRandom } = require('../functions/functions.js');
module.exports = {
    data: {
        name: 'takotalks',
        description: 'Makes NQT say and post things.'
    },
    async execute(message) {
        const client = message.client;

        if (message.mentions.users.some(user => user.id === client.user.id)) {
            let marr = [`<:InaHi:1164297362928308274> <:rockdachi:1011431424601116804>`,`WAH  <:rockdachi:1011431424601116804>`,`Merry Christmas <a:TakoChristmas:783815927320805426>`,`<a:TakoChristmas:783815927320805426> <a:TakoChristmas:783815927320805426> <a:TakoChristmas:783815927320805426>`]
            let m = await getRandom(marr,1)[0];
            message.channel.send(m);
        }

    },
};