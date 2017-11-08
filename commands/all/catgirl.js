const axios = require('axios');

module.exports = {
  desc: 'Sends a cute catgirl.',
  usage: '<sfw/nsfw>',
  example: 'sfw',
  cooldown: 10,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config, settingsManager) {
    args = args.toLowerCase();
    const sites = ['nekos.brussell', 'nekos.life'];
    const site = sites[Math.floor(Math.random() * sites.length)];
    if (!args || args === 'sfw') {
      if (site === 'nekos.brussell') {
        axios.get('https://nekos.brussell.me/api/v1/random/image?nsfw=false', {
          headers: {
            'User-Agent': USERAGENT
          }
        }).then((res) => {
          const data = res.data;
          msg.channel.createMessage({
            embed: {
              color: config.defaultColor,
              description: `[Image](https://nekos.brussell.me/image/${data.images[0].id})`,
              image: {
                url: `https://nekos.brussell.me/image/${data.images[0].id}`
              }
            }
          }).catch((err) => this.catchMessage(err, msg));
        }).catch((err) => this.catchError(bot, msg, __filename, err));
      } else if (site === 'nekos.life') {
        axios.get('https://nekos.life/api/neko', {
          headers: {
            'User-Agent': USERAGENT
          }
        }).then((res) => {
          const data = res.data;
          msg.channel.createMessage({
            embed: {
              color: config.defaultColor,
              description: `[Image](${data.neko})`,
              image: {
                url: data.neko
              }
            }
          }).catch((err) => this.catchMessage(err, msg));
        }).catch((err) => this.catchError(bot, msg, __filename, err));
      } else return;
    } else if (args === 'nsfw') {
      const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
      if (!nsfw) return msg.channel.createMessage('You can only use this in **nsfw** channels, use \`j:settings nsfw <allow/deny>\`.\nFor sfw catgirls use \`j:catgirl sfw\`.')
        .catch((err) => this.catchMessage(err, msg));
      if (site === 'nekos.brussell') {
        axios.get('https://nekos.brussell.me/api/v1/random/image?nsfw=true', {
          headers: {
            'User-Agent': USERAGENT
          }
        }).then((res) => {
          const data = res.data;
          msg.channel.createMessage({
            embed: {
              color: config.defaultColor,
              description: `[Image](https://nekos.brussell.me/image/${data.images[0].id})`,
              image: {
                url: `https://nekos.brussell.me/image/${data.images[0].id}`
              }
            }
          }).catch((err) => this.catchMessage(err, msg));
        }).catch((err) => this.catchError(bot, msg, __filename, err));
      } else if (site === 'nekos.life') {
        axios.get('https://nekos.life/api/lewd/neko', {
          headers: {
            'User-Agent': USERAGENT
          }
        }).then((res) => {
          const data = res.data;
          msg.channel.createMessage({
            embed: {
              color: config.defaultColor,
              description: `[Image](${data.neko})`,
              image: {
                url: data.neko
              }
            }
          }).catch((err) => this.catchMessage(err, msg));
        }).catch((err) => this.catchError(bot, msg, __filename, err));
      } else return;
    } else return 'wrong usage';
  }
};