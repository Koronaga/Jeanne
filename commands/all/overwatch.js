const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    owjs = require('overwatch-js'); // ../../custom_modules/overwatch-js/index.js

module.exports = {
    desc: "Get overwatch data.",
    usage: "<profile/competitive/quickplay> | <xbl/psn/pc> | <region> | <username>",
    aliases: ['ow'],
    cooldown: 5,
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
        if (!args) return 'wrong usage';
        overwatchTimesUsed++
        const str = args + "";
        const array = str.split(/ ?\| ?/),
            type = array[0], // profile, comp, quick
            platform = array[1], // xbl, psn, pc
            region = array[2], // eu, na, asia, china
            username = array[3];
        const user = username.replace("#", "-");
        const lower = type.toLowerCase();
        if (lower === 'profile' || lower === 'pf') {
            owjs.getOverall(platform, region, user)
                .then(data => {
                    bot.createMessage(msg.channel.id, {
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `Info for: ${username}`,
                                url: `${data.profile.url}`,
                                icon_url: `${data.profile.rankPicture}`
                            },
                            description: ``,
                            thumbnail: {
                                url: `${data.profile.avatar}`
                            },
                            fields: [{
                                    name: `Nick`,
                                    value: `${data.profile.nick}`,
                                    inline: true
                                },
                                {
                                    name: `Level`,
                                    value: `${data.profile.level}`,
                                    inline: true
                                },
                                {
                                    name: `Rank`,
                                    value: `${data.profile.rank}`,
                                    inline: true
                                },
                                {
                                    name: `Season`,
                                    value: `S: ${data.profile.season.id}\nR: ${data.profile.season.rank}`,
                                    inline: true
                                },
                                {
                                    name: `Best Rank`,
                                    value: `${data.profile.ranking}`,
                                    inline: false
                                }
                            ]
                        }
                    }).catch(err => {
                        handleError(bot, __filename, msg.channel, err);
                    });
                }).catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
        } else if (lower === 'comp' || lower === 'c' || lower === 'competitive') {
            owjs.getOverall(platform, region, user)
                .then(data => {
                    bot.createMessage(msg.channel.id, {
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `Competitive info for: ${username}`,
                                url: `${data.profile.url}`,
                                icon_url: `${data.profile.rankPicture}`
                            },
                            description: ``,
                            thumbnail: {
                                url: `${data.profile.avatar}`
                            },
                            fields: [{
                                    name: `Average`,
                                    value: `**Eliminations:** ${data.competitive.global.eliminations_average}
**Damage done:** ${data.competitive.global.damage_done_average}
**Deaths:** ${data.competitive.global.deaths_average}
**Final blows:** ${data.competitive.global.final_blows_average}
**Objective kills:** ${data.competitive.global.objective_kills_average}
**Solo kills:** ${data.competitive.global.solo_kills_average}`,
                                    inline: true
                                },
                                {
                                    name: `Total`,
                                    value: `**Solo kills:** ${data.competitive.global.solo_kills}
**Objective kills:** ${data.competitive.global.objective_kills}
**Final blows:** ${data.competitive.global.final_blows}
**Damage done:** ${data.competitive.global.damage_done}
**Eliminations:** ${data.competitive.global.eliminations}
**Deaths:** ${data.competitive.global.deaths}
**Games played:** ${data.competitive.global.games_played}
**Games won:** ${data.competitive.global.games_won}
**Games lost:** ${data.competitive.global.games_lost}`,
                                    inline: true
                                },
                                {
                                    name: `Most in game`,
                                    value: `**Eliminations:** ${data.competitive.global.eliminations_most_in_game}
**Final blows:** ${data.competitive.global.final_blows_most_in_game}
**Damage done:** ${data.competitive.global.damage_done_most_in_game}
**Objective kills:** ${data.competitive.global.objective_kills_most_in_game}
**Solo kills:** ${data.competitive.global.solo_kills_most_in_game}`,
                                    inline: true
                                },
                                {
                                    name: `Medals`,
                                    value: `**Total:** ${data.competitive.global.medals}
**Gold:** ${data.competitive.global.medals_gold}
**Silver:** ${data.competitive.global.medals_silver}
**Bronze:** ${data.competitive.global.medals_bronze}`,
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
        } else if (lower === 'quick' || lower === 'q' || lower === 'quickplay') {
            owjs.getOverall(platform, region, user)
                .then(data => {
                    bot.createMessage(msg.channel.id, {
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `Info for: ${username}`,
                                url: `${data.profile.url}`,
                                icon_url: `${data.profile.rankPicture}`
                            },
                            description: ``,
                            thumbnail: {
                                url: `${data.profile.avatar}`
                            },
                            fields: [{
                                    name: `Average`,
                                    value: `**Eliminations:** ${data.quickplay.global.eliminations_average}
**Damage done:** ${data.quickplay.global.damage_done_average}
**Deaths:** ${data.quickplay.global.deaths_average}
**Final blows:** ${data.quickplay.global.final_blows_average}
**Healing done:** ${data.quickplay.global.healing_done_average}
**Objective kills:** ${data.quickplay.global.objective_kills_average}
**Solo kills:** ${data.quickplay.global.solo_kills_average}`,
                                    inline: true
                                },
                                {
                                    name: `Total`,
                                    value: `**Solo kills:** ${data.quickplay.global.solo_kills}
**Objective kills:** ${data.quickplay.global.objective_kills}
**Final blows:** ${data.quickplay.global.final_blows}
**Damage done:** ${data.quickplay.global.damage_done}
**Eliminations:** ${data.quickplay.global.eliminations}
**Healing done:** ${data.quickplay.global.healing_done}
**Deaths:** ${data.quickplay.global.deaths}
**Games won:** ${data.quickplay.global.games_won}`,
                                    inline: true
                                },
                                {
                                    name: `Most in game`,
                                    value: `**Eliminations:** ${data.quickplay.global.eliminations_most_in_game}
**Final blows:** ${data.quickplay.global.final_blows_most_in_game}
**Damage done:** ${data.quickplay.global.damage_done_most_in_game}
**Healing done:** ${data.quickplay.global.healing_done_most_in_game}
**Defensive assists:** ${data.quickplay.global.defensive_assists_most_in_game}
**Offensive assists:** ${data.quickplay.global.offensive_assists_most_in_game}
**Objective kills:** ${data.quickplay.global.objective_kills_most_in_game}
**Solo kills:** ${data.quickplay.global.solo_kills_most_in_game}`,
                                    inline: true
                                },
                                {
                                    name: `Medals`,
                                    value: `**Total:** ${data.quickplay.global.medals}
**Gold:** ${data.quickplay.global.medals_gold}
**Silver:** ${data.quickplay.global.medals_silver}
**Bronze:** ${data.quickplay.global.medals_bronze}`,
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
        }
    }
};