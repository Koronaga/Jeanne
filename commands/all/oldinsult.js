const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    findMember = require('../../utils/utils.js').findMember;

module.exports = {
    desc: "Generate old shakespeare-rified insult.",
    usage: "<username | ID | @username>",
    cooldown: 5,
    guildOnly: true,
    aliases: ['oinsult'],
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
                handleError(bot, __filename, msg.channel, err);
            });
        oldinsultTimesUsed++
        const oldinsult = require('shakespeare-insult1.1.0').random();
        if (!args) {
            const insult = oldinsult;
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `${insult}`
                },
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else {
            const insult = oldinsult;
            const user = findMember(msg, args)
            if (!user) return bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.errorColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `That is not a valid guild member. Need to specify a name, ID or mention the user.`
                }
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
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
                    description: `${user.username}, ${insult}`
                },
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        }
    }
};