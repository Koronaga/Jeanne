const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Get info about a role.",
    usage: "<rolename> (Case-sensitive)",
    aliases: ['role', 'ri'],
    cooldown: 5,
    guildOnly: true,
    task(bot, msg, suffix) {
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
        if (!suffix) return 'wrong usage';
        roleinfoTimesUsed++
        const role = msg.channel.guild.roles.find(o => o.name === `${suffix}`);
        if (!role) return bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: 0xff0000,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `Couldn't find role, remember it's case-sensitive.`
            }
        }).catch(err => {
            handleError(err);
        });
        bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.defaultColor,
                author: {
                    name: `Info about: ${role.name}`,
                    url: ``,
                    icon_url: ``
                },
                description: ``,
                thumbnail: {
                    url: `${msg.channel.guild.iconURL === null ? `` : ''}${msg.channel.guild.iconURL !== null ? msg.channel.guild.iconURL : ''}`
                },
                fields: [{
                        name: `ID`,
                        value: `${role.id}`,
                        inline: true
                    },
                    {
                        name: `Hoist`,
                        value: `${role.hoist}`,
                        inline: true
                    },
                    {
                        name: `Position`,
                        value: `${role.position}`,
                        inline: true
                    },
                    {
                        name: `Permissions`,
                        value: `${role.permissions.allow}`,
                        inline: true
                    }
                ],
                footer: {
                    text: `${msg.channel.guild ? (`${msg.channel.guild.name} : #${msg.channel.name}`) : ""}`
                }
            }
        }).catch(err => {
            handleError(err);
        });
    }
};