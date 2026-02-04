const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder , ButtonStyle, ComponentType, MessageFlags } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojis')
        .setDescription('Shows all available emojis.'),
    async execute(interaction) {
        const client = interaction.client;

        const getEmojis = async (interaction, client) => {
            console.log(`Tako emojis`);
            let guilds = client.guilds.cache;

            guilds = [...guilds.keys()];

            var rowb = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji('⬅️')
                        .setCustomId('back')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setEmoji('➡️')
                        .setCustomId('fow')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setEmoji('❌')
                        .setCustomId('cancel')
                        .setLabel('Close')
                        .setStyle(ButtonStyle.Danger),
                );

            const emoteEmbed = {
                color: 0x8F00FF,
                title: 'Not Quite Tako',
                description: 'Here are the lists of all the emotes that NQT has access to. Use the arrows to move between available servers. (WIP)',
                thumbnail: {
                    url: `https://cdn.discordapp.com/attachments/887967589031116820/979246559059382282/TakoRock.png`,
                },
                fields: [],
                footer: {
                    text: 'Made by just_a_pyro#9060 and help of NxKarim#1744.',
                },
            };

            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            const collector = interaction.channel.createMessageComponentCollector({ 
                componentType: ComponentType.Button, 
                time: 200000,
                filter: i => i.user.id === interaction.user.id
            });
            let co = 0, guildoutputs = [], guildnames = [];

            let allguilds = client.guilds.cache.values();

            for (const guild of allguilds) {
                let emojis = guild.emojis.cache;
                if (guild.id == interaction.guildId) { emojis = emojis.filter(em => em.animated == true); }
                
                if (emojis.size === 0) continue;

                let currentField = "";
                let fields = [];
                for (const emoji of emojis.values()) {
                    const line = `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}> \`\`:${emoji.name}:\`\`\n`;
                    if ((currentField + line).length > 1024) {
                        fields.push(currentField);
                        currentField = line;
                    } else {
                        currentField += line;
                    }
                }
                if (currentField) fields.push(currentField);

                guildnames.push(guild.name);
                guildoutputs.push(fields);
            }

            let listnum = guildoutputs.length - 1;

            if (listnum < 0) {
                return interaction.editReply({ content: 'No accessible emojis found.', embeds: [], components: [] });
            }

            await interaction.editReply({ embeds: [emoteEmbed], components: [rowb] });

            collector.on('collect', async i => {
                try {
                    switch (i.customId) {
                        case `fow`: {
                            co += 1;
                            if (co > listnum) { co = 0 };

                            let emojilists = guildoutputs[co];
                            let guildname = guildnames[co];

                            emoteEmbed.fields = [];
                            emoteEmbed.description = `Here is a list of all the emotes that NQT has access to.\n**【${guildname}】**`
                            emoteEmbed.footer.text = `Made by just_a_pyro#9060 and a little help of NxKarim#1744. Page: ${co + 1}/${listnum + 1}`;

                            if (emojilists != null) {
                                for (const fieldvalues of emojilists) {
                                    emoteEmbed.fields.push({ name: `⠀`, value: `${fieldvalues}`, inline: true });
                                }
                            }

                            await i.update({ embeds: [emoteEmbed], components: [rowb] });

                            break;
                        }
                        case `back`: {
                            co -= 1;
                            if (co < 0) { co = listnum }

                            let emojilists = guildoutputs[co];
                            let guildname = guildnames[co];

                            emoteEmbed.fields = [];
                            emoteEmbed.description = `Here is a list of all the emotes that NQT has access to.\n**【${guildname}】**`
                            emoteEmbed.footer.text = `Made by just_a_pyro#9060 and a little help of NxKarim#1744. Page: ${co + 1}/${listnum + 1}`;

                            if (emojilists != null) {
                                for (const fieldvalues of emojilists) {
                                    emoteEmbed.fields.push({ name: `⠀`, value: `${fieldvalues}`, inline: true });
                                }
                            }

                            await i.update({ embeds: [emoteEmbed], components: [rowb] });

                            break;
                        }
                        case `cancel`: {
                            await i.update({ embeds: [emoteEmbed], components: [] })
                            break;
                        }
                    }
                } catch (error) {
                    console.error('Error in emoji collector:', error);
                }
            });

        };

        await getEmojis(interaction, client);


    },
};