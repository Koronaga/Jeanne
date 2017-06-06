const RESPONSES = [
    ":apple:",
    ":pear:",
    ":tangerine:",
    ":lemon:",
    ":banana:",
    ":watermelon:",
    ":grapes:",
    ":strawberry:",
    ":cherries:",
    ":peach:",
    ":cookie:"
];

module.exports = {
    desc: "Spin the slot machine and see what you get",
    cooldown: 5,
    aliases: ['slot', 'slots', 'slotmachine'],
    task(bot, msg) {
        let choice1 = ~~(Math.random() * RESPONSES.length);
        let choice2 = ~~(Math.random() * RESPONSES.length);
        let choice3 = ~~(Math.random() * RESPONSES.length);
        var delay = 2000;
        bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: 0x13a1c1,
                title: ``,
                description: `**${msg.author.username}** spinned and got...`
            }
        }).then(sentMsg => {
            setTimeout(function() {
                if (choice1 == choice2 && choice2 == choice3) {
                    bot.editMessage(sentMsg.channel.id, sentMsg.id, {
                        content: ``,
                        embed: {
                            color: 0x13c124,
                            title: `You spinned: ${RESPONSES[choice1]} | ${RESPONSES[choice2]} | ${RESPONSES[choice3]}`,
                            description: `You won! Here's a cookie :cookie:`
                        }
                    })
                } else if ((choice1 == choice2) || (choice1 == choice3) || (choice2 == choice3)) {
                    bot.editMessage(sentMsg.channel.id, sentMsg.id, {
                        content: ``,
                        embed: {
                            color: 0xff8605,
                            title: `You spinned: ${RESPONSES[choice1]} | ${RESPONSES[choice2]} | ${RESPONSES[choice3]}`,
                            description: `You almost got it!`
                        }
                    })
                } else {
                    bot.editMessage(sentMsg.channel.id, sentMsg.id, {
                        content: ``,
                        embed: {
                            color: 0xc11313,
                            title: `You spinned: ${RESPONSES[choice1]} | ${RESPONSES[choice2]} | ${RESPONSES[choice3]}`,
                            description: `It's not even close...`
                        }
                    })
                }
            }, delay);
        }).catch(err => {
            const error = JSON.parse(err.response);
            if (error.code === 50013) {
                bot.createMessage(msg.channel.id, `❌ I do not have the required permissions for this command to function normally.`).catch(err => {
                    bot.getDMChannel(msg.author.id).then(dmchannel => {
                        dmchannel.createMessage(`I tried to respond to a command you used in **${msg.channel.guild.name}**, channel: ${msg.channel.mention}.\nUnfortunately I do not have the required permissions. Please speak to the guild owner.`).catch(err => {
                            return;
                        });
                    }).catch(err => {
                        return;
                    });
                });
            } else {
                bot.createMessage(msg.channel.id, `
\`\`\`
ERROR
Code: ${error.code}
Message: ${error.message}

For more help join the support server.
Get the invite link by doing s.support
\`\`\`
`).catch(err => {
                    return;
                });
            }
        });
    }
}