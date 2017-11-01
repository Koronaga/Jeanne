let reload = require('require-reload')(require),
  logger = new (reload('../utils/Logger.js'))((reload('../config.json')).logTimestamp, 'yellow'),
  antiSpam = {};
const axios = require('axios'),
  handleErrorNoMsg = require('../utils/utils.js').handleErrorNoMsg;

function spamCheck(userId, text) {
  if (!antiSpam.hasOwnProperty(userId)) { //If user not there add them
    antiSpam[userId] = text;
    return true;
  }
  if (antiSpam[userId] === text) //If user sent the same message ignore it
    return false;
  antiSpam[userId] = text;
  return true;
}

function trimText(cleanContent, name) {
  return cleanContent.replace(`@${name}`, '').trim(); //Removes the @Bot part
}

async function cleverbot(bot, msg, config, settingsManager) {
  const owner = bot.users.get(config.adminIds[0]);
  if (msg.channel.guild !== undefined && !msg.channel.permissionsOf(msg.author.id).has('manageChannels') && settingsManager.isCommandIgnored('', 'cleverbot', msg.channel.guild.id, msg.channel.id, msg.author.id) === true)
    return;
  let text = msg.channel.guild === undefined ? msg.cleanContent : trimText(msg.cleanContent, msg.channel.guild.members.get(bot.user.id).nick || bot.user.username);
  if (spamCheck(msg.author.id, text)) {
    cleverbotTimesUsed++;
    logger.logCommand(msg.channel.guild === undefined ? null : msg.channel.guild.name, msg.author.username, '@' + bot.user.username, text);
    if (text === '') { //If they just did @Botname
      try {
        msg.channel.createMessage(`${msg.author.username}, What do you want to talk about?`);
      } catch (error) { return; }
    } else {
      msg.channel.sendTyping();
      try {
        const res = await axios.get(`http://api.program-o.com/v2/chatbot/?bot_id=12&say=${text}&convo_id=${msg.author.id}&format=json`);
        let answer = res.data.botsay;
        if (!answer) {
          try {
            return msg.channel.createMessage(`${msg.author.username}, I don't wanna talk right now :slight_frown:`);
          } catch (error) { return; }
        }
        answer = answer.replace(/Chatmundo/gi, bot.user.username);
        answer = answer.replace(/<br\/> ?/gi, '\n');
        answer = answer.replace(/Elizabeth/gi, `${owner.username}#${owner.discriminator}`);
        answer = answer.replace(/elizaibeth/gi, `${owner.username}#${owner.discriminator}`);
        bot.createMessage(msg.channel.id, `${msg.author.username}, ${answer}`)
          .catch((err) => handleErrorNoMsg(bot, __filename, err));
      } catch (e) {
        handleErrorNoMsg(bot, __filename, e);
        msg.channel.createMessage(`${msg.author.username}, I don't wanna talk right now :slight_frown:`)
          .catch((err) => handleErrorNoMsg(bot, __filename, err));
      }
    }
  }
};

module.exports = cleverbot;