const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, AttachmentBuilder } = require('discord.js');
const { sleep, OpenTakoDB, InkFunction, closeDb, randomnum, getMessages, weightedRandom, CookieFunction, ordinal_suffix_of, Cooldown, ResetCooldown, getRandom } = require(path.resolve(__dirname, '../functions/functions.js'));
const { NewUser, SearchUser, SearchTako, AddNewTako, AddTakoCopy, UpdateTakoLevelExp, SearchAllTako, EditFriend, PlayCool1, PlayCool2, PlayCool3, PlayCool4, SearchTakoLevel, DailyCooldown } = require(path.resolve(__dirname, '../functions/queries.js'));
const TriviaQ = path.resolve(__dirname, '../trivia.json');
const fs = require('fs');
var Jimp = require('jimp');

module.exports = {
    type: "tako",
    data: new SlashCommandBuilder()
        .setName('takogacha')
        .setDescription('Gacha minigame when you can summon for many Takodachis made by the community.')
        .addSubcommand(subcommand =>
            subcommand
                .setName(`summon`)
                .setDescription(`Use this command to get more Takodachis!.`)
                .addIntegerOption(option =>
                    option.setName(`wah`)
                        .setDescription(`How many takos you want to roll for, costs 80 Empti'nis Ink per wah.  WAH! (Min: 1, Max: 12)`)
                        .setMaxValue(12)
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(`friend`)
                .setDescription(`Check your friend stats, level up with cookies or change active friend.`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(`list`)
                .setDescription(`You can check all the existing Takodachis or your collection.`)
                .addStringOption(option => option.setName('option').setDescription('All Takodachis or your collection?').setRequired(true).addChoices({ name: `All`, value: `all` }, { name: `Collection`, value: `collection` }))
        ).addSubcommand(subcommand =>
            subcommand
                .setName(`play`)
                .setDescription(`Play some minigames to get Empti'nis Ink to summon or Cookies to level up!.`)
                .addStringOption(option => option.setName('game').setDescription('Choose the game you want to play!').setRequired(true)
                    .addChoices({ name: `Not quite a Mystery Button`, value: `mystery` }, { name: `Tentacular Trivia`, value: `trivia` }, { name: `Who's that Tako?!`, value: `whostako` }))
        ).addSubcommand(subcommand =>
            subcommand
                .setName(`dailybonus`)
                .setDescription(`Get your daily bonus, 160 to 680 Empti'nis Ink per day!.`)
        ).addSubcommand(subcommand =>
            subcommand
                .setName(`help`)
                .setDescription(`Displays information about the Tako Gacha.`)
        ),
    async execute(interaction) {

        let takodb = await OpenTakoDB();

        const client = interaction.client;
        var eInk = `💧`, eCookie = `🍪`
        let ChannelArray = [`1147028821829222470`, `1147794063257513984`, `1147794102801408021`, `1152072578458996757`];

        var AOemote = await client.emojis.cache.get(`760961387530158121`);
        var Goldemote = await client.emojis.cache.get(`760954225311875112`);
        var Silveremote = await client.emojis.cache.get(`760961384657322028`);
        var Takoemote = await client.emojis.cache.get(`760961385277554698`);
        let EmojiArray = await [Takoemote, Silveremote, Goldemote, AOemote];

        let fowa = new ButtonBuilder()
            .setEmoji('⬅️')
            .setCustomId(`back${interaction.user.id}`)
            .setStyle(ButtonStyle.Secondary)

        let backwa = new ButtonBuilder()
            .setEmoji('➡️')
            .setCustomId(`fow${interaction.user.id}`)
            .setStyle(ButtonStyle.Secondary)

        let Mfowa = new ButtonBuilder()
            .setEmoji('⏪')
            .setCustomId(`mback${interaction.user.id}`)
            .setStyle(ButtonStyle.Primary)

        let Mbackwa = new ButtonBuilder()
            .setEmoji('⏩')
            .setCustomId(`mfow${interaction.user.id}`)
            .setStyle(ButtonStyle.Primary)

        let close = new ButtonBuilder()
            .setEmoji('❎')
            .setLabel("Close Menu.")
            .setCustomId(`close${interaction.user.id}`)
            .setStyle(ButtonStyle.Danger)

        let selectB = new ButtonBuilder()
            .setEmoji('✅')
            .setCustomId('select')
            .setLabel('Set friend.')
            .setStyle(ButtonStyle.Success)

        let row = await new Promise((resolve, reject) => {
            takodb.get(SearchUser, [interaction.user.id], async (err, row) => {
                if (err) {
                    reject(err);
                    return console.error(err.message);
                } else {
                    resolve(row ? row : null);
                }
            });
        })

        //If no user is found on database, enable registration for the user.
        if (row == null) {

            await interaction.deferReply();

            let buttonTako = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel(`Confirm.`)
                .setEmoji(`${eCookie}`)
                .setCustomId(`tako`)

            let buttonRowTako = new ActionRowBuilder().addComponents(buttonTako)

            const takoEmbed = {
                color: 0x2fa37d,
                title: `**${interaction.user.username} registration.**`,
                thumbnail: {
                    url: `https://cdn.discordapp.com/emojis/1027962010329174066.gif`
                },
                fields: [
                    {
                        name: `${Takoemote} **Tako Gacha Registration** ${Takoemote}`,
                        value: `**To play in the Tako gacha you need to register first, use the button below to do so.**\n_You will get 880 Empti'nis Ink (11 Summons)!_`,
                    },
                ],
                footer: {
                    text: 'Tentacult Temple',
                },
            };

            var mens = await interaction.editReply({ embeds: [takoEmbed], components: [buttonRowTako] });
            const filter = (i) => i.user.id === interaction.user.id;
            var collectedButtons = await mens.awaitMessageComponent({ filter, time: 60000 })

            if (collectedButtons.customId == "tako") {
                await sleep(1000);

                takodb.run(NewUser, [interaction.user.id, interaction.user.id], (err) => {
                    if (err) {
                        return console.log(err, `Registration Error.`);
                    } else {
                        takoEmbed.fields[0].name = `**Registration complete!**`;
                        takoEmbed.fields[0].value = `_You can now use all takogacha commands. Have fun!._\n**How to Play**\n**Try first to summon Takodachis!**\n**You need a Tako to play so, choose your Tako Friend!**\n**And at last play to get more ink to summon!**`;
                        let Cant = 800;
                        InkFunction(Cant, interaction.user.id, takodb);
                        closeDb(takodb);
                        return interaction.editReply({ embeds: [takoEmbed], components: [] });
                    }
                });

            }

        } else {

            var cooldownTime = 180000, cooldownSet = 5000;
            let TimeRemain = await Cooldown(PlayCool1, cooldownTime, row.cool1, interaction.user.id, takodb)
            if (TimeRemain) {
                await interaction.deferReply({ ephemeral: true });
                await closeDb(takodb);
                return interaction.editReply({ content: `Please wait \`\`${TimeRemain}\`\` before using another command, wait for a game to end or close your last menu. `, ephemeral: true });
            }

            let takoFriendEmbed = {
                color: 0xdc5bff,
                title: `placeholder`,
                description: `placeholder`,
                thumbnail: {
                    url: `https://cdn.discordapp.com/emojis/760954225093509240.webp`
                },
            };

            let takoFriendMenu = {
                color: 0xdc5bff,
                title: `**Placeholder**`,
                description: `placeholder`,
                thumbnail: {
                    url: `https://cdn.discordapp.com/emojis/1148412508542087249.webp`
                },
            };

            let takoEmbed = {
                color: 0xffd966,
                title: `**Summoning Takodachis!.**`,
                description: `placeholder`,
                thumbnail: {
                    url: `https://cdn.discordapp.com/emojis/821071932644524053.gif`
                },
            };

            function GetMaxLevelaRarity(ID, copies) {
                let rarity = Array.from(ID)[0];
                let maxlevel = 10, rariymes, maxwah;
                switch (rarity) {
                    case `S`: {
                        maxlevel = 60 + copies - 1;
                        maxwah = 20;
                        rariymes = `${AOemote}${Goldemote} **『Ancient One Class』** ${Goldemote}${AOemote}`
                        takoFriendMenu.color = 0x66006b;
                        takoFriendEmbed.color = 0x66006b;
                        takoEmbed.color = 0x66006b;
                        break;
                    }
                    case `A`: {
                        maxlevel = 50 + copies - 1;
                        maxwah = 30;
                        rariymes = `${Goldemote} **『Tentacultist Class』** ${Goldemote}`
                        takoFriendMenu.color = 0x8200a6;
                        takoFriendEmbed.color = 0x8200a6;
                        takoEmbed.color = 0x8200a6;
                        break;
                    }
                    case `B`: {
                        maxlevel = 40 + copies - 1;
                        maxwah = 40;
                        rariymes = `${Silveremote} **『Otako Class』**  ${Silveremote}`
                        takoFriendMenu.color = 0xdc5bff;
                        takoFriendEmbed.color = 0xdc5bff;
                        takoEmbed.color = 0xdc5bff;
                        break;
                    }
                    case `C`: {
                        maxlevel = 30 + copies - 1;
                        maxwah = 50;
                        rariymes = `${Takoemote} **『Takoling Class』** ${Takoemote}`
                        takoFriendMenu.color = 0xf2c5ff;
                        takoFriendEmbed.color = 0xf2c5ff;
                        takoEmbed.color = 0xf2c5ff;
                        break;
                    }
                }

                if (maxlevel > 80) { maxlevel = 80 };
                return { maxlevel: maxlevel, rarmes: rariymes, maxwah: maxwah };
            }

            async function GetAllUserTakos() {
                let AllTakoRow = await new Promise((resolve, reject) => {
                    takodb.all(SearchAllTako, [interaction.user.id], async (err, takorow) => {
                        if (err) {
                            reject(err);
                            await closeDb(takodb);
                            return console.error(err.message);
                        } else {
                            resolve(takorow ? takorow : null);
                        }
                    })
                })
                return AllTakoRow
            }

            async function GetTakoRow(friendId) {
                let takorow = await new Promise((resolve, reject) => {
                    takodb.get(SearchTako, [interaction.user.id, friendId], async (err, takorow) => {
                        if (err) {
                            reject(err);
                            await closeDb(takodb);
                            return console.error(err.message);
                        } else {
                            resolve(takorow ? takorow : null);
                        }
                    })
                })
                return takorow;
            }

            async function TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, closeb) {

                let rar = GetMaxLevelaRarity(ListTakos[ca][co].id, ListTakos[ca][co].copies ? ListTakos[ca][co].copies : 0);
                let maxlevel = rar.maxlevel;
                let rariymes = rar.rarmes;
                let TakoName = ListTakos[ca][co].name;
                let TakoAuthor = ListTakos[ca][co].author;
                takoFriendMenu.title = `${rariymes}\n${TakoName}`
                takoFriendMenu.description = `Tako made by: ${TakoAuthor} | ${co + 1}/${listnum + 1}`
                takoFriendMenu.thumbnail.url = `${ListTakos[ca][co].url}`

                let fowaEmoji = ((ca + 1) > listrar) ? 0 : ca + 1;
                let backwaEmoji = ((ca - 1) < 0) ? listrar : ca - 1;

                Mfowa.setEmoji(`${EmojiArray[backwaEmoji]}`);
                Mbackwa.setEmoji(`${EmojiArray[fowaEmoji]}`);

                MenuButtons.setComponents(Mfowa, fowa, closeb, backwa, Mbackwa);

                if (ListTakos[ca][co].level) {
                    takoFriendMenu.title = `${rariymes}\n${ListTakos[ca][co].name}`
                    takoFriendMenu.description = `**WAH Power**\n【${ListTakos[ca][co].copies}】\n**Level of Tako**\n【${ListTakos[ca][co].level}】 | Max: 【${maxlevel}】\n Tako made by: ${ListTakos[ca][co].author} | ${co + 1}/${listnum + 1}`;
                }
                return takoFriendMenu;
            }

            async function GetTakoFriendLevel(userid) {

                let FriendRow = await new Promise((resolve, reject) => {
                    takodb.get(SearchTakoLevel, [userid], async (err, row) => {
                        if (err) {
                            reject(err);
                            return console.error(err.message);
                        } else {
                            resolve(row ? row : null);
                        }
                    });
                })

                if (!FriendRow) { return false; }
                if (FriendRow.friend == `N/A`) { return false; }

                let FriendID = FriendRow.friend;
                let TakoFriend = await GetTakoRow(FriendID);
                return { level: TakoFriend.level, copies: TakoFriend.copies };
            }

            switch (interaction.options.getSubcommand()) {
                // -----------------------------------------------SUMMONING---------------------------------------------------
                case "summon": {

                    if (row.ink < 80) {
                        await interaction.deferReply({ ephemeral: true });
                        await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                        await closeDb(takodb);
                        return interaction.editReply(`Not enough Empti'nis Ink to summon Takodachis.`);
                    }

                    await interaction.deferReply();

                    let rolls = interaction.options.getInteger(`wah`);
                    let cost = rolls * 80;

                    if (cost > row.ink) {
                        rolls = Math.floor(row.ink / 80);
                        interaction.followUp({ content: `Not enough Empti'nis Ink, will only WAH ${rolls} times.` })
                    }

                    let ArrayOfTakos = [], MessageArray = [], Ncookies = 0;

                    for (var i = 0; i < ChannelArray.length; i++) {
                        MessageArray[i] = await getMessages(client.channels.cache.find(ch => ch.id == `${ChannelArray[i]}`), 150);
                    }

                    let AllTakoRow = await GetAllUserTakos();
                    let Free100 = false;
                    let Chance = { 0: 0.57, 1: 0.3, 2: 0.1, 3: 0.03 };

                    if (AllTakoRow) {
                        let TakoAmount = AllTakoRow.length;
                        let Check100 = await AllTakoRow.some(r => r.takoid == `S-0001`);
                        if (TakoAmount < 100) {
                            MessageArray[3].pop();
                        } else if (!Check100) {
                            MessageArray[3] = [MessageArray[3].pop()];
                            Free100 = true;
                        }
                    }

                    for (var x = 0; x < rolls; x++) {

                        if (Free100 && x == 0) {
                            Chance = { 0: 0, 1: 0, 2: 0, 3: 1 }
                        } else {
                            Chance = { 0: 0.57, 1: 0.3, 2: 0.1, 3: 0.03 };
                        }

                        var gacharesult = weightedRandom(Chance);
                        var takomes = MessageArray[gacharesult];
                        var randomindex = randomnum(0, takomes.length);
                        var takose = takomes[randomindex];
                        var url = takose.attachments.first().url;
                        let TakoData = takose.content.split("\n");
                        var TakoID = TakoData[0]
                        var TakoName = TakoData[1]
                        var AuthorName = TakoData[2]
                        var TakoWAH = TakoData[3];
                        let addcopy = 1;
                        if (TakoWAH == x + 1) { addcopy = 3; }

                        var NewOrOld = undefined, copi = 0;

                        await new Promise((resolve, reject) => {
                            takodb.get(SearchTako, [interaction.user.id, TakoID], async (err, takorow) => {
                                if (err) {
                                    await closeDb(takodb);
                                    reject(err);
                                    return console.log(err, `Database Error during tako reading.`);
                                }

                                if (takorow != undefined) { // If Tako is found, then is a duplicate.
                                    NewOrOld = false;
                                    copi = takorow.copies + addcopy;
                                    takodb.run(AddTakoCopy, [addcopy, row.tag, `${TakoID}`], (err) => { if (err) { return console.log(err, `Tako Copy Error.`) } return; });
                                    Ncookies += 8 * (copi) * (addcopy * 2);
                                }
                                else { // If Tako is not found then is a new registration.
                                    NewOrOld = true;
                                    copi = addcopy;
                                    await takodb.run(AddNewTako, [row.tag, `${TakoID}`, copi], (err, row) => { if (err) { return console.log(err, `New Tako Error.`) } });
                                }
                                ArrayOfTakos.push({ name: TakoName, isnew: NewOrOld, url: url, id: TakoID, copies: copi, author: AuthorName, ifwah: addcopy })
                                resolve(ArrayOfTakos ? ArrayOfTakos : null)
                            })
                        })
                    }

                    takoEmbed.description = `I say WAH you say WAH ${ArrayOfTakos.length} times!.`
                    CookieFunction(Ncookies, interaction.user.id, takodb);
                    InkFunction(-80 * rolls, interaction.user.id, takodb);

                    var RowButtons = new ActionRowBuilder()

                    let clos = new ButtonBuilder()
                        .setEmoji('⏭')
                        .setCustomId(`finish${interaction.user.id}`)
                        .setLabel('Skip (Close menu)')
                        .setStyle(ButtonStyle.Success)

                    RowButtons.addComponents(fowa, clos, backwa);

                    await interaction.editReply({ embeds: [takoEmbed], components: [RowButtons] });
                    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: cooldownTime });
                    let co = -1;

                    function Menu(ArrayOfTakos, co, takoEmbed, listnum) {

                        let rar = GetMaxLevelaRarity(ArrayOfTakos[co].id, 0);
                        let rariymes = rar.rarmes;

                        if (ArrayOfTakos[co].isnew) {
                            takoEmbed.title = `**${ordinal_suffix_of(co + 1)} WAH!\n${rariymes}\nIt's 【${ArrayOfTakos[co].name}】!**`
                            takoEmbed.description = `**This is your first encounter, you got a new friend!**`
                        } else {
                            takoEmbed.title = `**${ordinal_suffix_of(co + 1)} WAH!\n${rariymes}\nIt's 【${ArrayOfTakos[co].name}】 again!**`
                            takoEmbed.description = `**WAH Power increased!** #${ArrayOfTakos[co].copies}\nYou got **${(ArrayOfTakos[co].copies) * 8}** ${eCookie} cookies!`
                        }

                        if (ArrayOfTakos[co].ifwah >= 3) {
                            takoEmbed.description = `**WAH is a match‼️  Bonus WAH Power and Cookies!**\n` + takoEmbed.description;
                        }

                        takoEmbed.thumbnail.url = `${ArrayOfTakos[co].url}`
                        takoEmbed.footer = { text: `` };
                        takoEmbed.footer.text = `Tako made by: ${ArrayOfTakos[co].author} | WAH: ${co + 1}/${listnum + 1}`;

                        return takoEmbed;
                    }

                    collector.on('collect', async i => {
                        if (i.user.id === interaction.user.id) {

                            let listnum = ArrayOfTakos.length - 1;

                            switch (i.customId) {
                                case `fow${interaction.user.id}`: {
                                    co += 1;
                                    if (co > listnum) { co = 0 };

                                    takoEmbed = await Menu(ArrayOfTakos, co, takoEmbed, listnum);
                                    await i.update({ embeds: [takoEmbed], components: [RowButtons] })

                                    break;
                                }
                                case `back${interaction.user.id}`: {
                                    co -= 1;
                                    if (co < 0) { co = listnum }

                                    takoEmbed = await Menu(ArrayOfTakos, co, takoEmbed, listnum);
                                    await i.update({ embeds: [takoEmbed], components: [RowButtons] })

                                    break;
                                }
                                case `finish${interaction.user.id}`: {
                                    takoEmbed.description = `**Thanks for the WAHs!**`
                                    collector.stop();
                                    break;
                                }
                            }

                        } else {
                            return;
                        }
                    });

                    collector.on('end', async collected => {
                        takoEmbed.title = `**Summoning Session Ended.**`
                        takoEmbed.thumbnail.url = `https://cdn.discordapp.com/emojis/760954225093509240.webp`
                        takoEmbed.description = `**Thanks for the WAHs!**`
                        takoEmbed.footer = null;
                        await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                        await closeDb(takodb);
                        await interaction.editReply({ embeds: [takoEmbed], components: [] })
                    });

                    break;
                }
                case "friend": {

                    let AllTakoRow = await GetAllUserTakos();

                    if (!AllTakoRow || AllTakoRow.length <= 0) {
                        await interaction.deferReply({ ephemeral: true });
                        await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                        closeDb(takodb);
                        return interaction.editReply({ content: `You need at least one Tako to set as a friend.\nTo get a Tako use \`\`/takogacha summon\`\`\nTo set friend use \`\`/takogacha friend\`\``, ephemeral: true });
                    }

                    await interaction.deferReply();

                    var NoCookies = new ActionRowBuilder()
                    var MenuButtons = new ActionRowBuilder()
                    var RowButtons = new ActionRowBuilder()

                    let retu = new ButtonBuilder()
                        .setEmoji('✅')
                        .setCustomId('set')
                        .setLabel('Set new friend.')
                        .setStyle(ButtonStyle.Success)


                    let levelb = new ButtonBuilder()
                        .setEmoji(eCookie)
                        .setCustomId('level')
                        .setLabel('Give [5] cookies.')
                        .setStyle(ButtonStyle.Primary)

                    let levelc = new ButtonBuilder()
                        .setEmoji(eCookie)
                        .setCustomId('mult')
                        .setLabel('Increment given cookies.')
                        .setStyle(ButtonStyle.Primary)

                    RowButtons.addComponents(levelb, levelc, retu, close);
                    MenuButtons.setComponents(Mfowa, fowa, selectB, backwa, Mbackwa);
                    NoCookies.addComponents(retu, close);

                    let FriendID = row.friend;
                    let FriendName = row.friendname;
                    let FriendURL = row.url;
                    let UserCookies = row.cookies;
                    let UserInk = row.ink;

                    async function TakoFriend(takoFriendEmbed, friendname, friendurl, friendid) {

                        let takorow = await GetTakoRow(friendid);
                        let rar = GetMaxLevelaRarity(friendid, takorow.copies);
                        let maxlevel = rar.maxlevel;
                        let rariymes = rar.rarmes;
                        let Exp = await ExpBar(takorow.exp, takorow.level);

                        takoFriendEmbed.title = `**${friendname}**`
                        takoFriendEmbed.description = `${rariymes}\n**Friend of ${interaction.user.username}.**`
                        takoFriendEmbed.thumbnail.url = `${friendurl}`

                        takoFriendEmbed.fields = [];
                        takoFriendEmbed.fields[0] = {
                            name: '**WAH Power**',
                            value: `【${takorow.copies}】`,
                        }
                        takoFriendEmbed.fields[1] = {
                            name: '**Level of Tako**',
                            value: `**【${takorow.level}】** | Max: 【${maxlevel}】`,
                        }
                        takoFriendEmbed.fields[2] = {
                            name: '**To next level**',
                            value: `${Exp.bar} ${Exp.per}%`,
                        }
                        takoFriendEmbed.fields[3] = {
                            name: '**Food and Not Food**',
                            value: `**Cookies【${UserCookies}】**${eCookie}\n**Empti'nis Ink【${UserInk}】**${eInk}`,
                        }

                        return takoFriendEmbed;
                    }

                    async function ExpBar(ActualExp, ActualLevel) {

                        var TotalExpCurrentLvl = Math.floor(((5 / 4) * (ActualLevel * ActualLevel * ActualLevel)));
                        if (ActualLevel == 1) { TotalExpCurrentLvl -= 1; }

                        var NextLevel = ActualLevel + 1;
                        var TotalExpNextLvl = Math.floor(((5 / 4) * (NextLevel * NextLevel * NextLevel)));

                        var ExpToNextLvl = TotalExpCurrentLvl - TotalExpNextLvl;
                        var ExpLeft = TotalExpNextLvl - ActualExp;
                        var ExpPer = (Math.round((((ExpLeft * 100) / ExpToNextLvl) + 100) * 100) / 100);
                        var ExpBarS = ``;

                        if ((ActualLevel < 80)) {
                            for (var i = 1; i <= 20; i++) {
                                if (ExpPer >= i * 5) {
                                    ExpBarS = `${ExpBarS}▓`
                                } else {
                                    ExpBarS = `${ExpBarS}░`
                                }
                            }
                        } else {
                            ExpBarS = `MAX`
                            ExpPer = `100`
                        }

                        return { bar: ExpBarS, per: ExpPer };
                    }

                    function TakoLevelUp(ActualLevel, TakoExp) {
                        let LevelUp = false;

                        do {
                            var NextLevel = ActualLevel + 1;
                            var TotalExpNextLvl = Math.floor(((5 / 4) * (NextLevel * NextLevel * NextLevel)));
                            if (TotalExpNextLvl == 1) { TotalExpNextLvl -= 1; }

                            if (TakoExp == TotalExpNextLvl) {
                                LevelUp = true;
                                ActualLevel++;
                                break;
                            } else if (TakoExp > TotalExpNextLvl) {
                                LevelUp = true;
                                ActualLevel++;
                            }
                        } while (TakoExp >= TotalExpNextLvl)

                        if (LevelUp) {
                            var newlevel = ActualLevel;
                            if (newlevel > 80) { newlevel = 80 };
                            const LevelEmbed = {
                                color: 0x814CA7,
                                title: `**${FriendName} got to level ${newlevel}!**`,
                                thumbnail: {
                                    url: `${FriendURL}`
                                },
                            };
                            return { embed: LevelEmbed, newlevel: newlevel };
                        } else {
                            return false;
                        }
                    }

                    if (FriendID == `N/A`) {
                        takoFriendEmbed.title = `**No active friend**`
                        takoFriendEmbed.description = `Use the button below to set your takodachi!`
                        takoFriendEmbed.thumbnail.url = `https://cdn.discordapp.com/emojis/959725868329095209.webp`
                        await interaction.editReply({ embeds: [takoFriendEmbed], components: [NoCookies] })
                    } else {
                        takoFriendEmbed = await TakoFriend(takoFriendEmbed, FriendName, FriendURL, FriendID);
                        await interaction.editReply({ embeds: [takoFriendEmbed], components: [RowButtons] });
                    }

                    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: cooldownTime });

                    let MessageArray = [], ListTakos = [], AdquiredTakos = [];
                    let co = 0, ca = 0;
                    let listnum = 0, givencookies = 5, listrar = 0;

                    collector.on('collect', async i => {
                        if (i.user.id === interaction.user.id) {

                            switch (i.customId) {
                                case `set`: {

                                    for (var y = 0; y < ChannelArray.length; y++) {
                                        MessageArray[y] = await getMessages(client.channels.cache.find(ch => ch.id == `${ChannelArray[y]}`), 150);
                                    }

                                    for (var x = 0; x < ChannelArray.length; x++) {
                                        AdquiredTakos = [];
                                        for (Tako of AllTakoRow) {
                                            let takose = MessageArray[x].find(m => m.content.split("\n")[0] == Tako.takoid);

                                            if (takose) {
                                                var url = takose.attachments.first().url;
                                                let TakoData = takose.content.split("\n");
                                                var TakoID = TakoData[0]
                                                var TakoName = TakoData[1]
                                                var AuthorName = TakoData[2]
                                                var copies = Tako.copies;
                                                var level = Tako.level;
                                                AdquiredTakos.push({ url: url, name: TakoName, id: TakoID, author: AuthorName, copies: copies, level: level })
                                            }
                                        }
                                        if (AdquiredTakos.length >= 1) {
                                            ListTakos.push(AdquiredTakos);
                                        }
                                    }

                                    co = 0, ca = 0;
                                    listnum = ListTakos[ca].length - 1;
                                    listrar = ListTakos.length - 1;
                                    if (ListTakos.length < 4) { EmojiArray = EmojiArray.slice(0, ListTakos.length - 4); }

                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, selectB);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `fow${interaction.user.id}`: {
                                    co += 1;
                                    if (co > listnum) { co = 0 };

                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, selectB);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `back${interaction.user.id}`: {
                                    co -= 1;
                                    if (co < 0) { co = listnum }

                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, selectB);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `mfow${interaction.user.id}`: {
                                    ca += 1;
                                    if (ca > listrar) { ca = 0 };
                                    co = 0;

                                    listnum = ListTakos[ca].length - 1;
                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, selectB);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `mback${interaction.user.id}`: {
                                    ca -= 1;
                                    if (ca < 0) { ca = listrar }
                                    co = 0;

                                    listnum = ListTakos[ca].length - 1;
                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, selectB);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `select`: {

                                    await new Promise((resolve, reject) => {
                                        let run = takodb.run(EditFriend, [`${ListTakos[ca][co].id}`, `${ListTakos[ca][co].name}`, `${ListTakos[ca][co].url}`, interaction.user.id],
                                            async (err) => {
                                                if (err) {
                                                    reject(err); await closeDb(takodb);
                                                    return console.log(err, `Tako Copy Error.`);
                                                }
                                                resolve(run);
                                                return;
                                            });
                                    });

                                    FriendID = ListTakos[ca][co].id;
                                    FriendName = ListTakos[ca][co].name;
                                    FriendURL = ListTakos[ca][co].url;

                                    takoFriendEmbed = await TakoFriend(takoFriendEmbed, ListTakos[ca][co].name, ListTakos[ca][co].url, ListTakos[ca][co].id);

                                    await i.update({ embeds: [takoFriendEmbed], components: [RowButtons] })

                                    break;
                                }
                                case 'level': {
                                    let takorow = await GetTakoRow(FriendID);
                                    let embedArray = [];
                                    var TLevel = takorow.level;
                                    let maxlevel = (await GetMaxLevelaRarity(takorow.takoid, takorow.copies)).maxlevel;
                                    let cookies = givencookies;
                                    if (cookies >= 5000) { cookies = 5000 };

                                    if (TLevel >= maxlevel || TLevel >= 80 || UserCookies <= 0) {
                                        await i.update({ embeds: [takoFriendEmbed], components: [NoCookies] })
                                        break;
                                    }

                                    if (((UserCookies - cookies) < 0)) {
                                        UserCookies = 0;
                                        cookies = UserCookies;
                                        await i.update({ embeds: [takoFriendEmbed], components: [NoCookies] })
                                        break;
                                    }

                                    var TakoExp = takorow.exp + cookies;
                                    let LevelEmbed = await TakoLevelUp(TLevel, TakoExp);

                                    TLevel > 80 ? TLevel = 80 : TLevel;
                                    TLevel > maxlevel ? TLevel = maxlevel : TLevel;

                                    UserCookies = UserCookies - cookies;

                                    if (LevelEmbed && TLevel < maxlevel) {
                                        TLevel = LevelEmbed.newlevel;
                                        embedArray.push(LevelEmbed.embed);
                                        takoFriendEmbed.fields[1].value = `**【${TLevel}】** | Max: 【${maxlevel}】`;
                                    }

                                    CookieFunction(-1 * cookies, interaction.user.id, takodb);
                                    takodb.run(UpdateTakoLevelExp, [TakoExp, TLevel, row.tag, `${FriendID}`], (err, row) => { if (err) { return console.log(err, `Update Tako Level Exp Error.`) } });

                                    let Exp = await ExpBar(TakoExp, TLevel);

                                    takoFriendEmbed.fields[2].value = `${Exp.bar} ${Exp.per}%`;
                                    takoFriendEmbed.fields[3].value = `**【${UserCookies}】**${eCookie}\n**【${UserInk}】**${eInk}`;
                                    embedArray.push(takoFriendEmbed);
                                    await i.update({ embeds: embedArray, components: [RowButtons] })

                                    break;
                                }
                                case 'mult': {
                                    givencookies = givencookies * 2;
                                    if (givencookies > 5000) { givencookies = 5000 }

                                    if (givencookies > UserCookies) {
                                        givencookies = UserCookies;
                                        RowButtons.setComponents(levelb, retu, close)
                                    } else {
                                        RowButtons.setComponents(levelb, levelc, retu, close)
                                    }

                                    levelb.setLabel(`Give [${givencookies}] cookies.`)
                                    await i.update({ components: [RowButtons] })
                                    break;
                                }
                                case `close${interaction.user.id}`: {
                                    collector.stop();
                                    break;
                                }
                            }

                        } else {
                            return;
                        }
                    });

                    collector.on('end', async collected => {
                        takoFriendEmbed.title = `**Friend menu closed.**\n` + takoFriendEmbed.title;
                        ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                        closeDb(takodb);
                        await interaction.editReply({ embeds: [takoFriendEmbed], components: [] })
                    });

                    break;
                }
                case "list": {

                    let ListOption = interaction.options.getString('option');
                    let MessageArray = [], ListTakos = [], AdquiredTakos = [];
                    let AllTakoRow = await GetAllUserTakos();

                    for (var y = 0; y < ChannelArray.length; y++) {
                        MessageArray[y] = await getMessages(client.channels.cache.find(ch => ch.id == `${ChannelArray[y]}`), 150);
                    }

                    switch (ListOption) {
                        case "all": {
                            for (var x = 0; x < ChannelArray.length; x++) {
                                AdquiredTakos = [];
                                for (takose of MessageArray[x]) {

                                    var url = takose.attachments.first().url;
                                    let TakoData = takose.content.split("\n");
                                    var TakoID = TakoData[0]
                                    var TakoName = TakoData[1]
                                    var AuthorName = TakoData[2]

                                    if (!AllTakoRow.some(Tako => TakoData[0] == Tako.takoid)) {
                                        url = `https://cdn.discordapp.com/emojis/772622174027907092.webp`;
                                        if (TakoData[0].startsWith(`S`)) {
                                            TakoName = `????`;
                                            AuthorName = `????`;
                                        }
                                    }

                                    AdquiredTakos.push({ url: url, name: TakoName, id: TakoID, author: AuthorName, copies: false, level: false })
                                }

                                ListTakos.push(AdquiredTakos);
                            }
                            break;
                        }
                        case "collection": {

                            if (!AllTakoRow || AllTakoRow.length <= 0) {
                                await interaction.deferReply({ ephemeral: true });
                                await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                                closeDb(takodb);
                                return interaction.editReply({ content: `You dont have any Takos in your collection.\nTo get a Tako use \`\`/takogacha summon\`\`\nTo set friend use \`\`/takogacha friend\`\``, components: [] });
                            }

                            for (var x = 0; x < ChannelArray.length; x++) {
                                AdquiredTakos = [];
                                for (Tako of AllTakoRow) {
                                    let takose = MessageArray[x].find(m => m.content.split("\n")[0] == Tako.takoid);

                                    if (takose) {
                                        var url = takose.attachments.first().url;
                                        let TakoData = takose.content.split("\n");
                                        var TakoID = TakoData[0]
                                        var TakoName = TakoData[1]
                                        var AuthorName = TakoData[2]
                                        var copies = Tako.copies;
                                        var level = Tako.level;
                                        AdquiredTakos.push({ url: url, name: TakoName, id: TakoID, author: AuthorName, copies: copies, level: level })
                                    }
                                }
                                if (AdquiredTakos.length >= 1) {
                                    ListTakos.push(AdquiredTakos);
                                }
                            }
                            break;
                        }
                    }

                    await interaction.deferReply();

                    var MenuButtons = new ActionRowBuilder()
                    MenuButtons.addComponents(Mfowa, fowa, close, backwa, Mbackwa);

                    co = 0, ca = 0;
                    let listnum = ListTakos[ca].length - 1;
                    let listrar = ListTakos.length - 1;
                    if (ListTakos.length < 4) { EmojiArray = EmojiArray.slice(0, ListTakos.length - 4); }
                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, close);
                    await interaction.editReply({ embeds: [takoFriendMenu], components: [MenuButtons] })
                    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: cooldownTime });

                    collector.on('collect', async i => {
                        if (i.user.id === interaction.user.id) {

                            switch (i.customId) {
                                case `fow${interaction.user.id}`: {
                                    co += 1;
                                    if (co > listnum) { co = 0 };

                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, close);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `back${interaction.user.id}`: {
                                    co -= 1;
                                    if (co < 0) { co = listnum }

                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, close);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `mfow${interaction.user.id}`: {
                                    ca += 1;
                                    if (ca > listrar) { ca = 0 };
                                    co = 0;
                                    listnum = ListTakos[ca].length - 1;
                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, close);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `mback${interaction.user.id}`: {
                                    ca -= 1;
                                    if (ca < 0) { ca = listrar }
                                    co = 0;
                                    listnum = ListTakos[ca].length - 1;
                                    await TakoListEmbed(ca, co, ListTakos, listrar, listnum, takoFriendMenu, EmojiArray, close);

                                    await i.update({ embeds: [takoFriendMenu], components: [MenuButtons] })

                                    break;
                                }
                                case `close${interaction.user.id}`: {
                                    collector.stop();
                                    break;
                                }
                            }

                        } else {
                            return;
                        }
                    });

                    collector.on('end', async collected => {
                        takoFriendEmbed.title = `**List menu closed.**\n` + takoFriendEmbed.title;
                        ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                        closeDb(takodb);
                        await interaction.editReply({ embeds: [takoFriendMenu], components: [] })
                    });

                    break;
                }
                case "play": {

                    let FriendTako = await GetTakoFriendLevel(interaction.user.id);

                    if (!FriendTako) {
                        await interaction.deferReply({ ephemeral: true });
                        await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                        closeDb(takodb);
                        return interaction.editReply({ content: `You need a Tako friend to play.\nTo get a Tako use \`\`/takogacha summon\`\`\nTo set friend use \`\`/takogacha friend\`\`` });
                    }

                    var PlaycooldownTime = 3600000 * 1;
                    let ListOption = interaction.options.getString('game');
                    let PlayCooldown, CoolRow;

                    switch (ListOption) {
                        case `mystery`: {
                            PlaycooldownTime = 3600000;
                            PlayCooldown = PlayCool2;
                            CoolRow = row.cool2;
                            break;
                        }
                        case `trivia`: {
                            PlaycooldownTime = 900000;
                            PlayCooldown = PlayCool3;
                            CoolRow = row.cool3;
                            break;
                        }
                        case `whostako`: {
                            PlaycooldownTime = 600000;
                            PlayCooldown = PlayCool4;
                            CoolRow = row.cool4;
                            break;
                        }
                    }

                    let TimeRemain = await Cooldown(PlayCooldown, PlaycooldownTime, CoolRow, interaction.user.id, takodb)

                    if (TimeRemain) {
                        await interaction.deferReply({ ephemeral: true });
                        await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                        closeDb(takodb);
                        return interaction.editReply({ content: `You've already played, please wait \`\`${TimeRemain}\`\`` });
                    }

                    await interaction.deferReply();

                    let FriendLevel = FriendTako.level;
                    let wahPower = FriendTako.copies - 1;
                    var FriendMaxWah = await GetMaxLevelaRarity(row.friend, copies).maxwah;

                    switch (ListOption) {
                        case `mystery`: {

                            var PlayButtons = new ActionRowBuilder()

                            let enter = new ButtonBuilder()
                                .setEmoji(eCookie)
                                .setLabel(`Join game and add cookies.`)
                                .setCustomId(`enter${interaction.user.id}`)
                                .setStyle(ButtonStyle.Success)

                            let startb = new ButtonBuilder()
                                .setEmoji('✅')
                                .setCustomId(`start${interaction.user.id}`)
                                .setLabel('Start game.')
                                .setStyle(ButtonStyle.Success)

                            let increaseb = new ButtonBuilder()
                                .setEmoji('⤴️')
                                .setCustomId(`increase${interaction.user.id}`)
                                .setLabel('Double bet cookie amount.')
                                .setStyle(ButtonStyle.Primary)

                            PlayButtons.addComponents(enter, increaseb, startb);
                            let AllCookies = 0;
                            let ListOfPart = [{ user: interaction.user.id, total: row.cookies, used: 0 }];
                            let userMod = Math.round((FriendLevel * 1.5) + 80 * ((wahPower - 1) / FriendMaxWah));
                            let WinInk = randomnum(80 + userMod, 161 + userMod * 2);
                            let increment = 10, HostCookies = 0;

                            let mysteryEmbed = {
                                color: 0x8200a6,
                                title: `**Not Quite a Mystery Button**`,
                                description: `**Press the button to enter the game or increase your cookie bet.**\nHost can increase the amount of cookies bet per button press and start the game, otherwise game auto-starts after 3 minutes.\nThe host will get more cookies per participant!\n¡Anyone can win **${WinInk} Empti'nis Ink** and all the bet cookies!\nCurrently **${increment}** cookies per button press.`,
                                fields: [
                                    {
                                        name: '**Participants and Cookies.**',
                                        value: `<@${ListOfPart[0].user}> ➤ **${ListOfPart[0].used}**${eCookie}\n`
                                    },
                                ],
                                thumbnail: {
                                    url: `https://cdn.discordapp.com/emojis/868370098493227088.gif`
                                },
                            };

                            await interaction.editReply({ embeds: [mysteryEmbed], components: [PlayButtons] })
                            const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: cooldownTime });

                            collector.on('collect', async i => {
                                switch (i.customId) {
                                    case `enter${interaction.user.id}`: {

                                        let PartIndex = ListOfPart.findIndex(p => i.user.id == p.user);

                                        let UserRow = await new Promise((resolve, reject) => {
                                            takodb.get(SearchUser, [i.user.id], async (err, row) => {
                                                if (err) {
                                                    reject(err);
                                                    return console.error(err.message);
                                                } else {
                                                    resolve(row ? row : null);
                                                }
                                            });
                                        })

                                        if (!UserRow) { break; }

                                        if (PartIndex >= 0) {
                                            if (ListOfPart[PartIndex].total <= 0 || UserRow.cookies <= 0) {
                                                interaction.channel.send({ content: `${i.user} is cookieless.` })
                                                break;
                                            }

                                            if (ListOfPart[PartIndex].total <= increment) {
                                                ListOfPart[PartIndex].total = 0;
                                                ListOfPart[PartIndex].used += ListOfPart[PartIndex].total;
                                                AllCookies += ListOfPart[PartIndex].total;
                                            } else {
                                                ListOfPart[PartIndex].total -= increment;
                                                ListOfPart[PartIndex].used += increment;
                                                AllCookies += increment;
                                            }

                                            let entry = mysteryEmbed.fields[0].value.split(`\n`);
                                            entry[PartIndex] = `<@${ListOfPart[PartIndex].user}> ➤ **${ListOfPart[PartIndex].used}**${eCookie}`
                                            entry = entry.join(`\n`);
                                            mysteryEmbed.fields[0].value = entry;
                                        } else {
                                            let TimeRemain = await Cooldown(PlayCool1, cooldownTime, UserRow.cool1, i.user.id, takodb)
                                            if (TimeRemain) {
                                                interaction.channel.send({ content: `${i.user} is already in a game.` })
                                                break;
                                            }
                                            ListOfPart.push({ user: i.user.id, total: UserRow.cookies, used: 0 })
                                            mysteryEmbed.fields[0].value += `<@${i.user.id}> ➤ **0**${eCookie}\n`
                                        }

                                        HostCookies = Math.round(userMod * (ListOfPart.length / 10));
                                        mysteryEmbed.description = `**Press the button to enter the game or increase your cookie bet.**\nHost can increase the cookies bet per button press and also start the game, the game auto-starts after 3 minutes.\nThe host will get **${HostCookies}** cookies!\n¡Anyone can win **${WinInk} Empti'nis Ink** and all the bet cookies!\nCurrently **${increment}** cookies per button press.`;
                                        await i.update({ embeds: [mysteryEmbed], components: [PlayButtons] })
                                        break;
                                    }
                                    case `increase${interaction.user.id}`: {
                                        if (i.user.id != interaction.user.id) { break; }
                                        increment = increment * 2;
                                        if (increment >= 20000) { increment == 20000 }
                                        mysteryEmbed.description = `**Press the button to enter the game or increase your cookie bet.**\nHost can increase the cookies bet per button press and also start the game, the game auto-starts after 3 minutes.\nThe host will get **${HostCookies}** cookies!\nAnyone can win **${WinInk} Empti'nis Ink** and all the bet cookies!\nCurrently **${increment}** cookies per button press.`;
                                        await i.update({ embeds: [mysteryEmbed], components: [PlayButtons] })
                                        break;
                                    }
                                    case `start${interaction.user.id}`: {
                                        if (i.user.id != interaction.user.id) { break; }
                                        collector.stop();
                                        break;
                                    }
                                }
                            });

                            collector.on('end', async collected => {

                                if (ListOfPart.length > 1) {

                                    let winner = await getRandom(ListOfPart, 1)[0];
                                    CookieFunction(AllCookies, winner.user, takodb);
                                    HostCookies = Math.round(userMod * (ListOfPart.length / 10));
                                    CookieFunction(HostCookies, interaction.user.id, takodb);

                                    InkFunction(WinInk, winner.user, takodb);
                                    ListofPart = ListOfPart.filter(P => P.user == winner.user);

                                    for (Part of ListOfPart) {
                                        CookieFunction((-1 * Part.used), Part.user, takodb);
                                        ResetCooldown(PlayCool1, cooldownSet, row.cool1, Part.user, takodb);
                                    }

                                    mysteryEmbed.description = `Game Finished!\n${interaction.user} got **${HostCookies}** ${eCookie}!\nWinner is <@${winner.user}>, got **${WinInk}**${eInk} and **${AllCookies}**${eCookie}!`

                                } else {
                                    mysteryEmbed.description = `Game closed, not enough players, try again!`
                                    ResetCooldown(PlayCooldown, cooldownSet, row.cool2, interaction.user.id, takodb);
                                }

                                ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                                await interaction.editReply({ embeds: [mysteryEmbed], components: [] })
                                await closeDb(takodb);
                            });

                            break;
                        }
                        case `trivia`: {
                            await sleep(randomnum(100, 1000));

                            var PlayButtons = new ActionRowBuilder()

                            let QuestionData = await new Promise((resolve, reject) => {
                                fs.readFile(TriviaQ, async (err, data) => {
                                    if (err) { throw err; } else {
                                        let ndata = JSON.parse(data);
                                        resolve(ndata ? ndata : null);
                                    }
                                })
                            })

                            let R = randomnum(0, QuestionData.length);
                            let SelectedQ = QuestionData[R];
                            ButtonAr = [];

                            SelectedQ.options = getRandom(SelectedQ.options, 4);

                            for (answer in SelectedQ.options) {
                                let optionb = new ButtonBuilder()
                                    .setLabel(`${SelectedQ.options[answer]}`)
                                    .setCustomId(`${answer}`)
                                    .setStyle(ButtonStyle.Secondary)
                                ButtonAr.push(optionb)
                            }

                            PlayButtons.setComponents(...ButtonAr);

                            let mysteryEmbed = {
                                color: 0x8200a6,
                                title: `**Tentacular Trivia**`,
                                description: `**${SelectedQ.question}**\n ${interaction.user} choose the correct answer!`,
                                thumbnail: {
                                    url: `https://cdn.discordapp.com/emojis/971680405038198784.webp`
                                },
                            };

                            await interaction.editReply({ embeds: [mysteryEmbed], components: [PlayButtons] })
                            const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: cooldownTime });

                            collector.on('collect', async i => {
                                if (i.user.id === interaction.user.id) { } else { return; }

                                if (SelectedQ.options[i.customId] == SelectedQ.answer) {
                                    let WinCookies = Math.round((FriendLevel * 4) + 80 * ((wahPower - 1) / FriendMaxWah));
                                    let WinInk = Math.round((FriendLevel * 1.5) + 80 * ((wahPower - 1) / FriendMaxWah));
                                    WinCookies <= 2 ? WinCookies = 3 : WinCookies;
                                    WinInk <= 2 ? WinInk = 3 : WinInk;
                                    mysteryEmbed.description = `|| **${SelectedQ.answer}** || that's the correct answer!!\nYou got **${WinCookies}** cookies ${eCookie} and **${WinInk}** ink ${eInk}.`
                                    CookieFunction(WinCookies, interaction.user.id, takodb);
                                    InkFunction(WinInk, interaction.user.id, takodb);
                                } else {
                                    mysteryEmbed.description = `|| **${SelectedQ.options[i.customId]}**? || wrong answer, || **${SelectedQ.answer}** || was the correct answer.`
                                }

                                await i.update({ embeds: [mysteryEmbed], components: [] })
                                collector.stop();
                            });

                            collector.on('end', async collected => {
                                ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                                closeDb(takodb);
                            });

                            break;
                        }
                        case "whostako": {

                            var PlayButtons = new ActionRowBuilder()
                            let ArrayOfTakos = [], MessageArray = [];
                            for (var i = 0; i < ChannelArray.length; i++) {
                                MessageArray[i] = await getMessages(client.channels.cache.find(ch => ch.id == `${ChannelArray[i]}`), 150);
                            }

                            let Chance = { 0: 0.57, 1: 0.3, 2: 0.1, 3: 0.03 };

                            for (var x = 0; x < 4; x++) {
                                var gacharesult = weightedRandom(Chance);
                                var takomes = MessageArray[gacharesult];
                                var randomindex = randomnum(0, takomes.length);
                                var takose = takomes[randomindex];
                                MessageArray[gacharesult].splice(randomindex, 1);
                                var url = takose.attachments.first().url;
                                let TakoData = takose.content.split("\n");
                                var TakoID = TakoData[0]
                                var TakoName = TakoData[1]
                                var AuthorName = TakoData[2]
                                var TakoWAH = TakoData[3];
                                ArrayOfTakos.push({ name: TakoName, url: url, id: TakoID, author: AuthorName })
                            }

                            let random = randomnum(0, 4);
                            let effectrandom = randomnum(1, 11);
                            let ChosenTako = ArrayOfTakos[random];

                            let ChoTakoIma = await Jimp.read(`${ChosenTako.url}`);
                            effectrandom % 2 == 0 ? ChoTakoIma.blur(20) : ChoTakoIma.brightness(-1)

                            await ChoTakoIma.writeAsync(`./TakoChosen.png`);
                            file = new AttachmentBuilder('./TakoChosen.png');

                            let whostakoEmbed = {
                                color: 0x8200a6,
                                title: `**Who's that Tako?!**`,
                                description: `${interaction.user} choose the correct answer!`,
                                image: {
                                    url: `attachment://TakoChosen.png`
                                },
                            };

                            let ButtonAr = [];
                            for (ThisTako of ArrayOfTakos) {
                                let optionb = new ButtonBuilder()
                                    .setLabel(`${ThisTako.name}`)
                                    .setCustomId(`${ThisTako.id}`)
                                    .setStyle(ButtonStyle.Secondary)
                                ButtonAr.push(optionb)
                            }

                            PlayButtons.setComponents(...ButtonAr);

                            await interaction.editReply({ embeds: [whostakoEmbed], components: [PlayButtons], files: [file] })
                            const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: cooldownTime });

                            collector.on('collect', async i => {
                                if (i.user.id === interaction.user.id) { } else { return; }

                                if (i.customId == ChosenTako.id) {
                                    let WinCookies = Math.round((FriendLevel * (1 + gacharesult)) + 80 * ((wahPower - 1) / FriendMaxWah));
                                    let WinInk = Math.round((FriendLevel * (1 + (gacharesult * 0.25))) + 80 * ((wahPower - 1) / FriendMaxWah));
                                    WinCookies <= 2 ? WinCookies = 3 : WinCookies;
                                    WinInk <= 2 ? WinInk = 3 : WinInk;
                                    whostakoEmbed.description = `|| **${ChosenTako.name}** || that's the correct tako!!\nYou got **${WinCookies}** cookies ${eCookie} and **${WinInk}** ink ${eInk}.`
                                    CookieFunction(WinCookies, interaction.user.id, takodb);
                                    InkFunction(WinInk, interaction.user.id, takodb);
                                } else {
                                    whostakoEmbed.description = `That's not right, this tako is ||**${ChosenTako.name}**||!`
                                }

                                whostakoEmbed.image.url = `${ChosenTako.url}`
                                await i.update({ embeds: [whostakoEmbed], components: [], files: [] })
                                collector.stop();
                            });

                            collector.on('end', async collected => {
                                ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                                closeDb(takodb);
                            });

                            break;
                        }
                    }

                    break;
                }
                case "dailybonus": {

                    if (row.cooldaily == 1) {
                        await interaction.deferReply({ ephemeral: true });
                        await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                        await closeDb(takodb);
                        return interaction.editReply({ content: `You've already reclaimed your daily bonus, please wait until reset <t:1600027200:t> (This is your local time)` });
                    }

                    await interaction.deferReply();
                    await takodb.run(DailyCooldown, [1, interaction.user.id], (err) => { if (err) { return console.log(err, `Cooldown error.`) } return; });
                    let WinInk = randomnum(160, 681);

                    let DailyEmbed = {
                        color: 0x8200a6,
                        title: `**Daily Bonus!**`,
                        description: `You got **${WinInk}** Empti'nis Ink ${eInk}.`,
                        thumbnail: {
                            url: `https://cdn.discordapp.com/emojis/974610560639455255.gif`
                        },
                    };

                    switch (true) {
                        case (Date.now() >= Date.parse(new Date("2024-05-19T12:00:00Z"))) && (Date.now() <= Date.parse(new Date("2024-05-21T12:00:00Z"))):
                            {
                                WinInk = WinInk * 8;
                                DailyEmbed.title = `It's Ina's Birthday!!! 🎉`
                                DailyEmbed.description += `\nYou got bonus Empti'nis Ink!!`
                                DailyEmbed.thumbnail.url = `https://cdn.discordapp.com/emojis/753187288632000603.gif`
                                break;
                            }
                        case (Date.now() >= Date.parse(new Date("2024-09-11T12:00:00Z"))) && (Date.now() <= Date.parse(new Date("2024-09-13T12:00:00Z"))):
                            {
                                WinInk = WinInk * 8;
                                DailyEmbed.title = `It's Ina's Anniversary!!! 🎉`
                                DailyEmbed.description += `\nYou got bonus Empti'nis Ink!!`
                                DailyEmbed.thumbnail.url = `https://cdn.discordapp.com/emojis/753187288632000603.gif`
                                break;
                            }
                    }

                    InkFunction(WinInk, interaction.user.id, takodb);

                    await interaction.editReply({ embeds: [DailyEmbed] })
                    await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                    closeDb(takodb);
                    break;
                }
                case "help": {

                    await interaction.deferReply({ ephemeral: true });

                    let HelpEmbed = {
                        color: 0xdc5bff,
                        title: `**Takogacha Help and Information**`,
                        description: `WAH!`,
                        fields: [{
                            name: '**【Rates】**',
                            value: `Rarity is based on classes which are the following along side their probability:\n\n**Takoling Class: 57%\nOtako Class: 30%\nTentacultist Class: 10%\nAncient One Class: 3%**\n\nProbability of getting a specific Tako is split between the total Takos of that rarity.\nNote: Some Ancient One takos have requirements to be unlocked for summon.`,
                        },
                        {
                            name: `**【Summoning】**`,
                            value: `This is the way to get new Takodachis.\nBefore summoning you need to set the number of WAH's you want aka how many takodachis you want to summon, when the command is sent, a menu will appear where all summoned takos can be seen.\nSummoning a Takodachi costs 80 **Emptini's Ink**, ink will be consumed automatically according to the number of summons. Ink can be acquired by playing certain minigames that are part of the Takogacha.\nOn duplicates WAH power increases by one and get cookies acordingly to the current WAH Power.`,
                        },
                        {
                            name: `**【Friend】**`,
                            value: `You can set any summoned Tako as a friend.\nTakodachis have rarity class, WAH power, level and max level.\nRarity class determines the default max level these being:\n\n**Takoling Class: lvl30\nOtako Class: lvl40\nTentacultist Class: lvl50\nAncient One Class: lvl60**\n\nWAH power increases when getting tako duplicates, this increases the tako max level by its value.\nAnd current level determines the amount of certain prizes when playing on minigames, the higher the level of the active Tako friend, the higher the prizes.\nYou can level up Takodachis in the friend menu by giving them cookies, they will level up every time their current level bar gets to 100%.`
                        },
                        {
                            name: `**【Playing】**`,
                            value: `This is the main way to get Ink and Cookies.\nThere's a variety of games and you can choose what to play by using the "/takogacha play <your selected game>" command.\nThe play command has two kinds of cooldown that depends on the last game, so choose wisely.`,
                        },
                        {
                            name: `**【Daily Bonus】**`,
                            value: `Everyone can get a random amount of Empti'nis Ink daily, this goes from 160 to 480 or 2 to 6 summons. The daily bonus resets every day at <t:1600027200:t> (This is your local time)`,
                        },
                        {
                            name: `**【Lists and collection】**`,
                            value: `All Takodachi previews can be seen with the list command, it can be set to show your own collection or all available Takodachis.`,
                        }
                        ]
                    };

                    await interaction.editReply({ embeds: [HelpEmbed], ephemeral: true })
                    await ResetCooldown(PlayCool1, cooldownSet, row.cool1, interaction.user.id, takodb);
                    closeDb(takodb);

                    break;
                }
            }
        }
    },
};