module.exports = {
    data: {
        name: 'takotalks',
        description: 'Makes NQT say and post things.'
      },
    async execute(message) {
        const client = message.client;

        if(message.content.includes(`<@978098134767009843>`)){
            message.channel.send(`<:InaHi:1064654919262535800> <:rockdachi:1011431424601116804>`)
        }

        const NQTCHEER = async (message, client) => {
            if (message.channel.id == "954337573487116288" && randomnum(0, 1000) <= 50) {
                let rand2 = randomnum(0, 3);
                switch (rand2) {
                    case 0:
                        {
                            message.channel.send(`I love HoloEN <a:TakoHyperClap:814765617080827935>`);
                            break;
                        }
                    case 1:
                        {
                            message.channel.send(`I love HoloEN <a:TakoHyperClap:814765617080827935>`);
                            break;
                        }
                    case 2:
                        {
                            message.channel.send(`I love HoloEN <a:TakoHyperClap:814765617080827935>`);
                            break;
                        }
                }
            }
        }

        // await NQTCHEER(message, client);

    },
};