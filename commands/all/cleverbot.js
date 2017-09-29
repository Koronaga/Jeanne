const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    axios = require("axios");
let antiSpam = {};

module.exports = {
    desc: "Chat with the bot.",
    usage: "<question>",
    aliases: ['cb'],
    cooldown: 2,
    guildOnly: true,
    task(bot, msg, args, config, settingsManager) {
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (sendMessages === false) return;
        const owner = bot.users.get(config.adminIds[0]);

        function spamCheck(userId, args) {
            if (!antiSpam.hasOwnProperty(userId)) {
                antiSpam[userId] = args;
                return true;
            }
            if (antiSpam[userId] == args)
                return false;
            antiSpam[userId] = args;
            return true;
        }
        if (spamCheck(msg.author.id, args)) {
            cleverbotTimesUsed++;
            msg.channel.sendTyping();
            if (!args) return bot.createMessage(msg.channel.id, `${msg.author.username}, What do you want to talk about?`)
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            /* AXIOS */
            // http://api.program-o.com/v2/chatbot/?bot_id=6&say=${args}&convo_id=${msg.author.id}&format=json
            axios.get(`http://api.program-o.com/v2/chatbot/?bot_id=12&say=${args}&convo_id=${msg.author.id}&format=json`)
                .then(res => {
                    let answer = res.data.botsay;
                    if (!answer) return bot.createMessage(msg.channel.id, `${msg.author.username}, I don't wanna talk right now :slight_frown:`)
                        .catch(err => {
                            handleError(bot, __filename, msg.channel, err);
                        });
                    // answer = answer.replace(/Program-O/g, bot.user.username);
                    answer = answer.replace(/Chatmundo/g, bot.user.username);
                    answer = answer.replace(/<br\/> ?/g, "\n");
                    answer = answer.replace(/Elizabeth/g, `${owner.username}#${owner.discriminator}`);
                    bot.createMessage(msg.channel.id, `${msg.author.username}, ${answer}`)
                        .catch(err => {
                            handleError(bot, __filename, msg.channel, err);
                        });
                })
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                    bot.createMessage(msg.channel.id, `${msg.author.username}, I don't wanna talk right now :slight_frown:`)
                        .catch(err => {
                            handleError(bot, __filename, msg.channel, err);
                        });
                });
        }
    }
};