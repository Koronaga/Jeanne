const axios = require('axios');

module.exports = {
  desc: 'Sends a random boobs pic.',
  aliases: ['tits'],
  cooldown: 5,
  guildOnly: true,
  nsfw: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
    axios.get('http://api.oboobs.ru/boobs/0/1/random', {
      headers: {
        'User-Agent': USERAGENT
      }
    }).then((res) => {
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          image: {
            url: `http://media.oboobs.ru/${res.data[0].preview}`
          }
        }
      }).catch((err) => this.catchMessage(err, msg));
    }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};