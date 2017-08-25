const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Pins the message with the given message id.",
    usage: "<Message ID>",
    requiredPermission: 'manageMessages',
    task(bot, msg, suffix) {
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
        if (!suffix) return 'wrong usage'
        pinTimesUsed++
        const idRegex = /^\d{17,18}$/.test(suffix);
        if (idRegex === false) return bot.createMessage(msg.channel.id, `\\❌ Invalid message id.`)
            .catch(err => {
                handleError(bot, err);
            });
        bot.pinMessage(msg.channel.id, suffix)
            .catch(err => {
                handleError(bot, err);
            });
    }
};