const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError;

module.exports = {
    desc: "Unban a member by id.",
    usage: "<user_id> | [reason]",
    guildOnly: true,
    requiredPermission: 'banMembers',
    task(bot, msg, suffix) {
        /**
         * perm checks
         * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         * @param {boolean} banMembers - Checks if the bot permissions has banMembers
         */
        const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        const banMembers = msg.channel.permissionsOf(bot.user.id).has('banMembers');
        if (sendMessages === false) return;
        if (embedLinks === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        if (banMembers === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`banMembers\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        if (!suffix) return 'wrong usage'
        unbanTimesUsed++
        const str = suffix + "";
        const array = str.split(/ ?\| ?/),
            userToBan = array[0],
            reason = array[1];
        const idRegex = /^\d{17,18}$/.test(userToBan);
        if (idRegex === false) return bot.createMessage(msg.channel.id, `\\❌ Invalid user id.`)
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        bot.unbanGuildMember(msg.channel.guild.id, userToBan, reason)
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
    }
};