const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.env.TOKEN;
const fs = require('node:fs');

// Place your client and guild ids here
const clientId = '978098134767009843';

const rest = new REST({ version: '9' }).setToken(token);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, "753099492554702908"), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);