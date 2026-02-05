const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { configdb } = require("../databases.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("general configuration")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("reactions")
        .setDescription("control all features NQT has")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("channels")
            .setDescription("Set the channels NQT can't react in")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("the channel to add to the allow/disallow list")
                .addChannelTypes(
                  ChannelType.GuildText,
                  ChannelType.PrivateThread,
                  ChannelType.PublicThread,
                  ChannelType.GuildForum
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("list")
            .setDescription(
              "disallow reactions in the listed channels, or allow reactions only in the listed channels"
            )
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription("the type of list")
                .setRequired(true)
                .addChoices(
                  { name: "allow", value: "true" },
                  { name: "disallow", value: "false" }
                )
            )
        )
    ),
  type: "global",
  async execute(interaction) {
    await configdb.models.Config.findOrCreate({
      where: { server: interaction.guildId },
    });
    switch (interaction.options.getSubcommandGroup()) {
      case "reactions":
        let [react_channels, created] =
          await configdb.models.React_Channels.findOrCreate({
            where: { ConfigServer: interaction.guildId },
          });
        switch (interaction.options.getSubcommand()) {
          case "channels":
            const channels = [...new Set([...react_channels.channels, parseInt(interaction.options.getChannel("channel").id)])]
            await react_channels.update({channels})
            interaction.reply(
              "This is the NQT react channels allow/disallow list!\n" + 
              react_channels.channels
            );
            break;
          case "list":
            await react_channels.update({allow: interaction.options.getString("type") === "true" ? true : false})
            interaction.reply(`The react channel list is now set to ${react_channels.allow ? "allow" : "dissalow"}`)
            break;
          default:
            interaction.reply("Whoops!");
            break;
        }
        break;
      default:
        interaction.reply("Whoops!");
        break;
    }
  },
};
