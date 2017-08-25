const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    request = require('request');

module.exports = {
    desc: "Search for an image on https://ibsear.ch",
    usage: "<tags> (Tags are separated with spaces)",
    cooldown: 5,
    guildOnly: true,
    task(bot, msg, args, config) {
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
        ibsearchTimesUsed++
        let key = config.ibsearch_key;
        let str = args + "";
        let msgSplit = str.split(' ');
        let msgSearch = '';
        let searchOrig = '';
        for (let i = 1; i < msgSplit.length; i++) {
            if (i === 1) {
                searchOrig = msgSplit[i];
            } else {
                searchOrig = searchOrig + ' ' + msgSplit[i];
            }
        }
        msgSearch = 'random: ' + searchOrig;
        request.get('https://ibsear.ch/api/v1/images.json', {
            qs: {
                limit: 100,
                q: msgSearch
            },
            headers: { 'ibSearch-Key': key }
        }, (err, res, body) => {
            if (err) {
                bot.createMessage(msg.channel.id, `${err}`)
                    .catch(err => {
                        handleError(bot, err);
                    });
            }
            if (!err && res.statusCode == 200) {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    handleError(bot, err);
                }
                if (typeof(body) !== 'undefined' && body.length > 0) {
                    let random = Math.floor(Math.random() * body.length);
                    let img = body[random];
                    bot.createMessage(msg.channel.id, {
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
                                    url: `https://${img.server}.ibsear.ch/${img.path}`
                                }
                            }
                        })
                        .catch(err => {
                            handleError(bot, err);
                        });
                } else {
                    bot.createMessage(msg.channel.id, {
                            content: ``,
                            embed: {
                                color: config.defaultColor,
                                author: {
                                    name: ``,
                                    url: ``,
                                    icon_url: ``
                                },
                                description: `Oops, looks like I couldn't find an image.`
                            }
                        })
                        .catch(err => {
                            handleError(bot, err);
                        });
                }
            }
        });
    }
};