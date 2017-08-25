const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    Pornsearch = require('../../custom_modules/pornsearch/index.js'),
    banned = reload('../../banned_search_terms.json'),
    getRandomInt = require('../../utils/utils.js').getRandomInt;

module.exports = {
    desc: "Search for gifs from pornhub.com and sex.com",
    usage: "<query>",
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
        var nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
        if (!nsfw) return msg.channel.createMessage({
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `You can only use this command in an **nsfw** channels, use \`j:settings nsfw <allow/deny>\`.`
                }
            })
            .catch(err => {
                handleError(bot, err);
            });
        if (!args) return 'wrong usage';
        pornTimesUsed++
        var bannedWord1 = banned.bannedWords[0];
        var bannedWord2 = banned.bannedWords[1];
        var bannedWord3 = banned.bannedWords[2];
        var bannedWord4 = banned.bannedWords[3];
        if (args.includes(bannedWord1) || args.includes(bannedWord2) || args.includes(bannedWord3) || args.includes(bannedWord4)) return msg.channel.createMessage({
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `Sorry it's against Discord's ToS to search for these tags.`
                }
            })
            .catch(err => {
                handleError(bot, err);
            });
        const drivers = ['pornhub', 'sex'];
        const driver = drivers[Math.floor(Math.random() * drivers.length)];
        const page = getRandomInt(1, 5);
        const search = new Pornsearch(args, driver);
        search.gifs(page)
            .then(gifs => {
                const result = gifs[Math.floor(Math.random() * gifs.length)];
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `${result.title}`,
                                url: `${result.url}`,
                                icon_url: ``
                            },
                            description: `[Direct Image Url](${result.url})`,
                            image: {
                                url: `${result.url}`
                            },
                            footer: {
                                text: `Gifs might not show if the size is too big, you can still click the link.`
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