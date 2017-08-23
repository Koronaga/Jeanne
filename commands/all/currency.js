const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    currency = require('y-currency');

module.exports = {
    desc: "Convert currency",
    usage: "<value> | <from_currency> | <to_currency> (Make sure to seperate them with a |)\nex. j:currency 10 | EUR | USD",
    aliases: ['cc'],
    guildOnly: true,
    cooldown: 10,
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
        if (!args) return 'wrong usage';
        const str = args.toString();
        const array = str.split(/ ?\| ?/),
            value = parseInt(array[0], 10),
            fromCurrency = array[1],
            toCurrency = array[2];
        currencyTimesUsed++
        currency.convert(value, fromCurrency, toCurrency, (err, conv) => {
            if (err) return handleMsgError(msg.channel, err);
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: `${msg.author.username}`,
                        url: `${msg.author.avatarURL}`,
                        icon_url: `${msg.author.avatarURL}`
                    },
                    description: `${fromCurrency}: ${value}
${toCurrency}: ${conv}`
                }
            }).catch(err => {
                handleError(err);
            });
        })
    }
};