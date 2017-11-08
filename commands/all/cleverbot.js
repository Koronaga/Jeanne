const axios = require('axios');
let antiSpam = {};

module.exports = {
  desc: 'Chat with the bot.',
  usage: '<question>',
  example: 'How are you today?',
  aliases: ['cb'],
  cooldown: 2,
  guildOnly: true,
  botPermissions: ['sendMessages'],
  task(bot, msg, args, config) {
    const owner = bot.users.get(config.adminIds[0]);
    function spamCheck(userId, args) {
      if (userId === owner.id) return true;
      if (!antiSpam.hasOwnProperty(userId)) {
        antiSpam[userId] = args;
        return true;
      }
      if (antiSpam[userId] === args)
        return false;
      antiSpam[userId] = args;
      return true;
    }
    if (spamCheck(msg.author.id, args)) {
      cleverbotTimesUsed++;
      msg.channel.sendTyping();
      if (!args) return msg.channel.createMessage(`${msg.author.username}, What do you want to talk about?`)
        .catch((err) => this.catchMessage(err, msg));
      axios.get(`http://api.program-o.com/v2/chatbot/?bot_id=12&say=${args}&convo_id=${msg.author.id}&format=json`, {
        headers: {
          'User-Agent': USERAGENT
        }
      }).then((res) => {
        let answer = res.data.botsay;
        if (!answer) return msg.channel.createMessage(`${msg.author.username}, I don't wanna talk right now :slight_frown:`)
          .catch((err) => this.catchMessage(err, msg));
        answer = answer.replace(/Chatmundo/g, bot.user.username);
        answer = answer.replace(/<br\/> ?/g, '\n');
        answer = answer.replace(/Elizabeth/g, `${owner.username}#${owner.discriminator}`);
        msg.channel.createMessage(`${msg.author.username}, ${answer}`)
          .catch((err) => this.catchMessage(err, msg));
      }).catch((err) => this.catchError(bot, msg, __filename, err));
    }
  }
};