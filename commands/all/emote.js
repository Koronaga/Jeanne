const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Sends a random emote Jeanne d'Arc has access to.",
    aliases: ['emoji'],
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
        emoteTimesUsed++
        const guilds = bot.guilds.filter(g => g.emojis[0]),
            emojis = guilds[Math.floor(Math.random() * guilds.length)].emojis;
        let emoji = emojis[Math.floor(Math.random() * emojis.length)];
        emoji = JSON.stringify(emoji);
        emoji = JSON.parse(emoji);
        msg.channel.createMessage(`<:${emoji.name}:${emoji.id}>`)
            .catch(err => {
                handleError(err);
            });
    }
};