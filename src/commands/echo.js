const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    type: "global",
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Sends a message in the specified channel.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('The message to be sent.')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('The channel where the message will be sent.')
                .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('If you intend to ping a role please specify it here, as it won\'t be pinged otherwise.')
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const messageContent = interaction.options.getString('message', true);
        const channel = interaction.options.getChannel('channel', true);
        const role = interaction.options.getRole('role');

        if (!interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages) || !interaction.guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.ViewChannel)) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#D0312D')
                        .setDescription('NQT does not have perms to send a message to that channel!')
                ]
            });
        }
        
        const message = await channel.send({
            content: messageContent,
            allowedMentions: { parse: ['users'], roles: role ? [role.id] : [] }
        })

        if (!message) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#D0312D')
                        .setDescription('There was an issue with sending the message!')
                ]
            });
        }

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#5DBB63')
                    .setDescription(`[Message has been sent.](${message.url})`)
            ]
        });

    }
}
