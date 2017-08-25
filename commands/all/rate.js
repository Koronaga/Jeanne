const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

const RATES = [
    "1/10",
    "2/10",
    "3/10",
    "4/10",
    "5/10",
    "6/10",
    "7/10",
    "8/10",
    "9/10",
    "10/10",
    "11/10 :ok_hand:"
];

module.exports = {
    desc: "Rates your waifu.",
    usage: "<name>",
    aliases: ['rw', 'rwaifu'],
    cooldown: 2,
    guildOnly: true,
    task(bot, msg, suffix) {
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (sendMessages === false) return;
        if (!suffix) return 'wrong usage';
        rateTimesUsed++
        const str = suffix.toString(),
            lower = str.toLowerCase();
        let choice = ~~(Math.random() * RATES.length);
        if (lower === 'kurozero') return bot.createMessage(msg.channel.id, ` My master is always an 11/10 :heart:`)
            .catch(err => {
                handleError(bot, err);
            });
        if (!msg.mentions[0]) return bot.createMessage(msg.channel.id, suffix + ` is a ${RATES[choice]} waifu`)
            .catch(err => {
                handleError(bot, err);
            });
        if (msg.mentions[0].id === "93973697643155456") return bot.createMessage(msg.channel.id, ` My master is always an 11/10 :heart:`)
            .catch(err => {
                handleError(bot, err);
            });
        bot.createMessage(msg.channel.id, suffix + ` is a ${RATES[choice]} waifu`)
            .catch(err => {
                handleError(bot, err);
            });
    }
};