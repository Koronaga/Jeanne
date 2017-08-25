const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    superagent = require('superagent'),
    moment = require('../../node_modules/moment'),
    { flag, code, name } = require('country-emoji');

module.exports = {
    desc: "Get info about a steam user.",
    usage: "<steamid32/steamid64/customurl>",
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
                if (err) return handleError(err);
                const data = res.body;
                if (data.status != 200) return 'wrong usage';
                const lastlogoff = new Date(data.profile.lastlogoff * 1000).toISOString();
                const timecreated = new Date(data.profile.timecreated * 1000).toISOString();
                let location = data.profile.location;
                if (!location) location = 'n/a';
                let realname = data.profile.realname;
                if (!realname) realname = 'n/a';
                msg.channel.createMessage({
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        author: {
                            name: ``,
                            url: ``,
                            icon_url: ``
                        },
                        description: `${flag(data.profile.loccountrycode)} **__${data.profile.username}__**`,
                        thumbnail: {
                            url: `${data.avatars.avatarfull}`
                        },
                        fields: [{
                                name: `Real name`,
                                value: `${realname}`,
                                inline: true
                            },
                            {
                                name: `Privacy`,
                                value: `${data.profile.privacy}`,
                                inline: true
                            },
                            {
                                name: `Last seen`,
                                value: `${data.profile.state}`,
                                inline: true
                            },
                            {
                                name: `Last logoff`,
                                value: `${moment(lastlogoff).utc().format('dddd - DD/MM/YYYY | kk:mm:ss')} UTC (${moment(lastlogoff).fromNow()})`,
                                inline: false
                            },
                            {
                                name: `Current state`,
                                value: `${data.profile.personastate}`,
                                inline: true
                            },
                            {
                                name: `Location`,
                                value: `${location}`,
                                inline: true
                            },
                            {
                                name: `Created on`,
                                value: `${moment(timecreated).utc().format('dddd - DD/MM/YYYY | kk:mm:ss')} UTC (${moment(timecreated).fromNow()})`,
                                inline: false
                            },
                            {
                                name: `\u200b`,
                                value: `steamid32: **${data.id.steamid32}**\nsteamid64: **${data.id.steamid64}**\ncustomurl: **${data.id.customurl}**`,
                                inline: false
                            }
                        ]
                    }
                }).catch(err => {
                    handleError(err);
                });
            });
    }
};