const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

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
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
        if (sendMessages === false) return;
        if (embedLinks === false) return msg.channel.createMessage(`\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(err);
            });
        spinTimesUsed++
        let choice1 = ~~(Math.random() * RESPONSES.length);
        let choice2 = ~~(Math.random() * RESPONSES.length);
        let choice3 = ~~(Math.random() * RESPONSES.length);
        var delay = 2000;
        bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    title: ``,
                    description: `**${msg.author.username}** spinned and got...`
                }
            })
            .then(sentMsg => {
                setTimeout(() => {
                    if (choice1 == choice2 && choice2 == choice3) {
                        bot.editMessage(sentMsg.channel.id, sentMsg.id, {
                                content: ``,
                                embed: {
                                    color: 0x13c124,
                                    title: `You spinned: ${RESPONSES[choice1]} | ${RESPONSES[choice2]} | ${RESPONSES[choice3]}`,
                                    description: `You won! Here's a cookie :cookie:`
                                }
                            })
                            .catch(err => {
                                handleError(err);
                            });
                    } else if ((choice1 == choice2) || (choice1 == choice3) || (choice2 == choice3)) {
                        bot.editMessage(sentMsg.channel.id, sentMsg.id, {
                                content: ``,
                                embed: {
                                    color: 0xff8605,
                                    title: `You spinned: ${RESPONSES[choice1]} | ${RESPONSES[choice2]} | ${RESPONSES[choice3]}`,
                                    description: `You almost got it!`
                                }
                            })
                            .catch(err => {
                                handleError(err);
                            });
                    } else {
                        bot.editMessage(sentMsg.channel.id, sentMsg.id, {
                                content: ``,
                                embed: {
                                    color: 0xc11313,
                                    title: `You spinned: ${RESPONSES[choice1]} | ${RESPONSES[choice2]} | ${RESPONSES[choice3]}`,
                                    description: `It's not even close...`
                                }
                            })
                            .catch(err => {
                                handleError(err);
                            });
                    }
                }, delay);
            }).catch(err => {
                handleError(err);
            });
    }
}