"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const {Collection} = require('discord.js');
const path = require('path');
const fs = require('fs');
const dotenv_1 = __importDefault(require("dotenv"));
const messageReader_1 = __importDefault(require("./listeners/messageReader"));
const slashReader_1 = __importDefault(require("./listeners/slashReader"));
const ready_1 = __importDefault(require("./listeners/ready"));
const cron_1 = __importDefault(require("./cron"));

console.log("Not Quite Tako is waking up...");

const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildWebhooks,
        discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
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

dotenv_1.default.config();
(0, ready_1.default)(client);
(0, messageReader_1.default)(client);
(0, slashReader_1.default)(client);
(0, cron_1.default)(client);
client.login(process.env.TOKEN);
