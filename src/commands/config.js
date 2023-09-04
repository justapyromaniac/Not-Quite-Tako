const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config'),
	async execute(interaction) {
		await interaction.reply('Pong!')
	}
}