const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require(`discord.js`);
const serverbuttons = './serverbuttons.json';
const fs = require('fs');

module.exports = {
    type: "tako",
    data: new SlashCommandBuilder()
        .setName(`featuredsrv`)
        .setDescription(`For editing, creating and posting featured servers information and invites.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName(`post`)
                .setDescription(`Posts featured channels.`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(`managebuttons`)
                .setDescription(`Allows for edition and creation of invite button links.`)
                .addStringOption(option =>
                    option.setName(`messageid`)
                        .setDescription(`The id of the message.`)
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName(`row`)
                        .setDescription(`The row of the button, top to bottom. (Min: 1, Max: 5)`)
                        .setMaxValue(5)
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName(`column`)
                        .setDescription(`The column of the button, left to right. (Min: 1, Max: 5)`)
                        .setMaxValue(5)
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName(`newlink`)
                        .setDescription(`The new link for the button. (discord invite)`)
                )
                .addStringOption(option =>
                    option.setName(`newname`)
                        .setDescription(`The new name of the button.`)
                )
                .addStringOption(option =>
                    option.setName(`newmark`)
                        .setDescription(`The new mark for the button. (emoji in unicode)`)
                )
                .addBooleanOption(option =>
                    option.setName(`delete`)
                        .setDescription(`Deletes the button.`)
                )
        ),
    async execute(interaction) {
        
        await interaction.deferReply({ ephemeral: true });
        const client = interaction.client;

        //POST ALL INVITES
        const postInvites = async (interaction, client) => {

            const webhook = await fetchWebhook(interaction);

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            fs.readFile(serverbuttons, async (err, data) => {
                if (err) throw err;

                let buttondata = JSON.parse(data);

                //POSTS
                for (const post in buttondata) {
                    var rows = buttondata[post].rows;
                    var avatar = buttondata[post].avatar;
                    var banner = buttondata[post].banner;
                    var name = buttondata[post].name;
                    //ACTION ROWS
                    var acomponents = [];

                    for (const arow in rows) {
                        // BUTTONS 
                        var ARowB = new ActionRowBuilder();

                        for (const abutton of rows[arow]) {
                            sleep(100);
                            var server = await client.fetchInvite(abutton[0]).catch((error) => { return undefined; });
                            if (server) {
                                var tempbutton = new ButtonBuilder()
                                    .setLabel(`${abutton[1]}║${server.guild.name}║${abutton[1]}`)
                                    .setURL(abutton[0])
                                    .setStyle(ButtonStyle.Link);
                            } else {
                                var tempbutton = new ButtonBuilder()
                                    .setLabel(`${abutton[1]}║⚠❗Server Invite Unavailable❗⚠║${abutton[1]}`)
                                    .setURL(`https://cdn.discordapp.com/attachments/test1042098513082851331/1141956465540743218/c23f54aea2065f106e4dbb8218d0ce2d7853351c.png`)
                                    .setStyle(ButtonStyle.Link);
                            }
                            ARowB.addComponents(tempbutton);
                        }
                        acomponents.push(ARowB);
                    }

                    await webhook.send({
                        files: [banner],
                        username: name,
                        avatarURL: avatar,
                        components: acomponents
                    }).catch(e => {
                        console.error(`whoops: ${e}`);
                    });

                }

                const permalink = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`🐙Tentacult Temple🐙 (omg that's us!)`)
                            .setURL(`https://discord.gg/tentacult`)
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setLabel(`🐙Emote Server!🐙`)
                            .setURL(`https://discord.gg/tentacult1`)
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setLabel(`🐙🐙Even more emotes!🐙🐙`)
                            .setURL(`https://discord.gg/tentacult2`)
                            .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                            .setLabel(`🐙🐙🐙MORE EMOTES!🐙🐙🐙`)
                            .setURL(`https://discord.gg/dqzjQfzwen`)
                            .setStyle(ButtonStyle.Link)
                    );

                await webhook.send({
                    files: [`https://cdn.discordapp.com/attachments/1042098513082851331/1140205844080906300/wide_tako.png`],
                    username: "Permalinks to here",
                    avatarURL: `https://cdn.discordapp.com/emojis/754420052865843260.gif?size=96&quality=lossless`,
                    components: [permalink]
                }).catch(e => {
                    console.error(`whoops: ${e}`);
                });

                await webhook.send({
                    content: `**If clicking a button gives you an "invite link is invalid or has expired" message be sure to refresh your discord. Ctrl + R should do the trick. <a:TakozillaPat:807766293347434547>\nIf for some reason that doesn't work. Please try copying the link from the button into your preferred browser <:InaHeart:767850477064290374>**`,
                    username: "Note",
                    avatarURL: `https://cdn.discordapp.com/attachments/1042098513082851331/1140205844080906300/wide_tako.png`
                }).catch(e => {
                    console.error(`whoops: ${e}`);
                });

            });       
        };

        const fetchWebhook = async (interaction) => {
            const webhookName = process.env.WEBHOOK_NAME;
            const webhooks = await interaction.guild.fetchWebhooks();
            let notQuiteTako = webhooks.find(webhook => webhook.name === webhookName);

            if (notQuiteTako === undefined) {
                notQuiteTako = await interaction.channel.createWebhook({ name: webhookName });
            }

            return await notQuiteTako.edit({ channel: interaction.channelId });
        };

        const createButton = async (newname, newlink, newmark) => {
            var newbutton = new ButtonBuilder()
                .setLabel(newname ? `${newmark}║${newname}║${newmark}` : `placeholder`)
                .setURL(newlink ? `${newlink}` : `https://discord.gg`)
                .setStyle(ButtonStyle.Link)
            return newbutton;
        };

        const WriteJSONFile = async (serverbuttons, buttondata) => {
            fs.writeFile(serverbuttons, JSON.stringify(buttondata, null, 2), (err) => {
                if (err) throw err;
            })
        };

        //MANAGE BUTTONS (EDIT,CREATE)
        if (interaction.options.getSubcommand() === `managebuttons`) {

            var mesid = interaction.options.getString(`messageid`);
            var row = interaction.options.getNumber(`row`) - 1;
            var column = interaction.options.getNumber(`column`) - 1;
   
            var newname = interaction.options.getString(`newname`);
            var newlink = interaction.options.getString(`newlink`);
            var newmark = interaction.options.getString(`newmark`) ? interaction.options.getString(`newmark`) : "║";
            var checkdelete = interaction.options.getBoolean(`delete`);
            var placeholderlink = "https://cdn.discordapp.com/attachments/1042098513082851331/1141956465540743218/c23f54aea2065f106e4dbb8218d0ce2d7853351c.png";

            if (((newname == null) && newlink) || checkdelete) { } else { return interaction.editReply({ content: `If given a link, name is not needed.`, ephemeral: true }); }
            if ((newname || newlink) || checkdelete) { } else { return interaction.editReply({ content: `No new link or name was given.`, ephemeral: true }); }
            const webhook = await fetchWebhook(interaction);
            var editedmessage = await webhook.fetchMessage(mesid);

            fs.readFile(serverbuttons, async (err, data) => {
                if (err) throw err;

                let buttondata = JSON.parse(data);

                switch (true) {
                    case (checkdelete):
                        {
                            if (editedmessage.components[row]) {
                                if (editedmessage.components[row].components.length <= 1) {
                                    editedmessage.components.pop();
                                    webhook.editMessage(mesid, { components: [...editedmessage.components] });
                                    for (const post in buttondata) {
                                        if (buttondata[post].name == editedmessage.author.username) {
                                            buttondata[post].rows.pop();
                                        }
                                    }
                                } else {
                                    editedmessage.components[row].components.splice(column, 1);
                                    webhook.editMessage(mesid, { components: [...editedmessage.components] });
                                    for (const post in buttondata) {
                                        if (buttondata[post].name == editedmessage.author.username) {
                                            buttondata[post].rows[row].splice(column, 1);
                                        }
                                    }
                                }
                            }

                            WriteJSONFile(serverbuttons, buttondata);

                            await interaction.editReply({ content: `The link row and/or button have been deleted.`, ephemeral: true });
                            break;
                        }
                    case (!editedmessage.components[row]): // If button row does not exist create a new one and add the new button.
                        {
                            var server = await client.fetchInvite(newlink).catch((error) => { return undefined; });

                            if (server) {
                                newname = server.guild.name;
                            } else {
                                newname = `${newmark}║⚠❗Server Invite Unavailable❗⚠║${newmark}`
                                newlink = placeholderlink;
                            }

                            const newaction = new ActionRowBuilder();
                            const newbutton = await createButton(newname, newlink, newmark);

                            newaction.addComponents(newbutton);
                            webhook.editMessage(mesid, { components: [...editedmessage.components, newaction] })

                            for (const post in buttondata) {
                                if (buttondata[post].name == editedmessage.author.username) {
                                    buttondata[post].rows[row] = [];
                                    buttondata[post].rows[row][column] = [];
                                    buttondata[post].rows[row][column][1] = newmark;
                                    buttondata[post].rows[row][column][0] = newlink;
                                }
                            }

                            WriteJSONFile(serverbuttons, buttondata);

                            await interaction.editReply({ content: `The link row and button have been created.`, ephemeral: true });
                            break;
                        }
                    case (editedmessage.components[row].components[column] == undefined): // If button does not exist creates the new button.
                        {
                            var server = await client.fetchInvite(newlink).catch((error) => { return undefined; });

                            if (server) {
                                newname = server.guild.name;
                            } else {
                                newname = `${newmark}║⚠❗Server Invite Unavailable❗⚠║${newmark}`
                                newlink = placeholderlink;
                            }

                            const newbutton = await createButton(newname, newlink, newmark);
                            const newRow = ActionRowBuilder.from(editedmessage.components[row]).addComponents(newbutton);

                            editedmessage.components[row] = newRow;
                            webhook.editMessage(mesid, { components: editedmessage.components })

                            for (const post in buttondata) {
                                if (buttondata[post].name == editedmessage.author.username) {
                                    buttondata[post].rows[row][column] = [];
                                    buttondata[post].rows[row][column][1] = newmark;
                                    buttondata[post].rows[row][column][0] = newlink;
                                }
                            }

                            WriteJSONFile(serverbuttons, buttondata);

                            await interaction.editReply({ content: `The link button has been created.`, ephemeral: true });
                            break;
                        }
                    case (newlink): // If a new link is given for an existing button.
                        {

                            let msreply = ``;
                            for (const post in buttondata) {

                                if (buttondata[post].name == editedmessage.author.username) {

                                    var server = await client.fetchInvite(newlink).catch((error) => { return undefined; });
                                    var oldrow = buttondata[post].rows[row];

                                    if (server) {

                                        if (oldrow) {
                                            newmark = (newmark == "║") ? oldrow[row][column][1] : newmark;
                                            buttondata[post].rows[row][column][0] = newlink;
                                            buttondata[post].rows[row][column][1] = newmark;
                                        }

                                        editedmessage.components[row].components[column].data.url = newlink;
                                        editedmessage.components[row].components[column].data.label = `${newmark}║${server.guild.name}║${newmark}`;

                                        WriteJSONFile(serverbuttons, buttondata);

                                        msreply = `The link button has been edited.`
                                    } else {
                                        editedmessage.components[row].components[column].data.url = placeholderlink;
                                        editedmessage.components[row].components[column].data.label = `${newmark}║⚠❗Server Invite Unavailable❗⚠║${newmark}`;
                                        msreply = `The invite is expired or invalid.`
                                    }
                                    break;
                                };
                            }

                            webhook.editMessage(mesid, { components: editedmessage.components })

                            await interaction.editReply({ content: msreply, ephemeral: true });

                            break;
                        }
                }

            });

            //If a new name is given.
            if (newname) {
                editedmessage.components[row].components[column].data.label = newname;
            }

        }

        if (interaction.options.getSubcommand() === `post`) {
            await postInvites(interaction, client);
            return interaction.editReply({ content: `The featured servers have been posted.`, ephemeral: true })
        }
    },
};