"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const messageReader = require("./listeners/messageReader").default;
const slashReader = require("./listeners/slashReader").default;
const ready = require("./listeners/ready").default;

console.log("Not Quite Tako is waking up...");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildEmojisAndStickers,
    ]
});

client.commands = new Collection();
client.passives = new Collection();
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

dotenv.config();
ready(client);
messageReader(client);
slashReader(client);
client.login(process.env.TOKEN);
