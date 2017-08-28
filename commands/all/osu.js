const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    osu = require('node-osu'),
    osuApi = new osu.Api(config.osuapi, {
        notFoundAsError: true,
        completeScores: false
    }),
    round = require('../../utils/utils.js').round;

module.exports = {
    desc: "Display osu! stats for a user",
    usage: "<info/best/recent> | <username>",
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
                handleError(bot, __filename, msg.channel, err);
            });
        // j:osu info | <username>        || j:osu i | <username>
        // j:osu best | <username>    || j:osu b | <username>
        // j:osu recent | <username>  || j:osu r | <username>
        if (!args) return 'wrong usage';
        osuTimesUsed++
        const lower = args.toLowerCase();
        const array = lower.split(/ ?\| ?/),
            type = array[0],
            user = array[1];
        if (!user) return 'wrong usage';
        if ((type === 'info') || (type === 'i')) {
            osuApi.getUser({ u: `${user}` }).then(u => {
                bot.createMessage(msg.channel.id, {
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        author: {
                            name: `osu! data from ${u.name}`,
                            url: ``,
                            icon_url: ``
                        },
                        description: ``,
                        fields: [{
                                name: `ID`,
                                value: `${u.id}`,
                                inline: true
                            },
                            {
                                name: `Name`,
                                value: `${u.name}`,
                                inline: true
                            },
                            {
                                name: `Country`,
                                value: `${u.country}`,
                                inline: true
                            },
                            {
                                name: `Level`,
                                value: `${round(u.level, 1)}`,
                                inline: true
                            },
                            {
                                name: `Accuracy`,
                                value: `${round(u.accuracy, 1)}`,
                                inline: true
                            },
                            {
                                name: `Scores`,
                                value: `
(ranked) ${u.scores.ranked}
(total) ${u.scores.total}`,
                                inline: true
                            },
                            {
                                name: `pp`,
                                value: `
(raw) ${round(u.pp.raw, 1)}
(rank) ${u.pp.rank}
(country rank) ${u.pp.countryRank}`,
                                inline: true
                            },
                            {
                                name: `Counts`,
                                value: `
(SS) ${u.counts.SS}
(S) ${u.counts.S}
(A) ${u.counts.A}
(plays) ${u.counts.plays}`,
                                inline: true
                            }
                        ]
                    }
                }).catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else if ((type === 'best') || (type === 'b')) {
            osuApi.getUserBest({ u: `${user}` }).then(s => {
                bot.createMessage(msg.channel.id, {
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        author: {
                            name: `osu! data from ${s[0].user.name}`,
                            url: ``,
                            icon_url: ``
                        },
                        description: ``,
                        fields: [{
                                name: `User ID`,
                                value: `${s[0].user.id}`,
                                inline: true
                            },
                            {
                                name: `Name`,
                                value: `${s[0].user.name}`,
                                inline: true
                            },
                            {
                                name: `Rank`,
                                value: `${s[0].rank}`,
                                inline: true
                            },
                            {
                                name: `Max combo`,
                                value: `${s[0].maxCombo}`,
                                inline: true
                            },
                            {
                                name: `pp`,
                                value: `${round(s[0].pp, 1)}`,
                                inline: true
                            },
                            {
                                name: `Date`,
                                value: `${s[0].raw_date}`,
                                inline: true
                            },
                            {
                                name: `Counts`,
                                value: `
(geki) ${s[0].counts.geki}
(katu) ${s[0].counts.katu}
(miss) ${s[0].counts.miss}`,
                                inline: true
                            }
                        ]
                    }
                }).catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else if ((type === 'recent') || (type === 'r')) {
            bot.createMessage(msg.channel.id, `Function coming soon™, for now you can only use \`info\` and \`best\`.`)
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            /*
            osuApi.getUserRecent({ u: `${user}` }).then(s => {
                console.log(s[0].score);
            });
            */
        }
    }
};