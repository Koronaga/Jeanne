const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Echo",
    usage: "<text>",
    aliases: ['echo'],
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
        sayTimesUsed++
        bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.defaultColor,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `:speech_balloon: ${args}` || 'echo'
            }
        }).catch(err => {
            handleError(err);
        });
    }
};