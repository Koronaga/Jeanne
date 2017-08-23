const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    imdb = require('imdb-api');

module.exports = {
    desc: "Search for either a movie or serie on imdb.",
    usage: "<movie/serie>",
    aliases: [],
    cooldown: 5,
    guildOnly: true,
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
        imdbTimesUsed++
        const movie = args.toString();
        imdb.get(movie, { apiKey: config.imdb_key })
            .then(movie => {
                bot.createMessage(msg.channel.id, {
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        type: `rich`,
                        author: {
                            name: `${movie.title}`,
                            icon_url: ``
                        },
                        description: `${movie.plot}`,
                        url: `${movie.imdburl}`,
                        image: {
                            url: `${movie.poster}`
                        },
                        fields: [{
                                name: `Rated:`,
                                value: `${movie.rated}`,
                                inline: true
                            },
                            {
                                name: `Runtime:`,
                                value: `${movie.runtime}`,
                                inline: true
                            },
                            {
                                name: `Languages:`,
                                value: `${movie.languages}`,
                                inline: true
                            },
                            {
                                name: `Awards:`,
                                value: `${movie.awards}`,
                                inline: true
                            },
                            {
                                name: `Rating:`,
                                value: `${movie.rating}`,
                                inline: true
                            },
                            {
                                name: `Type:`,
                                value: `${movie.type}`,
                                inline: true
                            },
                            {
                                name: `Genres:`,
                                value: `${movie.genres}`,
                                inline: false
                            },
                            {
                                name: `Released:`,
                                value: `${movie.released}`,
                                inline: false
                            }
                        ],
                        footer: {
                            icon_url: `https://b.catgirlsare.sexy/xgTw.png`,
                            text: `All information is provided by imdb`
                        }
                    }
                }).catch(err => {
                    handleError(err);
                });
            }).catch(err => {
                const errMessage = err.message,
                    errName = err.name,
                    fullError = `**__${errName}__**\n${errMessage}`;
                handleMsgError(msg.channel, fullError);
            });
    }
};