const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    type: "global",
    data: new SlashCommandBuilder()
        .setName('antihoisting')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames | PermissionFlagsBits.BanMembers)
        .setDescription('Removes special characters from members names.'),
    async execute(interaction) {
        await interaction.deferReply();
        const hoistRegex = /^[!=#"#$%\/!)="#(!&#\/($)%=(%&)==?¨*\][¨_:;]{1,3}\s*/;
        const allmembers = await interaction.guild.members.fetch();
        const members = allmembers.filter(member => {
            if (!member.user.bot && member.nickname && (member.nickname.match(hoistRegex) || member.nickname.startsWith('!'))) {
                console.log(`Matching Nickname: ${member.nickname}`);
                return true;
            }
            return false;
        });

        const embed = new EmbedBuilder()
            .setTitle('Anti-Hoisting')
            .setDescription(`Found **${members.size}** members with hoisting nicknames.`);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rename')
                    .setLabel('Rename')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary)
            );

        const message = await interaction.followUp({ embeds: [embed], components: [row], ephemeral: true });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'rename') {
                members.forEach(member => {
                    member.setNickname(`🤡${member.user.username}`);
                });
                await i.update({ content: 'Nicknames have been updated.', embeds: [], components: [] });
            } else if (i.customId === 'cancel') {
                await i.update({ content: 'Action canceled.', embeds: [], components: [] });
            }
        });

        collector.on('end', async () => {
            try {
                await interaction.editReply({ components: [] });
            } catch (error) {
                console.error('Failed to edit reply:', error);
            }
        });
    },
};