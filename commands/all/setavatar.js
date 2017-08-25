const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    setAvatar = require('../../utils/utils.js').setAvatar;

module.exports = {
    desc: "Set the bot's avatar from a URL.",
    usage: "<url>",
    hidden: true,
    ownerOnly: true,
    task(bot, msg, suffix) {
        setAvatar(bot, suffix)
            .then(() => {
                bot.createMessage(msg.channel.id, 'Avatar updated')
                    .catch(err => {
                        handleError(bot, err);
                    });
            })
            .catch(error => {
                handleMsgError(msg.channel, error);
            });
    }
};