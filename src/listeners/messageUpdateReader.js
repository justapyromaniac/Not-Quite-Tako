const { Events } = require('discord.js');

exports.default = (client) => {
    client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
        if (newMessage.author.bot) return;

        const timeLimit = 10000; 
        const now = Date.now();

        if (now - newMessage.createdTimestamp > timeLimit) {
            return;
        }

        try {
            const notNitro = client.passives.get('notnitro');
            if (notNitro) {
                await notNitro.execute(newMessage);
            }
        } catch (err) {
            console.error(err, `Error while attempting emoji replacement for edit.`);
        }
    });
};
