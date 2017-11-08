const axios = require('axios');

module.exports = {
  desc: 'Get info about a bot from bots.discord.pw',
  usage: '<bot_id/@mention>',
  example: '@Jeanne d\'Arc#3378',
  cooldown: 30,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
    if (!config.config.abalBotsKey) return;
    if (!args) return 'wrong usage';
    if (msg.mentions[0]) {
      const user = msg.mentions[0];
      if (user.bot === false) return msg.channel.createMessage('<:RedCross:373596012755025920> | This is not a bot.')
        .catch((err) => this.catchMessage(err, msg));
      axios.get(`https://bots.discord.pw/api/bots/${user.id}`, {
        headers: {
          'Authorization': config.abalBotsKey,
          'User-Agent': USERAGENT
        }
      }).then((res) => {
        const data = res.data;
        if (res.status !== 200) return this.catchError(bot, msg, __filename, res.data);
        const inv = data.invite_url.replace(/ /g, '%20');
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: data.name,
            url: data.website,
            thumbnail: {
              url: `${user.avatarURL}`
            },
            description: `**ID:** ${data.client_id}\n` +
            `**Desc:** ${data.description}\n` +
            `**Library:** ${data.library}\n` +
            `**Owners:** ${JSON.stringify(data.owner_ids).replace(/\[/g, '').replace(/\]/g, '').replace(/"/g, '')}\n` +
            `**Prefix:** ${data.prefix}\n` +
            `**Invite:** [\`Click here\`](${inv})\n` +
            `**Website:** ${data.website}`
          }
        }).catch((err) => this.catchMessage(err, msg));
      }).catch((err) => this.catchError(bot, msg, __filename, err.response.data.status + ', ' + err.response.data.message));
    } else {
      const idRegex = /^\d{17,18}$/.test(args);
      if (idRegex === false) return 'wrong usage';
      const user = bot.users.get(args);
      if (!user) return msg.channel.createMessage('<:RedCross:373596012755025920> | Something went wrong, make sure it\'s a valid user.')
        .catch((err) => this.catchMessage(err, msg));
      if (user.bot === false) return msg.channel.createMessage('<:RedCross:373596012755025920> | This is not a bot.')
        .catch((err) => this.catchMessage(err, msg));
      axios.get(`https://bots.discord.pw/api/bots/${user.id}`, {
        headers: {
          'Authorization': config.abalBotsKey,
          'User-Agent': USERAGENT
        }
      }).then((res) => {
        const data = res.data;
        if (res.status !== 200) return this.catchError(bot, msg, __filename, res.data);
        const inv = data.invite_url.replace(/ /g, '%20');
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: data.name,
            url: data.website,
            thumbnail: {
              url: `${user.avatarURL}`
            },
            description: `**ID:** ${data.client_id}\n` +
            `**Desc:** ${data.description}\n` +
            `**Library:** ${data.library}\n` +
            `**Owners:** ${JSON.stringify(data.owner_ids).replace(/\[/g, '').replace(/\]/g, '').replace(/"/g, '')}\n` +
            `**Prefix:** ${data.prefix}\n` +
            `**Invite:** [\`Click here\`](${inv})\n` +
            `**Website:** ${data.website}`
          }
        }).catch((err) => this.catchMessage(err, msg));
      }).catch((err) => this.catchError(bot, msg, __filename, err.response.data.status + ', ' + err.response.data.message));
    }
  }
};