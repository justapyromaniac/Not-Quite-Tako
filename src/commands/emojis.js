const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
module.exports = {
    type: "global",
    data: new SlashCommandBuilder()
        .setName('emojis')
        .setDescription('Shows all available emojis.'),
    async execute(interaction) {
        const client = interaction.client;

        const getEmojis = async (interaction, client) => {
            await interaction.deferReply({ephemeral: true});

            let guilds = client.guilds.cache;
            let guildIDs = [...guilds.keys()];

            var rowb = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji('⏪')
                        .setCustomId('mback')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setEmoji('⬅️')
                        .setCustomId('back')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setEmoji('❌')
                        .setCustomId('cancel')
                        .setLabel('Close')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setEmoji('➡️')
                        .setCustomId('fow')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setEmoji('⏩')
                        .setCustomId('mfow')
                        .setStyle(ButtonStyle.Success),
                );

            var rowa = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji('⏪')
                        .setCustomId('mback')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setEmoji('❌')
                        .setCustomId('cancel')
                        .setLabel('Close')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setEmoji('⏩')
                        .setCustomId('mfow')
                        .setStyle(ButtonStyle.Success),
                );

            const emoteEmbed = {
                color: 0x8F00FF,
                title: 'Not Quite Tako',
                description: 'Here are the lists of all the emotes that NQT has access to.\nUse ⏪⏩ to change server.\nUse ⬅️➡️ to see the emote lists of that server.\nAnd ❌ to close the menu.',
                thumbnail: {
                    url: `https://cdn.discordapp.com/attachments/887967589031116820/979246559059382282/TakoRock.png`,
                },
                fields: [],
                footer: {
                    text: 'Made by just_a_pyro#9060 and help of NxKarim#1744.',
                },
            };

            await interaction.editReply({ embeds: [emoteEmbed], components: [rowb], fetchReply: true, ephemeral: true });
            const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 200000 });
            let co = 0, ca = 0;

            function EmoteList(guild) {
                let emojis, output = ``;
                emojis = guild.emojis.cache;
                if (guild.id == interaction.guildId) { emojis = emojis.filter(em => em.animated == true); }
                for (const emoji of emojis.values()) { output += `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}> \`\`:${emoji.name}:\`\`\n`; }
                let PageList = [];
                output = output.match(/[\s\S]{1,3072}(?=\n)/g);
                for (let pages of output) {
                    PageList.push(pages.match(/[\s\S]{1,1024}(?=\n)/g));
                }
                GuildList = { server: guild.name, pages: PageList };

                return GuildList;
            }

            let List = EmoteList(guilds.get(guildIDs[ca]));
            let listnum = List.pages.length - 1;
            let servernum = guildIDs.length - 1;

            collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {

                    switch (i.customId) {
                        case `fow`: {
                            let GuildName = List.server;

                            co += 1;
                            if (co > listnum) { co = 0 };
                            let EmojiList = List.pages[co];

                            emoteEmbed.fields = [];
                            emoteEmbed.description = `Here is a list of the emotes in:\n**【${GuildName}】**`
                            emoteEmbed.footer.text = `Made by just_a_pyro#9060 and NxKarim#1744.\nPage: ${co + 1}/${listnum + 1} Server: ${ca + 1}/${servernum + 1}`;

                            if (EmojiList != null) {
                                for (const EmojiValues of EmojiList) {
                                    emoteEmbed.fields.push({ name: `⠀`, value: `${EmojiValues}`, inline: true });
                                }
                            }

                            await i.update({ embeds: [emoteEmbed], components: [rowb], ephemeral: true })

                            break;
                        }
                        case `back`: {
                            let GuildName = List.server;

                            co -= 1;
                            if (co < 0) { co = listnum }
                            let EmojiList = List.pages[co];

                            emoteEmbed.fields = [];
                            emoteEmbed.description = `Here is a list of the emotes in:\n**【${GuildName}】**`
                            emoteEmbed.footer.text = `Made by just_a_pyro#9060 and NxKarim#1744.\nPage: ${co + 1}/${listnum + 1} Server: ${ca + 1}/${servernum + 1}`;

                            if (EmojiList != null) {
                                for (const EmojiValues of EmojiList) {
                                    emoteEmbed.fields.push({ name: `⠀`, value: `${EmojiValues}`, inline: true });
                                }
                            }

                            await i.update({ embeds: [emoteEmbed], components: [rowb], ephemeral: true })

                            break;
                        }
                        case `mfow`: {
                            ca += 1;
                            if (ca > servernum) { ca = 0 };
                            List = EmoteList(guilds.get(guildIDs[ca]));
                            listnum = List.pages.length - 1;
                            let ChangeRow = rowb;
                            if (listnum == 0) {
                                ChangeRow = rowa;
                            }

                            co = 0;
                            let EmojiList = List.pages[co];
                            let GuildName = List.server;

                            emoteEmbed.fields = [];
                            emoteEmbed.description = `Here is a list of the emotes in:\n**【${GuildName}】**`
                            emoteEmbed.footer.text = `Made by just_a_pyro#9060 and NxKarim#1744.\nPage: ${co + 1}/${listnum + 1} Server: ${ca + 1}/${servernum + 1}`;

                            if (EmojiList != null) {
                                for (const EmojiValues of EmojiList) {
                                    emoteEmbed.fields.push({ name: `⠀`, value: `${EmojiValues}`, inline: true });
                                }
                            }

                            await i.update({ embeds: [emoteEmbed], components: [ChangeRow], ephemeral: true })

                            break;
                        }
                        case `mback`: {
                            ca -= 1;
                            if (ca < 0) { ca = servernum }
                            List = EmoteList(guilds.get(guildIDs[ca]));
                            listnum = List.pages.length - 1;
                            let ChangeRow = rowb;
                            if (listnum == 0) {
                                ChangeRow = rowa;
                            }

                            co = 0;
                            let EmojiList = List.pages[co];
                            let GuildName = List.server;

                            emoteEmbed.fields = [];
                            emoteEmbed.description = `Here is a list of the emotes in:\n**【${GuildName}】**`
                            emoteEmbed.footer.text = `Made by just_a_pyro#9060 and NxKarim#1744.\nPage: ${co + 1}/${listnum + 1} Server: ${ca + 1}/${servernum + 1}`;

                            if (EmojiList != null) {
                                for (const EmojiValues of EmojiList) {
                                    emoteEmbed.fields.push({ name: `⠀`, value: `${EmojiValues}`, inline: true });
                                }
                            }

                            await i.update({ embeds: [emoteEmbed], components: [ChangeRow], ephemeral: true })
                            break;
                        }
                        case `cancel`: {
                            collector.stop();
                            await i.update({ embeds: [emoteEmbed], components: [] })
                            break;
                        }
                    }

                } else {
                    return;
                }
            });

        };

        await getEmojis(interaction, client);


    },
};