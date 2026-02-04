const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder , ButtonStyle, ComponentType} = require('discord.js');
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

            await interaction.reply({ embeds: [emoteEmbed], components: [rowb], fetchReply: true, ephemeral: true });
            const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 200000 });
            let co = 0, guildoutputs = [], guildnames = [];

            let allguilds = client.guilds.cache.values();

            for (const guild of allguilds) {
                let emojis, output = ``;
                emojis = guild.emojis.cache;
                if (guild.id == interaction.guildId) { emojis = emojis.filter(em => em.animated == true); }
                
                if (emojis.size === 0) continue;

                for (const emoji of emojis.values()) { output += `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}> \`\`:${emoji.name}:\`\`\n`; }
                
                const matches = output.match(/[\s\S]{1,5000}(?=\n)/g);
                if (!matches) continue;

                for(let pages of matches){
                    guildnames.push(guild.name);
                    guildoutputs.push(pages.match(/[\s\S]{1,1024}(?=\n)/g));
                }
            }

            let listnum = guildoutputs.length - 1;

            if (listnum < 0) {
                return interaction.editReply({ content: 'No accessible emojis found.', embeds: [], components: [] });
            }

            collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
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

                } else {
                    return;
                }
            });

        };

        await getEmojis(interaction, client);


    },
};