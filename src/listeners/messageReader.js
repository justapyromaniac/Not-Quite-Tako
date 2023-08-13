"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    client.on("messageCreate", async (message) => {
        //Return if the message was sent by a bot or if it's in a DM (no webhooks in dms)    
        if (message.author.bot || message.channel.type === "DM" || message.webhookId) { 
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

