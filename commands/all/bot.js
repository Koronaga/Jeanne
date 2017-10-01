const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    findMember = require('../../utils/utils.js').findMember,
    axios = require('axios'),
    discordpw_key = require('../../config.json').abalBotsKey;

module.exports = {
    desc: "Get info about a bot from bots.discord.pw",
    usage: "<bot_id/@mention>",
    cooldown: 30,
    guildOnly: true,
    task(bot, msg, args) {
        if (!discordpw_key) return;
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
        botTimesUsed++
        if (msg.mentions[0]) {
            const user = msg.mentions[0];
            if (user.bot === false) return msg.channel.createMessage('\\❌ This is not a bot.')
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            axios.get(`https://bots.discord.pw/api/bots/${user.id}`, {
                headers: {
                    'Authorization': discordpw_key,
                    'User-Agent': USERAGENT
                }
            }).then(res => {
                const data = res.data;
                if (res.status !== 200) return handleError(bot, __filename, msg.channel, res.data);
                const inv = data.invite_url.replace(/ /g, '%20');
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: data.name,
                                url: data.website,
                                icon_url: ``
                            },
                            thumbnail: {
                                url: `${user.avatarURL}`
                            },
                            description: `**ID:** ${data.client_id}\n` +
                                `**Desc:** ${data.description}\n` +
                                `**Library:** ${data.library}\n` +
                                `**Owners:** ${JSON.stringify(data.owner_ids).replace(/\[/g, '').replace(/\]/g, '').replace(/"/g, '')}\n` +
                                `**Prefix:** ${data.prefix}\n` +
                                `**Invite:** [\`Click here\`](${inv})\n` +
                                `**Website:** ${data.website}`,
                            footer: {
                                text: `Data from bots.discord.pw`,
                                icon_url: ``
                            }
                        }
                    })
                    .catch(err => {
                        handleError(bot, __filename, msg.channel, err);
                    });
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err.response.data.status + ', ' + err.response.data.message);
            });
        } else {
            const idRegex = /^\d{17,18}$/.test(args);
            if (idRegex === false) return 'wrong usage';
            const user = bot.users.get(args);
            if (!user) return msg.channel.createMessage('\\❌ Something went wrong, make sure it\'s a valid user.')
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            if (user.bot === false) return msg.channel.createMessage('\\❌ This is not a bot.')
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            axios.get(`https://bots.discord.pw/api/bots/${user.id}`, {
                headers: {
                    'Authorization': discordpw_key,
                    'User-Agent': USERAGENT
                }
            }).then(res => {
                const data = res.data;
                if (res.status !== 200) return handleError(bot, __filename, msg.channel, res.data);
                const inv = data.invite_url.replace(/ /g, '%20');
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: data.name,
                                url: data.website,
                                icon_url: ``
                            },
                            thumbnail: {
                                url: `${user.avatarURL}`
                            },
                            description: `**ID:** ${data.client_id}\n` +
                                `**Desc:** ${data.description}\n` +
                                `**Library:** ${data.library}\n` +
                                `**Owners:** ${JSON.stringify(data.owner_ids).replace(/\[/g, '').replace(/\]/g, '').replace(/"/g, '')}\n` +
                                `**Prefix:** ${data.prefix}\n` +
                                `**Invite:** [\`Click here\`](${inv})\n` +
                                `**Website:** ${data.website}`,
                            footer: {
                                text: `Data from bots.discord.pw`,
                                icon_url: ``
                            }
                        }
                    })
                    .catch(err => {
                        handleError(bot, __filename, msg.channel, err);
                    });
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err.response.data.status + ', ' + err.response.data.message);
            });
        }
    }
};