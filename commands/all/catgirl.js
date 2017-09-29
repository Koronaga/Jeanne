const reload = require('require-reload'),
    config = reload('../../config.json'),
    version = reload('../../package.json').version,
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
        args = args.toLowerCase();
        if (!args || args === 'sfw') {
            catgirlSFWTimesUsed++
            axios.get('https://nekos.brussell.me/api/v1/random/image?nsfw=false', {
                    headers: {
                        'User-Agent': `${bot.user.username}/${version} - (https://github.com/KurozeroPB/Jeanne)`
                    }
                })
                .then(res => {
                    const data = res.data;
                    console.log(res);
                    bot.createMessage(msg.channel.id, {
                            content: ``,
                            embed: {
                                color: config.defaultColor,
                                author: {
                                    name: ``,
                                    url: ``,
                                    icon_url: ``
                                },
                                description: `\\😺 [\`Direct image link\`](https://nekos.brussell.me/image/${data.images[0].id})`,
                                image: {
                                    url: `https://nekos.brussell.me/image/${data.images[0].id}`
                                },
                                footer: {
                                    text: `Images from nekos.brussell.me`,
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
            axios.get('https://nekos.brussell.me/api/v1/random/image?nsfw=true', {
                    headers: {
                        'User-Agent': `${bot.user.username}/${version} - (https://github.com/KurozeroPB/Jeanne)`
                    }
                })
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
                                description: `\\😳 [\`Direct image link\`](https://nekos.brussell.me/image/${data.images[0].id})`,
                                image: {
                                    url: `https://nekos.brussell.me/image/${data.images[0].id}`
                                },
                                footer: {
                                    text: `Images from nekos.brussell.me`,
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