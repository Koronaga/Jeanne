const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    adorasult = require("adorasult");

module.exports = {
    desc: "Generate fun insults.",
    usage: "<username | ID | @username>",
    cooldown: 5,
    guildOnly: true,
    aliases: ['finsult'],
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
        funinsultTimesUsed++
        if (!args) {
            const insult = adorasult();
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
                handleError(err);
            });
        } else {
            const insult = adorasult();
            const user = this.findMember(msg, args)
            if (!user) return bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: 0xff0000,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `That is not a valid guild member. Need to specify a name, ID or mention the user.`
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
                    description: `${user.username}, ${insult}`
                },
            }).catch(err => {
                handleError(err);
            });
        }
    }
};