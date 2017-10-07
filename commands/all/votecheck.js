const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  axios = require('axios');

module.exports = {
  desc: "Check if you upvoted Jeanne d'Arc. (Test/example command)",
  cooldown: 5,
  guildOnly: true,
  task(bot, msg) {
    axios.get('https://discordbots.org/api/bots/237578660708745216/votes', {
      headers: {
        'Authorization': config.discordbotsorg,
        'User-Agent': USERAGENT
      },
      params: {
        onlyids: true
      }
    }).then(res => {
      if (res.status !== 200) return handleError(bot, __filename, msg.channel, res.data);
      let users = res.data;
      const check = users.includes(msg.author.id);
      if (check === false) return msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Ohno it looks like you didn't upvote me \\😢\n` +
            `Please go to: [discordbots.org/bot/jeanne](https://discordbots.org/bot/jeanne) and click on upvote.`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
      if (check === true) return msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Yaay it looks like you upvoted for me thank you so much!! \\💗`,
          footer: {
            text: 'https://discordbots.org/bot/jeanne'
          }
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err.response.data.status + ', ' + err.response.data.message);
    });
  }
};