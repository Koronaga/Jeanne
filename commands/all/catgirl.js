const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    axios = require('axios');

module.exports = {
    desc: "Sends a cute catgirl.",
    usage: "<sfw/nsfw>",
    cooldown: 10,
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
                handleError(bot, __filename, msg.channel, err);
            });
        if (!args) return 'wrong usage';
        args = args.toLowerCase();
        if (args === 'sfw') {
            catgirlSFWTimesUsed++
            axios.get('http://catgirls.brussell98.tk/api/random')
                .then(res => {
                    const data = res.data;
                    bot.createMessage(msg.channel.id, {
                            content: ``,
                            embed: {
                                color: config.defaultColor,
                                author: {
                                    name: ``,
                                    url: ``,
                                    icon_url: ``
                                },
                                description: `\\😺 [\`Direct image link\`](${data.url})`,
                                image: {
                                    url: data.url
                                },
                                footer: {
                                    text: `Images from catgirls.brussell98.tk`,
                                    icon_url: ``
                                }
                            }
                        })
                        .catch(err => {
                            if (!err.response) return logger.error(err, 'ERROR');
                            error = JSON.parse(err.response);
                            if ((!error.code) && (!error.message)) return logger.error(err, 'ERROR');
                            logger.error(error.code + '\n' + error.message, 'ERROR');
                        });
                })
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
        } else if (args === 'nsfw') {
            const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
            if (!nsfw) return bot.createMessage(msg.channel.id, 'You can only use this in **nsfw** channels, use \`j:settings nsfw <allow/deny>\`.\nFor sfw catgirls use \`s.catgirl sfw\`.')
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            catgirlNSFWTimesUsed++
            axios.get('http://catgirls.brussell98.tk/api/nsfw/random/')
                .then(res => {
                    const data = res.data;
                    bot.createMessage(msg.channel.id, {
                            content: ``,
                            embed: {
                                color: config.defaultColor,
                                author: {
                                    name: ``,
                                    url: ``,
                                    icon_url: ``
                                },
                                description: `\\😳 [\`Direct image link\`](${data.url})`,
                                image: {
                                    url: data.url
                                },
                                footer: {
                                    text: `Images from catgirls.brussell98.tk/nsfw`,
                                    icon_url: ``
                                }
                            }
                        })
                        .catch(err => {
                            handleError(bot, __filename, msg.channel, err);
                        });
                })
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
        } else {
            return 'wrong usage';
        }
    }
};