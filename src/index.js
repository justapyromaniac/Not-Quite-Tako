const { Client, GatewayIntentBits, Collection, PermissionsBitField } = require('discord.js');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const messageReader = require("./listeners/messageReader").default;
const slashReader = require("./listeners/slashReader").default;
const ready = require("./listeners/ready").default;
const cron = require("./cron").default;

console.log("Not Quite Tako is waking up...");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMembers,
    ]
});

client.commands = new Collection();
client.passives = new Collection();
client.functions = new Collection();
client.webhook = new Collection();
const slashFiles = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file => file.endsWith('.js'));

for (const sfile of slashFiles) {
    const slashed = require(`./commands/${sfile}`);
    client.commands.set(slashed.data.name, slashed);
}

const passiveFiles = fs.readdirSync(path.resolve(__dirname, './passives')).filter(file => file.endsWith('.js'));

for (const pfile of passiveFiles) {
    const passive = require(`./passives/${pfile}`);
    client.passives.set(passive.data.name, passive);
}

const functionFiles = fs.readdirSync(path.resolve(__dirname, './functions')).filter(file => file.endsWith('.js'));

for (const ffile of functionFiles) {
    const funct = require(`./functions/${ffile}`);
    client.functions.set(ffile.replace(`.js`,``),funct);
}

dotenv.config();
ready(client);
messageReader(client);
slashReader(client);
cron(client);
client.login(process.env.TOKEN);
