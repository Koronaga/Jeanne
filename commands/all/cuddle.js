const axios = require('axios');

module.exports = {
  desc: 'Cuddle with someone.',
  usage: '<username/id/@mention>',
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
    const user = this.findMember(msg, args);
    if (!args) return 'wrong usage';
    if (!user) return msg.channel.createMessage({
      embed: {
        color: config.errorColor,
        description: 'That is not a valid guild member. Need to specify a name, ID or mention the user.'
      }
    }).catch((err) => this.catchMessage(err, msg));
    const base_url = 'https://rra.ram.moe';
    const type = 'cuddle';
    const path = '/i/r?type=' + type;
    axios.get(base_url + path)
      .then((res) => {
        if (res.data.error) return this.catchError(bot, msg, __filename, res.data.error);
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            description: `${msg.author.username} cuddles with ${user.username}`,
            image: {
              url: base_url + res.data.path
            }
          }
        }).catch((err) => this.catchMessage(err, msg));
      }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};