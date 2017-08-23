const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;
moment = require('../../node_modules/moment');

module.exports = {
    desc: "Shows info of the channel this command is used in. (only text channels for now)",
    aliases: ['ci', 'cinfo', 'channel'],
    cooldown: 5,
    guildOnly: true,
    task(bot, msg) {
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
        channelinfoTimesUsed++
        var afkTimer = msg.channel.guild.afkTimeout / 60;
        var owner = msg.channel.guild.members.get(msg.channel.guild.ownerID);
        bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.defaultColor,
                type: 'rich',
                author: {
                    name: `Channel info of ${msg.channel.name === null ? `` : ''}${msg.channel.name !== null ? msg.channel.name : ''}`,
                    icon_url: ``
                },
                description: `ID: ${msg.channel.id}`,
                thumbnail: {
                    url: `${msg.channel.guild.iconURL === null ? `` : ''}${msg.channel.guild.iconURL !== null ? msg.channel.guild.iconURL : ''}`
                },
                fields: [{
                        name: `Guild:`,
                        value: `${msg.channel.guild.name === null ? `` : ''}${msg.channel.guild.name !== null ? msg.channel.guild.name : ''}`,
                        inline: true
                    },
                    {
                        name: `Name:`,
                        value: `${msg.channel.mention === null ? `` : ''}${msg.channel.mention !== null ? msg.channel.mention : ''}`,
                        inline: true
                    },
                    {
                        name: `Position:`,
                        value: `${msg.channel.position === null ? `` : ''}${msg.channel.position !== null ? msg.channel.position : ''}`,
                        inline: true
                    },
                    {
                        name: `Topic:`,
                        value: `${msg.channel.topic === null ? `None` : ''}${msg.channel.topic !== null ? msg.channel.topic : ''}`,
                        inline: true
                    },
                    {
                        name: `Created On:`,
                        value: `${moment(msg.channel.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} UTC (${moment(msg.channel.createdAt).fromNow()})`
                    },
                ]
            }
        }).catch(err => {
                handleError(err);
            });
    }
};