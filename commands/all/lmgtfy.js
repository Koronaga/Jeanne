const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    lmgtfy = require('lmgtfy');

module.exports = {
    desc: "Let me google that.",
    usage: "<text>",
    cooldown: 5,
    guildOnly: true,
    task(bot, msg, args) {
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
        if (!args) return 'wrong usage';
        lmgtfyTimesUsed++
        let result = lmgtfy(`${args}`);
        if (!result) return bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: 0xff0000,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `Ewps couldn't get any results.`
            }
        }).catch(err => {
            handleError(err);
        });
        bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.defaultColor,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `:arrow_right: ${result}`
            }
        }).catch(err => {
            handleError(err);
        });
    }
};