async function mysterybutton(){

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
    let WinInk = randomnum(80 + userMod, 81 + userMod * 2);
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
}

async function tentaculartrivia() {
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

}