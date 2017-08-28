const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError;

module.exports = {
    desc: "Set the bot's username.",
    usage: "<username>",
    hidden: true,
    ownerOnly: true,
    task(bot, msg, args) {
        if (!args) return bot.createMessage(msg.channel.id, 'Maybe you should give me a name to use?');
        bot.editSelf({ username: args, avatar: bot.user.avatar })
            .then(() => {
                bot.createMessage(msg.channel.id, 'Username updated')
                    .catch(err => {
                        handleError(bot, __filename, msg.channel, err);
                    })
            })
            .catch(error => {
                handleError(bot, __filename, msg.channel, err);
            });
    }
};