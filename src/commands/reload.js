var fs = require('fs');
const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);
var cfiles = fs.readdirSync('./commands');
var pfiles = fs.readdirSync('./passives');
var ffiles = fs.readdirSync('./functions');

const coption = [];

for (const file of cfiles) {
    let cname = file.replace(".js", "")
    coption.push({ name: `${cname}`, value: `${cname}` })
}

for (const file of pfiles) {
    let cname = file.replace(".js", "")
    coption.push({ name: `${cname}`, value: `${cname}` })
}

for (const file of ffiles) {
    let cname = file.replace(".js", "")
    coption.push({ name: `${cname}`, value: `${cname}` })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload the given slash command.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => option.setName('command').setDescription('The command to be reloaded.').setRequired(true).addChoices(...coption)),
    type: "dev",
    async execute(interaction) {

        const mesmember = interaction.member;
        let client = interaction.client;

        let cName = interaction.options.getString('command');
        const wordInString = (s, word) => new RegExp('\\b' + word + '\\b', 'gi').test(s);
        var FinalType = `Error`;
        try {

            const cpath = Object.keys(require.cache).find(f => wordInString(`${f}`, `${cName}`))

            if (cpath != undefined) {
                var typepath = cpath.slice(0, cpath.lastIndexOf("\\")); //CHANGE THE BACK SLASH TO NORMAL SLASH
                typepath = typepath.slice(typepath.lastIndexOf('\\') + 1)

                console.log(cpath, typepath);

                await delete require.cache[require.resolve(`${cpath}`)]
                switch (typepath) {
                    case `commands`: {
                        client.commands.delete(cName)
                        const push = require(`${cpath}`)
                        client.commands.set(cName, push)
                        FinalType = `Slash`
                        break;
                    }
                    case `passives`: {
                        client.passives.delete(cName)
                        const push = require(`${cpath}`)
                        client.passives.set(cName, push)
                        FinalType = `Passive`
                        break;
                    }
                    case `functions`: {
                        client.functions.delete(cName)
                        const push = require(`${cpath}`)
                        client.functions.set(cName, push)
                        FinalType = `Function`
                        break;
                    }
                }
            } else {

                var cfiles = fs.readdirSync('./commands');
                var pfiles = fs.readdirSync('./passives');
                var ffiles = fs.readdirSync('./functions');

                var pathfind = cfiles.find(f => wordInString(`${f}`, `${cName}`)) ? `../commands/` + `${cName}.js` :
                    pfiles.find(f => wordInString(`${f}`, `${cName}`)) ? `../passives/` + `${cName}.js` :
                        ffiles.find(f => wordInString(`${f}`, `${cName}`)) ? `../functions/` + `${cName}.js` :
                            undefined;

                var typepath = cfiles.find(f => wordInString(`${f}`, `${cName}`)) ? `commands` :
                    pfiles.find(f => wordInString(`${f}`, `${cName}`)) ? `passives` :
                        ffiles.find(f => wordInString(`${f}`, `${cName}`)) ? `functions` :
                            undefined;

                if (pathfind != undefined) {

                    switch (typepath) {
                        case `commands`: {
                            const push = require(`${pathfind}`)
                            client.commands.commands.set(cName, push)
                            FinalType = `Slash`
                            break;
                        }
                        case `passives`: {
                            const push = require(`${pathfind}`)
                            client.commands.passives.set(cName, push)
                            FinalType = `Passive`
                            break;
                        }
                        case `functions`: {
                            const push = require(`${pathfind}`)
                            client.commands.slash.set(cName, push)
                            FinalType = `Function`
                            break;
                        }
                    }

                } else {
                    interaction.reply(`Command does not exist: **${cName}**`)
                }
            }

        } catch (e) {
            console.log(e);
            return interaction.reply(`Unable to reload the command **${cName}**`)
        }
        interaction.reply(`¡${FinalType} command **${cName}** reloaded!`)

    },
};

