const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Get info about a discord invite.",
    usage: "<invite_code>",
    aliases: ['getinvite', 'inviteinfo'],
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
                handleError(bot, err);
            });
        findinviteTimesUsed++
        bot.getInvite(`${args}`, true)
            .then(res => {
                let invUsername;
                let invDiscrim;
                if (res.inviter === undefined) invUsername = 'n/a'
                if (res.inviter !== undefined) invUsername = res.inviter.username + '#';
                if (res.inviter === undefined) invDiscrim = '';
                if (res.inviter !== undefined) invDiscrim = res.inviter.discriminator;
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
                        fields: [{
                                name: `Invite`,
                                value: `discord.gg/${res.code}`,
                                inline: true
                            },
                            {
                                name: `Channel Name`,
                                value: `${res.channel.name}`,
                                inline: true
                            },
                            {
                                name: `Channel ID`,
                                value: `${res.channel.id}`,
                                inline: true
                            },
                            {
                                name: `Guild Name`,
                                value: `${res.guild.name}`,
                                inline: true
                            },
                            {
                                name: `Guild ID`,
                                value: `${res.guild.id}`,
                                inline: true
                            },
                            {
                                name: `Member Count`,
                                value: `${res.memberCount}`,
                                inline: true
                            },
                            {
                                name: `Inviter`,
                                value: `${invUsername}${invDiscrim}`,
                                inline: true
                            }
                        ]
                    }
                }).catch(err => {
                    handleError(bot, err);
                });
            })
            .catch(err => {
                handleMsgError(bot, msg.channel, err);
            });
    }
};