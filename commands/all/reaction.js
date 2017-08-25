const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Add a reaction to the provided message id. (Custom emotes do NOT work yet.)",
    usage: "<normal/custom> | <messageID> | <emote> (Normal: ':emoteName:', Custom: 'emoteName:emoteID')",
    cooldown: 5,
    guildOnly: true,
    aliases: ['react'],
    requiredPermission: 'addReactions',
    task(bot, msg, args) {
        /**
         * perm checks
         * @param {boolean} addReactions - Checks if the bots permissions has addReactions
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const addReactions = msg.channel.permissionsOf(bot.user.id).has('addReactions');
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (sendMessages === false) return;
        if (addReactions === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`addReactions\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(bot, err);
            });
        if (!args) return 'wrong usage';
        const str = args + "";
        const array = str.split(/ ?\| ?/);
        let type = array[0],
            msgid = array[1],
            emote = array[2];
        if (!msgid) return 'wrong usage';
        if (!emote) return 'wrong usage';
        reactionTimesUsed++
        const idRegex = /^\d{17,18}$/.test(msgid);
        if (idRegex === false) return msg.channel.createMessage('\\❌ Wrong message id.')
            .catch(err => {
                handleError(bot, err);
            });
        type = type.toLowerCase();
        if (type === 'normal') {
            const emoteRegex = /^[a-zA-Z0-9_]{2,}:\d{17,18}$/.test(emote)
            if (emoteRegex === true) return msg.channel.createMessage('\\❌ This is a custom emoji please use \`custom\` as first argument.\nType \`j:help reaction\` for more info.')
                .catch(err => {
                    handleError(bot, err);
                });
            bot.addMessageReaction(msg.channel.id, msgid, emote)
                .then(() => {
                    bot.deleteMessage(msg.channel.id, msg.id)
                        .catch(err => {
                            handleError(bot, err);
                        });
                })
                .catch(err => {
                    handleError(bot, err);
                });
        } else if (type === 'custom') {
            const emoteRegex = /^[a-zA-Z0-9_]{2,}:\d{17,18}$/.test(emote)
            if (emoteRegex === false) return msg.channel.createMessage('\\❌ This is not a custom emoji. If you\'re trying to react with a normal emoji please use \`normal\` as first argument.\nType \`j:help reaction\` for more info.')
                .catch(err => {
                    handleError(bot, err);
                });
            bot.addMessageReaction(msg.channel.id, msgid, emote)
                .then(() => {
                    bot.deleteMessage(msg.channel.id, msg.id)
                        .catch(err => {
                            handleError(bot, err);
                        });
                })
                .catch(err => {
                    handleError(bot, err);
                });
        } else {
            return 'wrong usage';
        }
    }
};