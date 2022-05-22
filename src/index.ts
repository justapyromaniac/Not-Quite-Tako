import { Client, Intents } from "discord.js";
import { token } from "../config.json"
import messageReader from "./listeners/messageReader";
import ready from "./listeners/ready";

console.log("Not Quite Tako is waking up...");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

ready(client);
messageReader(client);

client.login(token);