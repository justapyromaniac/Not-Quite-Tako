"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
    
        const slash = client.commands.get(interaction.commandName);
    
        if (!slash) return;
    
        try {
            await slash.execute(interaction);
        } catch (error) {
            console.error(error);
            const content = 'An error has ocurred.';
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content });
            } else {
                await interaction.reply({ content, ephemeral: true });
            }
        }
    });
};
