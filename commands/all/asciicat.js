const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    catMe = require('cat-me');

module.exports = {
    desc: "Sends a unicode cat ;3",
    usage: "[option] ('list' to view all options)",
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
                handleError(bot, err);
            });
        asciicatTimesUsed++
        let cat = catMe();
        if (!args) return msg.channel.createMessage(`\`\`\`${cat}\`\`\``)
            .catch(err => {
                handleError(bot, err);
            });
        let lower = args.toLowerCase();
        if (lower === 'list') {
            msg.channel.createMessage({
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        author: {
                            name: `All cat options:`,
                            url: ``,
                            icon_url: ``
                        },
                        description: `grumpy
approaching
tubby
confused
playful
thoughtful
delighted
nyan
resting`
                    }
                })
                .catch(err => {
                    handleError(bot, err);
                });
        } else {
            cat = catMe(`${args}`);
            msg.channel.createMessage(`\`\`\`${cat}\`\`\``)
                .catch(err => {
                    handleError(bot, err);
                });
        }
    }
};