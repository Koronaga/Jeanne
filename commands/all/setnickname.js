const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Change your nickname.",
    aliases: ['setnick', 'nick', 'changenick'],
    cooldown: 5,
    guildOnly: true,
    requiredPermission: 'manageNicknames',
    usage: "[nickname]",
    task(bot, msg, args) {
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
         * @param {boolean} manageNicknames - Checks if the bots permissions has manageNicknames
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
        const manageNicknames = msg.channel.permissionsOf(bot.user.id).has('manageNicknames');
        if (sendMessages === false) return;
        if (embedLinks === false) return msg.channel.createMessage(`\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(err);
            });
        if (manageNicknames === false) return msg.channel.createMessage(`\\❌ I'm missing the \`manageNicknames\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(err);
            });
        bot.editGuildMember(msg.channel.guild.id, msg.author.id, { nick: args })
            .then(() => {
                if (!args) return msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: ``,
                                url: ``,
                                icon_url: ``
                            },
                            description: `Successfully reset your nickname`
                        }
                    })
                    .catch(err => {
                        handleError(err);
                    });
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: ``,
                                url: ``,
                                icon_url: ``
                            },
                            description: `Successfully changed your nickname to **${args}**`
                        }
                    })
                    .catch(err => {
                        handleError(err);
                    });
            })
            .catch(err => {
                handleMsgError(msg.channel, err);
            });
    }
};