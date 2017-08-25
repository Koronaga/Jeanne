const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "The link to add me to a server.",
    aliases: ['oauth'],
    cooldown: 5,
    guildOnly: true,
    task(bot, msg, _, config) {
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (sendMessages === false) return;
        inviteTimesUsed++
        if (config.inviteLink) {
            bot.createMessage(msg.channel.id, `Use this to add me to a server: ${config.inviteLink}\nMake sure you are logged in`)
                .catch(err => {
                    handleError(bot, err);
                });
        } else {
            bot.createMessage(msg.channel.id, 'No invite link defined')
                .catch(err => {
                    handleError(bot, err);
                });
        }
    }
};