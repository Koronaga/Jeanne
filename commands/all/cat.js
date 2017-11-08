const axios = require('axios');

module.exports = {
  desc: 'Sends random cat image from http://random.cat',
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, _, config) {
    axios.get('http://random.cat/meow', {
      headers: {
        'User-Agent': USERAGENT
      }
    }).then((res) => {
      const cat = res.data;
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: `${msg.author.username} requested a cat ;3`,
          url: `${cat.file}`,
          image: {
            url: `${cat.file}`
          }
        }
      }).catch((err) => this.catchMessage(err, msg));
    }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};