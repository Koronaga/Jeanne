const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  axios = require('axios');

module.exports = {
  desc: "Get a beautiful picture from https://unsplash.com",
  cooldown: 60,
  guildOnly: true,
  task(bot, msg) {
    /**
     * perm checks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
     */
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
    if (sendMessages === false) return;
    if (embedLinks === false) return msg.channel.createMessage(`\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    unsplashTimesUsed++
    axios.get('https://api.unsplash.com/photos/random', {
      headers: {
        'Authorization': "Client-ID " + config.unsplash_key,
        'User-Agent': USERAGENT
      }
    }).then(res => {
      if (res.status !== 200) return handleError(bot, __filename, msg.channel, res.data);
      const data = res.data;
      let color = data.color.replace('#', '0x');
      color = parseInt(color);
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: color,
          author: {
            name: 'Photographer: ' + data.user.name,
            url: data.user.links.html + '?utm_source=Jeanne%20Discord%20Bot&utm_medium=referral&utm_campaign=api-credit',
            icon_url: data.user.profile_image.small
          },
          description: `[\`download image\`](${data.links.download}?utm_source=Jeanne%20Discord%20Bot&utm_medium=referral&utm_campaign=api-credit)\n` +
            `\\👍 Likes: ${data.likes}\n` +
            `\\👀 Views: ${data.views}\n` +
            `\\🌇 Location: ${data.location === undefined ? `n/a` : ''}${data.location !== undefined ? data.location.title : ''}`,
          image: {
            url: data.urls.regular + '?utm_source=Jeanne%20Discord%20Bot&utm_medium=referral&utm_campaign=api-credit'
          },
          footer: {
            text: `Image from https://unsplash.com`,
            icon_url: `https://b.catgirlsare.sexy/7OSH.png`
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