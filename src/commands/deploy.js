const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.TOKEN;
const fs = require('node:fs');
const rest = new REST({ version: '9' }).setToken(token);

const servers = [
    { name: 'Tentacult', value: '753099492554702908' },
    { name: 'NQTSupport', value: '1042098513082851328' },
    { name: 'Here', value: 'here' },
    { name: 'Global', value: 'global' },
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deploy')
        .setDescription('Deploys slash commands.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => option.setName('server').setDescription('Servers to deploy slash commands.').setRequired(true).addChoices(...servers)),
    type: "dev",
    async execute(interaction) {
        try {
            const mesmember = interaction.member;
            if (!((mesmember.id == `284926618714243074`) || (mesmember.id == `366608657259167744`))) {
                return interaction.reply('NQT developers only.')
            }

            const clientId = `${interaction.client.application.id}`;
            const globalsh = [];
            const takosh = [];
            const devsh = [];
            const slashfiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

            for (const file of slashfiles) {
                const command = require(`../commands/${file}`);

                switch (command.type) {
                    case "global": {
                        globalsh.push(command.data.toJSON());
                        break;
                    }
                    case "tako": {
                        takosh.push(command.data.toJSON());
                        break;
                    }
                    case "dev": {
                        devsh.push(command.data.toJSON());
                        break;
                    }
                }
            }

            (async () => {
                try {
                    console.log('Started refreshing application (/) commands.');
                    const servid = interaction.options.getString('server');

                    if (servid == "global") {
                        await rest.put(
                            Routes.applicationCommands(clientId),
                            { body: globalsh },
                        );
                        interaction.reply(`¡Slash commands deployed globaly!`);
                    } else if (servid == "here") {
                        let commands = [...globalsh,...takosh,...devsh];
                        await rest.put(
                            Routes.applicationGuildCommands(clientId, `${interaction.guild.id}`),
                            { body: commands },
                        );
                        interaction.reply(`¡Slash commands deployed on this server!`);
                    } else if (servid == "753099492554702908") {
                        await rest.put(
                            Routes.applicationGuildCommands(clientId, servid),
                            { body: takosh },
                        );
                        interaction.reply(`¡Slash commands deployed on the Tentacult Temple!`);
                    } else if (servid == "1042098513082851328") {
                        await rest.put(
                            Routes.applicationGuildCommands(clientId, servid),
                            { body: devsh },
                        );
                        interaction.reply(`¡Slash commands deployed on NQT Support!`);
                    }

                    console.log('Successfully reloaded application (/) commands.');

                } catch (error) {
                    console.error(error);
                    interaction.reply(`Unable to deploy the slash commands.`);
                }
            })();

        } catch (e) {
            console.log(e);
            return interaction.reply(`Unable to deploy the slash commands.`);
        }


    },
};

