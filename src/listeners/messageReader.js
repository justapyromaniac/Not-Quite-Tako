"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PermissionsBitField } = require("discord.js");

exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        //Return if the message was sent by a bot or if it's in a DM (no webhooks in dms)    
        if (message.author.bot ||
            message.channel.type === "DM" ||
            message.webhookId ||
            !message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages) ||
            !message.guild.members.me.permissionsIn(message.channel).has(PermissionsBitField.Flags.ViewChannel)) {
            return;
        }

        try {
            client.passives.forEach(pass => {
                pass.execute(message, client)
            })
        } catch (err) {
            console.log(err, `ERROR PASIVOS`)
        };

    });
};

