const { Events } = require('discord.js');

exports.default = (client) => {
    client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
        if (newMessage.author.bot) return;

        try {
            const { Config } = client.db;
            const config = await Config.findByPk(newMessage.guildId);
            if (config && config.features && config.features.nottako_edits === false) {
                return;
            }

            const timeLimit = (config && config.edit_timeout) ? config.edit_timeout : 10.0;
            const timeDifference = (newMessage.editedTimestamp - newMessage.createdTimestamp) / 1000;
            
            if (timeDifference > timeLimit) return;

            const notTako = client.passives.get('nottako');
            if (notTako) {
                await notTako.execute(newMessage);
            }
        } catch (err) {
            console.error(err, `Error while attempting emoji replacement for edit.`);
        }
    });
};
