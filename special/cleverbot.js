var reload = require('require-reload')(require),
    logger = new(reload('../utils/Logger.js'))((reload('../config.json')).logTimestamp, 'yellow'),
    antiSpam = {};
const axios = require("axios");

function spamCheck(userId, text) {
    if (!antiSpam.hasOwnProperty(userId)) { //If user not there add them
        antiSpam[userId] = text;
        return true;
    }
    if (antiSpam[userId] == text) //If user sent the same message ignore it
        return false;
    antiSpam[userId] = text;
    return true;
}

function trimText(cleanContent, name) {
    return cleanContent.replace(`@${name}`, '').trim(); //Removes the @Bot part
}

module.exports = function(bot, msg, config, settingsManager) {
    if (msg.channel.guild !== undefined && !msg.channel.permissionsOf(msg.author.id).has('manageChannels') && settingsManager.isCommandIgnored('', 'cleverbot', msg.channel.guild.id, msg.channel.id, msg.author.id) === true)
        return;
    let text = msg.channel.guild === undefined ? msg.cleanContent : trimText(msg.cleanContent, msg.channel.guild.members.get(bot.user.id).nick || bot.user.username);
    if (spamCheck(msg.author.id, text)) {
        cleverbotTimesUsed++;
        logger.logCommand(msg.channel.guild === undefined ? null : msg.channel.guild.name, msg.author.username, '@' + bot.user.username, text);
        if (text === '') //If they just did @Botname
            msg.channel.createMessage(`${msg.author.username}, What do you want to talk about?`);
        else {
            msg.channel.sendTyping();
            axios.get(`http://api.program-o.com/v2/chatbot/?bot_id=6&say=${text}&convo_id=${msg.author.id}&format=json`).then(res => {
                let answer = res.data.botsay;
                answer = answer.replace("Program-O", bot.user.username);
                answer = answer.replace(/<br\/> ?/, "\n")
                bot.createMessage(msg.channel.id, `${msg.author.username}, ${answer}`);
            }).catch(err => {
                console.log(err);
                bot.createMessage(msg.channel.id, `${msg.author.username}, I don't wanna talk right now :slight_frown:`);
            });
        }
    }
}
