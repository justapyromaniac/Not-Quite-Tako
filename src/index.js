"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const messageReader_1 = __importDefault(require("./listeners/messageReader"));
const ready_1 = __importDefault(require("./listeners/ready"));
console.log("Not Quite Tako is waking up...");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_WEBHOOKS,
    ]
});
(0, ready_1.default)(client);
(0, messageReader_1.default)(client);
dotenv_1.default.config();
client.login(process.env.TOKEN);
