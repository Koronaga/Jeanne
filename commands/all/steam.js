const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    superagent = require('superagent'),
    moment = require('../../node_modules/moment');

module.exports = {
    desc: "Get info about a steam user.",
    usage: "<SteamID64/SteamID32/CustomURL>",
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
        steamTimesUsed++
        superagent.get(`http://api.thegathering.xyz/steamid/?s=${args}&key=${config.steam_key}`)
            .end((err, res) => {
                if (err) return logger.error('\n' + err, 'ERROR');
                const data = res.body;
                if (data.status != 200) return bot.createMessage(msg.channel.id, 'Oops something went wrong. Make sure you used the correct usage, to check do \`s.help steam\`')
                    .catch(err => {
                        handleError(err);
                    });
                const lastlogoff = new Date(data.profile.lastlogoff * 1000).toISOString();
                const timecreated = new Date(data.profile.timecreated * 1000).toISOString();
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
                        thumbnail: {
                            url: `${data.avatars.avatarfull}`
                        },
                        fields: [{
                                name: `\u200B`,
                                value: `**__General info:__**`,
                                inline: false
                            },
                            {
                                name: `Real name`,
                                value: `${data.profile.realname === '' ? `n/a` : ''}${data.profile.realname !== '' ? data.profile.realname : ''}`,
                                inline: true
                            },
                            {
                                name: `Privacy`,
                                value: `${data.profile.privacy}`,
                                inline: true
                            },
                            {
                                name: `Last logoff`,
                                value: `${moment(lastlogoff).utc().format('ddd MMM DD YYYY | kk:mm:ss')} UTC`,
                                inline: true
                            },
                            {
                                name: `Last seen`,
                                value: `${data.profile.state}`,
                                inline: true
                            },
                            {
                                name: `Created at`,
                                value: `${moment(timecreated).utc().format('ddd MMM DD YYYY | kk:mm:ss')} UTC (${moment(timecreated).fromNow()})`,
                                inline: false
                            },
                            {
                                name: `Current state`,
                                value: `${data.profile.personastate}`,
                                inline: true
                            },
                            {
                                name: `Location`,
                                value: `${data.profile.location === '' ? `n/a` : ''}${data.profile.location !== '' ? data.profile.location : ''}`,
                                inline: true
                            },
                            {
                                name: `\u200B`,
                                value: `**__Bans:__**`,
                                inline: false
                            },
                            {
                                name: `Vac ban`,
                                value: `${data.bans.vac}`,
                                inline: true
                            },
                            {
                                name: `Vac bans`,
                                value: `${data.bans.vacamount}`,
                                inline: true
                            },
                            {
                                name: `Days since last vac ban`,
                                value: `${data.bans.dayssince === '' ? `n/a` : ''}${data.bans.dayssince !== '' ? data.bans.dayssince + ' days' : ''}`,
                                inline: false
                            },
                            {
                                name: `\u200B`,
                                value: `**__Fav group:__**`,
                                inline: false
                            },
                            {
                                name: `Name`,
                                value: `${data.favgroup.name === '' ? `n/a` : ''}${data.favgroup.name !== '' ? data.favgroup.name : ''}`,
                                inline: true
                            },
                            {
                                name: `ID`,
                                value: `${data.favgroup.id === '' ? `n/a` : ''}${data.favgroup.id !== '' ? data.favgroup.id : ''}`,
                                inline: true
                            },
                            {
                                name: `Members`,
                                value: `${data.favgroup.members === '' ? `n/a` : ''}${data.favgroup.members !== '' ? data.favgroup.members : ''}`,
                                inline: true
                            },
                            {
                                name: `Avatar`,
                                value: `${data.favgroup.avatar === '' ? `n/a` : ''}${data.favgroup.avatar !== '' ? data.favgroup.avatar : ''}`,
                                inline: true
                            },
                            {
                                name: `URL`,
                                value: `${data.favgroup.url === '' ? `n/a` : ''}${data.favgroup.url !== '' ? data.favgroup.url : ''}`,
                                inline: true
                            }
                        ]
                    }
                }).catch(err => {
                    handleError(err);
                });
            });
    }
};