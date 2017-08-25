const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Prunes the given number of messages. If no number is given it's standard 50.",
    usage: "<number>",
    aliases: ['purge', 'clear'],
    guildOnly: true,
    requiredPermission: 'manageMessages',
    task(bot, msg, suffix) {
        /**
         * perm checks
         * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
         * @param {boolean} manageMessages - Checks if the bots permissions has manageMessages
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
        const manageMessages = msg.channel.permissionsOf(bot.user.id).has('manageMessages');
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (sendMessages === false) return;
        if (embedLinks === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(bot, err);
            });
        if (manageMessages === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`manageMessages\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(bot, err);
            });
        pruneTimesUsed++
        if (!suffix) {
            var limit = 50 + 1; // +1 for the command message kek
        } else if (suffix) {
            var count = parseInt(suffix),
                msgTodelete = count + 1, // yea same here nugget
                limit = msgTodelete;
            if (limit > 100) return msg.channel.createMessage({
                    content: ``,
                    embed: {
                        color: config.errorColor,
                        title: `Exceeded max messages to delete`,
                        description: `Messages to delete is limited to 100.`
                    }
                })
                .catch(err => {
                    handleError(bot, err);
                });
        }
        bot.purgeChannel(msg.channel.id, limit)
            .then((del, sentMsg) => {
                const delmsg = del - 1 // Don't count the command message
                bot.createMessage(msg.channel.id, {
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        author: {
                            name: ``,
                            url: ``,
                            icon_url: ``
                        },
                        description: `Deleted: ${delmsg} messages`,
                        footer: {
                            text: `This message will auto delete in 3 seconds`
                        }
                    }
                }).then(sentMsg => {
                    setTimeout(() => {
                        bot.deleteMessage(sentMsg.channel.id, sentMsg.id)
                            .catch(err => {
                                handleError(bot, err);
                            });
                    }, 3000);
                }).catch(err => {
                    handleError(bot, err);
                });
            }).catch(err => {
                handleError(bot, err);
            });
    }
};