const fs = require('fs');
const takofile = './resources/takos.json';
const { sleep } = require('../functions/functions.js');
module.exports = {
    data: {
        name: 'collect',
        description: 'Makes NQT collect tako Names and PFP.'
    },
    async execute(message) {

        if (message.content.match(`!NQT tako koko`)) {

            return message.reply(`Registration ended.`)

            let name = message.author.username
            var takolist = await fs.readFileSync(takofile)
            var takoarray = JSON.parse(takolist)

            if (takoarray.length >= 182) {
                return message.reply(`Registration ended.`)
            }

            if (takoarray.some(tako => tako.name == name)) {
                message.reply(`Only once per Tako!`)
            } else {
                message.reply(`Thank you Tako!`)

                let pfp = message.author.displayAvatarURL({ extension: 'png', forceStatic: true })

                let takodata = {
                    name: name,
                    pfp: pfp
                }

                takoarray.push(takodata)

                await sleep(100);

                await fs.writeFile(takofile, JSON.stringify(takoarray), (err) => {
                    if (err) throw err;
                })
            }
        }

        if (message.mentions.users.some(user => user.id === message.client.user.id) && message.content.includes(`checkurls`) && message.author.id == `284926618714243074`) {
            message.channel.send(`Checking...`)
            const takofile = './resources/takos.json';

            let takolist = fs.readFileSync(takofile)
            let takoarray = JSON.parse(takolist)

            checkLink = async url => (await fetch(url)).ok

            let tentacult = await message.client.guilds.fetch(`753099492554702908`);
    //      let loadTakos = await tentacult.members.fetch();

            for (let i = 0; i < takoarray.length; i++) {

                let ifAvatar = await checkLink(takoarray[i].pfp);
             
                if (!ifAvatar) {
                    console.error(`Tako ${takoarray[i].name} perdio su pfp`);
                    let takoMember = await tentacult.members.cache.find( u => u.user.username == `${takoarray[i].name}`);
                    console.log(takoMember);
                    if (takoMember) {
                        let takoAvatar = takoMember.displayAvatarURL({ extension: `jpg`, forceStatic: true }) || takoMember.avatarURL({ extension: `jpg`, forceStatic: true })
                        if (takoAvatar) {
                            console.log(`Pero se encontró!`)
                            takoarray[i].pfp = takoAvatar
                        } else {
                            console.log(`Y sigue perdido!`)
                            continue;
                        }
                        await sleep(100);
                    }
                } else {
                    console.log(`Tako ${takoarray[i].name} tiene su pfp`);
                }
            }
            
            message.channel.send(`Finished`)
            await fs.writeFile(takofile, JSON.stringify(takoarray), (err) => {
                if (err) throw err;
            })
        }
    },
};