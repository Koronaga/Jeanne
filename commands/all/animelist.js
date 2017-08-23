const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Gets info about your anime list using the following tags <watching/completed/onhold>. (note: completed doesn't return all completed.)",
    usage: "<watching/completed/onhold>, <mal username>",
    aliases: ['mallist', 'alist'],
    cooldown: 10,
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
        args = args.toString();
        let data = args.split(/ ?, ?/),
            type = data[0],
            username = data[1];
        const myAnimeList = require('myanimelist')({
            username: `${username}`
        });
        if (type === undefined) return 'wrong usage';
        type = type.toLowerCase();
        animelistTimesUsed++
        if (type === 'watching') {
            myAnimeList.getAnimeList(1, (err, resp) => {
                if (err) return handleMsgError(msg.channel, err);
                let t = resp.map((title) => {
                    return title.series_title;
                }).toString();
                let titles = t.split(',').join('\n');
                let s = resp.map((score) => {
                    return score.my_score;
                }).toString();
                let scores = s.split(',').join('\n');
                let w = resp.map((watched) => {
                    return watched.my_watched_episodes;
                }).toString();
                let watchedep = s.split(',').join('\n');
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `Currently Watching`,
                                url: ``,
                                icon_url: ``
                            },
                            description: ``,
                            fields: [{
                                    name: `Titles:`,
                                    value: `${titles === null ? `None` : ''}${titles !== null ? titles : ''}`,
                                    inline: true
                                },
                                {
                                    name: `Score:`,
                                    value: `${scores === null ? `None` : ''}${scores !== null ? scores : ''}`,
                                    inline: true
                                }
                            ]
                        }
                    })
                    .catch(err => {
                        handleError(err);
                    });
            });
        } else if (type === 'completed') {
            let myAnimeList = require('myanimelist')({
                username: `${username}`
            });
            myAnimeList.getAnimeList(2, (err, resp) => {
                if (err) return handleMsgError(msg.channel, err);
                let t = resp.map((title) => {
                    return title.series_title;
                }).toString();
                let titles = t.split(',').join('\n');
                let s = resp.map((score) => {
                    return score.my_score;
                }).toString();
                let scores = s.split(',').join('\n');
                let w = resp.map((watched) => {
                    return watched.my_watched_episodes;
                }).toString();
                let watchedep = s.split(',').join('\n');
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `Completed`,
                                url: ``,
                                icon_url: ``
                            },
                            description: ``,
                            fields: [{
                                    name: `Titles:`,
                                    value: `${titles === null ? `None` : ''}${titles !== null ? titles : ''}`,
                                    inline: true
                                },
                                {
                                    name: `Score:`,
                                    value: `${scores === null ? `None` : ''}${scores !== null ? scores : ''}`,
                                    inline: true
                                }
                            ]
                        }
                    })
                    .catch(err => {
                        handleError(err);
                    });
            });
        } else if (type === 'onhold') {
            let myAnimeList = require('myanimelist')({
                username: `${username}`
            });
            myAnimeList.getAnimeList(3, (err, resp) => {
                if (err) return handleMsgError(msg.channel, err);
                let t = resp.map((title) => {
                    return title.series_title;
                }).toString();
                let titles = t.split(',').join('\n');
                let s = resp.map((score) => {
                    return score.my_score;
                }).toString();
                let scores = s.split(',').join('\n');
                let w = resp.map((watched) => {
                    return watched.my_watched_episodes;
                }).toString();
                let watchedep = s.split(',').join('\n');
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `On Hold`,
                                url: ``,
                                icon_url: ``
                            },
                            description: ``,
                            fields: [{
                                    name: `Titles:`,
                                    value: `${titles === null ? `None` : ''}${titles !== null ? titles : ''}`,
                                    inline: true
                                },
                                {
                                    name: `Score:`,
                                    value: `${scores === null ? `None` : ''}${scores !== null ? scores : ''}`,
                                    inline: true
                                }
                            ]
                        }
                    })
                    .catch(err => {
                        handleError(err);
                    });
            });
        }
    }
};