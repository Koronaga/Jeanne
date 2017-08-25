const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    request = require('request-promise-native');

module.exports = {
    desc: "Sends a random ass pic.",
    cooldown: 5,
    guildOnly: true,
    task(bot, msg, args, config, settingsManager) {
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
        const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
        if (!nsfw) return msg.channel.createMessage('You can only use this command in an **nsfw** channels, use \`j:settings nsfw <allow/deny>\`.')
            .catch(err => {
                handleError(bot, err);
            });
        assTimesUsed++
        request.get(`http://api.obutts.ru/butts/0/1/random`)
            .then(JSON.parse)
            .then(res => {
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: ``,
                                url: ``,
                                icon_url: ``
                            },
                            description: ``,
                            image: {
                                url: `http://media.obutts.ru/${res[0].preview}`
                            }
                        }
                    })
                    .catch(err => {
                        handleError(bot, err);
                    });
            })
            .catch(err => {
                handleMsgError(bot, msg.channel, err);
            });
    }
};