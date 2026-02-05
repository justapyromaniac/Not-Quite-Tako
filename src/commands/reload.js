var fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);

const commandsPath = path.resolve(__dirname, '../commands');
const passivesPath = path.resolve(__dirname, '../passives');
const functionsPath = path.resolve(__dirname, '../functions');

var cfiles = fs.readdirSync(commandsPath);
var pfiles = fs.readdirSync(passivesPath);
var ffiles = fs.readdirSync(functionsPath);

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
    type: "dev",
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload the given slash command.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => option.setName('command').setDescription('The command to be reloaded.').setRequired(true).addChoices(...coption)),
    async execute(interaction) {
        await interaction.deferReply();

        const mesmember = interaction.member;
        if (!((mesmember.id == `284926618714243074`) || (mesmember.id == `366608657259167744`))) {
            return interaction.editReply('NQT developers only.')
        }

        let client = interaction.client;

        let cName = interaction.options.getString('command');
        const wordInString = (s, word) => new RegExp('\\b' + word + '\\b', 'gi').test(s);
        var FinalType = `Error`;
        try {

            const cpath = Object.keys(require.cache).find(f => wordInString(`${f}`, `${cName}`))

            if (cpath != undefined) {
                var typepath = cpath.slice(0, cpath.lastIndexOf("/")); //CHANGE THE BACK SLASH TO NORMAL SLASH
                typepath = typepath.slice(typepath.lastIndexOf('/') + 1)

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
                            client.commands.set(cName, push)
                            FinalType = `Slash`
                            break;
                        }
                        case `passives`: {
                            const push = require(`${pathfind}`)
                            client.passives.set(cName, push)
                            FinalType = `Passive`
                            break;
                        }
                        case `functions`: {
                            const push = require(`${pathfind}`)
                            client.functions.set(cName, push)
                            FinalType = `Function`
                            break;
                        }
                    }

                } else {
                    interaction.editReply(`Command does not exist: **${cName}**`)
                }
            }

        } catch (e) {
            console.log(e);
            return interaction.editReply(`Unable to reload the command **${cName}**`)
        }
        interaction.editReply(`¡${FinalType} command **${cName}** reloaded!`)

    },
};

