const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Sends a lenny.",
    guildOnly: true,
    task(bot, msg) {
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (sendMessages === false) return;
        lennyTimesUsed++
        bot.createMessage(msg.channel.id, `( ͡° ͜ʖ ͡°)`)
            .catch(err => {
                handleError(err);
            });
    }
}