const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { Config, Feature_Channels } = require('../models/config');
const path = require('path');
const fs = require('fs');

const serverbuttons = path.resolve(__dirname, '../serverbuttons.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Manage server configuration for NQT')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        
        // ---------------- NOT QUITE TAKO ----------------
        .addSubcommandGroup(group =>
            group.setName('nottako')
                .setDescription('Configure the Not Quite Tako (Emoji) feature')
                .addSubcommand(sub =>
                    sub.setName('toggle')
                        .setDescription('Enable or disable emoji replacement')
                        .addBooleanOption(option =>
                            option.setName('enabled')
                                .setDescription('Should this be enabled? true/false')
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('edits')
                        .setDescription('Enable or disable emoji replacement for edited messages')
                        .addBooleanOption(option =>
                            option.setName('enabled')
                                .setDescription('Should this be enabled? true/false')
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('replies')
                        .setDescription('Enable or disable replies in bot posts')
                        .addBooleanOption(option =>
                            option.setName('enabled')
                                .setDescription('Should this be enabled? true/false')
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('replylength')
                        .setDescription('Set the max length of the reply preview')
                        .addIntegerOption(option =>
                            option.setName('length')
                                .setDescription('Number of characters/emojis (default 20)')
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('editlimit')
                        .setDescription('Set the time limit for processing edited messages')
                        .addNumberOption(option =>
                            option.setName('seconds')
                                .setDescription('Time in seconds (e.g. 10.5)')
                                .setRequired(true)
                                .setMinValue(0)
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('channels')
                        .setDescription('Channel whitelist/blacklist')
                        .addStringOption(option =>
                            option.setName('action')
                                .setDescription('Add/Remove/Mode.')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'Add to list', value: 'add' },
                                    { name: 'Remove from list', value: 'remove' },
                                    { name: 'Set list mode', value: 'mode' }
                                )
                        )
                        .addChannelOption(option =>
                            option.setName('channel')
                                .setDescription('The channel to add/remove')
                                .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread, ChannelType.GuildForum)
                        )
                        .addStringOption(option =>
                            option.setName('type')
                                .setDescription('Act as whitelist or blacklist')
                                .addChoices(
                                    { name: 'Allow List', value: 'true' },
                                    { name: 'Disallow List', value: 'false' }
                                )
                        )
                )
        )

        // ---------------- TAKOGACHA ----------------
        .addSubcommandGroup(group =>
            group.setName('takogacha')
                .setDescription('Configure TakoGacha')
                .addSubcommand(sub =>
                    sub.setName('toggle')
                        .setDescription('Enable or disable TakoGacha')
                        .addBooleanOption(option =>
                            option.setName('enabled')
                                .setDescription('Should this be enabled? true/false')
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('channels')
                        .setDescription('Manage TakoGacha channels')
                        .addStringOption(option =>
                            option.setName('action')
                                .setDescription('What to do?')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'Add to list', value: 'add' },
                                    { name: 'Remove from list', value: 'remove' },
                                    { name: 'Set list mode', value: 'mode' }
                                )
                        )
                        .addChannelOption(option =>
                            option.setName('channel')
                                .setDescription('The channel to add/remove')
                                .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread, ChannelType.GuildForum)
                        )
                        .addStringOption(option =>
                            option.setName('type')
                                .setDescription('Act as whitelist or blacklist')
                                .addChoices(
                                    { name: 'Allow List', value: 'true' },
                                    { name: 'Disallow List', value: 'false' }
                                )
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('sources')
                        .setDescription('Manage Tako channels')
                        .addStringOption(option =>
                            option.setName('action')
                                .setDescription('Add/Remove/List')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'Add to list', value: 'add' },
                                    { name: 'Remove from list', value: 'remove' },
                                    { name: 'List sources', value: 'list' }
                                )
                        )
                        .addChannelOption(option =>
                            option.setName('channel')
                                .setDescription('The channel to add/remove')
                                .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread, ChannelType.GuildForum)
                        )
                )
        )

        // ---------------- BOT EMOJIS ----------------
        .addSubcommandGroup(group =>
            group.setName('botemoji')
                .setDescription('Configure custom emojis used by the bot')
                .addSubcommand(sub =>
                    sub.setName('set')
                        .setDescription('Set custom emojis')
                        .addStringOption(option =>
                            option.setName('name')
                                .setDescription('The emoji to override')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'Tako', value: 'tako' },
                                    { name: 'Gold Coin', value: 'gold' },
                                    { name: 'Silver Coin', value: 'silver' },
                                    { name: 'Ancient One', value: 'ao' }
                                )
                        )
                        .addStringOption(option =>
                            option.setName('id')
                                .setDescription('The ID of the custom emoji')
                                .setRequired(true)
                        )
                )
                .addSubcommand(sub =>
                    sub.setName('list')
                        .setDescription('List current emoji overrides')
                )
        ),
    type: "global",
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const group = interaction.options.getSubcommandGroup();
            const subcommand = interaction.options.getSubcommand();
            const guildId = interaction.guildId;
            const client = interaction.client;

            const [config] = await Config.findOrCreate({ where: { server: guildId } });

            const toggleFeature = async (featureKey, enabled) => {
                const newFeatures = { ...config.features, [featureKey]: enabled };
                await config.update({ features: newFeatures });
                return interaction.editReply(`Feature **${featureKey}** is now **${enabled ? 'ENABLED' : 'DISABLED'}**.`);
            };

            const processChannelList = async (featureKey, options = { allowMode: false, allowList: false }) => {
                const action = interaction.options.getString('action');
                
                let [rc] = await Feature_Channels.findOrCreate({ where: { ConfigServer: guildId, feature: featureKey } });
                let currentChannels = rc.channels || [];

                // LIST
                if (action === 'list' && options.allowList) {
                    if (currentChannels.length === 0) return interaction.editReply(`[${featureKey}] No channels configured.`);
                    const channelMentions = currentChannels.map(id => `<#${id}>`).join(', ');
                    return interaction.editReply(`[${featureKey}] Channels: ${channelMentions}`);
                }

                // MODE
                if (action === 'mode' && options.allowMode) {
                    const allow = interaction.options.getString('type') === 'true';
                    await rc.update({ allow });
                    return interaction.editReply(`[${featureKey}] Channel Mode set to: **${allow ? 'Allow List (Whitelist)' : 'Disallow List (Blacklist)'}**`);
                }

                const channel = interaction.options.getChannel('channel');
                if (!channel) return interaction.editReply('Specify a channel to Add or Remove.');

                // ADD
                if (action === 'add') {
                    if (!currentChannels.includes(channel.id)) {
                        currentChannels.push(channel.id);
                        await rc.update({ channels: currentChannels });
                        return interaction.editReply(`[${featureKey}] Added ${channel} to list.`);
                    } else {
                        return interaction.editReply(`[${featureKey}] ${channel} is already in list.`);
                    }
                }
                
                // REMOVE
                if (action === 'remove') {
                    if (currentChannels.includes(channel.id)) {
                        currentChannels = currentChannels.filter(id => id !== channel.id);
                        await rc.update({ channels: currentChannels });
                        return interaction.editReply(`[${featureKey}] Removed ${channel} from list.`);
                    } else {
                        return interaction.editReply(`[${featureKey}] ${channel} is not in list.`);
                    }
                }
            };

            if (group === 'nottako') {
                if (subcommand === 'toggle') return toggleFeature('nottako', interaction.options.getBoolean('enabled'));
                if (subcommand === 'edits') return toggleFeature('nottako_edits', interaction.options.getBoolean('enabled'));
                if (subcommand === 'replies') return toggleFeature('nottako_replies', interaction.options.getBoolean('enabled'));
                if (subcommand === 'replylength') {
                    const length = interaction.options.getInteger('length');
                    await config.update({ reply_length: length });
                    return interaction.editReply(`Reply Preview Length set to **${length}**.`);
                }
                if (subcommand === 'editlimit') {
                    const limit = interaction.options.getNumber('seconds');
                    await config.update({ edit_timeout: limit });
                    return interaction.editReply(`Edit Timeout set to **${limit} seconds**.`);
                }
                if (subcommand === 'channels') return processChannelList('nottako', { allowMode: true });
            }

            if (group === 'takogacha') {
                if (subcommand === 'toggle') return toggleFeature('takogacha', interaction.options.getBoolean('enabled'));
                if (subcommand === 'channels') return processChannelList('takogacha', { allowMode: true });
                if (subcommand === 'sources') return processChannelList('takogacha_sources', { allowList: true });
            }

            if (group === 'botemoji') {
                if (subcommand === 'set') {
                    const name = interaction.options.getString('name');
                    const id = interaction.options.getString('id');
                    const emoji = interaction.guild.emojis.cache.get(id);
                    if (!emoji) return interaction.editReply(`⚠️ Emoji ID \`${id}\` not found in this server.`);

                    const newEmojis = { ...config.emojis, [name]: id };
                    await config.update({ emojis: newEmojis });
                    return interaction.editReply(`Bot Emoji **${name}** set to ${emoji} (\`${id}\`)`);
                }
                if (subcommand === 'list') {
                     const emojiList = Object.entries(config.emojis || {})
                        .map(([k, v]) => `• **${k}**: \`${v}\``)
                        .join('\n');
                    return interaction.editReply(`**Bot Emoji Overrides**\n${emojiList || 'No overrides set.'}`);
                }
            }

        } catch (error) {
            console.error(error);
            interaction.editReply('❌ An error occurred while saving the configuration.');
        }
    }
};
