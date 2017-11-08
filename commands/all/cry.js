const axios = require('axios');

module.exports = {
  desc: 'Sends a cry image ;(',
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, _, config) {
    const base_url = 'https://rra.ram.moe';
    const type = 'cry';
    const path = '/i/r?type=' + type;
    axios.get(base_url + path)
      .then((res) => {
        if (res.data.error) return this.catchError(bot, msg, __filename, res.data.error);
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            image: {
              url: base_url + res.data.path
            }
          }
        }).catch((err) => this.catchMessage(err, msg));
      }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};