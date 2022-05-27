const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('emojis')
		.setDescription('Shows all available emojis.'),
	async execute(interaction) {
        const client = interaction.client;

        const getEmojis = async (interaction,client) => {
            let guilds = client.guilds.cache;
            
            guilds = [...guilds.keys()];
        
            var rowb = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setEmoji('⬅️')
                        .setCustomId('back')
                        .setLabel('')
                        .setStyle('SUCCESS'),
        
                    new MessageButton()
                        .setEmoji('➡️')
                        .setCustomId('fow')
                        .setLabel('')
                        .setStyle('SUCCESS'),
        
                    new MessageButton()
                        .setEmoji('❌')
                        .setCustomId('cancel')
                        .setLabel('Close')
                        .setStyle('DANGER'),
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
                    text: 'Made by just_a_pyro#9060 and a little help of NxKarim#1744.',
                },
            };
        
            await interaction.reply({ embeds: [emoteEmbed], components: [rowb], fetchReply: true, ephemeral: true});
            const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 120000});
            var co = 0, listnum = guilds.length - 1;
        
            collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                    switch (i.customId) {
                        case `fow`: {
                            co += 1;
                            if (co > listnum) { co = 0 };
                           
                            emoteEmbed.fields = [];
                            let emojis, output = ``, lists = [];
                            var eguild = client.guilds.cache.get(`${guilds[co]}`);
                            emoteEmbed.description = `Here is a list of all the emotes that NQT has access to.\n**【${eguild.name}】**`
                            emoteEmbed.footer.text = `Made by just_a_pyro#9060 and a little help of NxKarim#1744. Server: ${co+1}/${listnum+1}`;
                            emojis = eguild.emojis.cache;
                            if(eguild.id == interaction.user.id){
                                emojis = emojis.filter(em => em.animated == true);
                            }
                            for (const emoji of emojis.values()) {
                                output += `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}> \`\`:${emoji.name}:\`\`\n`;
                            }
                        
                            lists = output.match(/[\s\S]{1,1024}(?=\n)/g);
                            if(lists){
                            for (const display of lists) {
                                emoteEmbed.fields.push({ name: `⠀`, value: `${display}`, inline: true })
                                if(emoteEmbed.fields.length >=5){break;}
                            }}
                        
                           await interaction.editReply({ embeds: [emoteEmbed], components: [rowb], ephemeral: true}).then(t => i.deferUpdate())
        
                            break;
                        }
                        case `back`: {
                            co -= 1;
                            if (co < 0) { co = listnum }
                            
                            emoteEmbed.fields = [];
                            let emojis, output = ``, lists = [];
                            var eguild = client.guilds.cache.get(`${guilds[co]}`);
                            emoteEmbed.description = `Here is a list of all the emotes that NQT has access to.\n**【${eguild.name}】**`
                            emoteEmbed.footer.text = `Made by just_a_pyro#9060 and a little help of NxKarim#1744. Server: ${co+1}/${listnum+1}`;
                            emojis = eguild.emojis.cache;
                            if(eguild.id == interaction.user.id){
                                emojis = emojis.filter(em => em.animated == true);
                            }
                            for (const emoji of emojis.values()) {
                                output += `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}> \`\`:${emoji.name}:\`\`\n`;
                            }
                        
                            lists = output.match(/[\s\S]{1,1024}(?=\n)/g);
                            if(lists){
                            for (const display of lists) {
                                emoteEmbed.fields.push({ name: `⠀`, value: `${display}`, inline: true })
                                if(emoteEmbed.fields.length >=5){break;}
                            }}
                        
                           await interaction.editReply({ embeds: [emoteEmbed], components: [rowb], ephemeral: true }).then(t => i.deferUpdate())
                            
                            break;
                        }
                        case `cancel`: {
                           await interaction.editReply({ embeds: [emoteEmbed], components: [] })
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