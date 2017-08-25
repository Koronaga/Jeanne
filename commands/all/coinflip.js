const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Flip a coin.",
    aliases: ['coin', 'flip'],
    cooldown: 1,
    guildOnly: true,
    task(bot, msg) {
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (sendMessages === false) return;
        coinflipTimesUsed++
        bot.createMessage(msg.channel.id, `${msg.author.username} flipped a coin and it landed on ${Math.random() < .5 ? '**heads**' : '**tails**'}`)
            .catch(err => {
                handleMsgError(bot, msg.channel, err);
            });
    }
};