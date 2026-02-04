"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.default = (client) => {
    client.on("messageUpdate", async (oldMessage, message) => {
        if (message.author?.bot || message.channel.type === "DM" || message.webhookId) {
            return;
        }

        try {
            const lastMessages = await message.channel.messages.fetch({ limit: 5 });
            if (!lastMessages.has(message.id)) {
                return;
            }

            client.passives.forEach(pass => {
                pass.execute(message, client);
            });
        } catch (err) {
            console.log(err, `ERROR MESSAGE UPDATE READER`);
        }
    });
};
