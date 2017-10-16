const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  handleErrorNoMsg = require('../../utils/utils.js').handleErrorNoMsg,
  axios = require('axios');

module.exports = {
  desc: "Fetch image from zerochan.net",
  usage: "<tags>",
  aliases: ['zc', 'zero'],
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, args) {
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
        handleError(err);
      });
    if (!args) return 'wrong usage';
    const search = args.replace(/ /g, '%2C');
    axios.get(`https://www.zerochan.net/${search}`, {
      headers: {
        'User-Agent': USERAGENT,
        'Accept': 'application/json'
      },
      params: {
        json: true,
        s: 'random'
      }
    }).then(res => {
      if (!res.data.items) return msg.channel.createMessage(`\\❌ No images found for **${args}**`)
        .catch(err => handleErrorNoMsg(bot, __filename, err));
      const id = res.data.items[0].id;
      axios.get(`https://www.zerochan.net/${id}`, {
        headers: {
          'User-Agent': USERAGENT,
          'Accept': 'application/json'
        },
        params: {
          json: true
        }
      }).then(res => {
        const tags = res.data.tags;
        tags.splice(5);
        msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            title: res.data.primary,
            description: `Tags: ${tags.join(', ')}`,
            image: {
              url: res.data.full
            }
          }
        }).catch(err => {
          handleErrorNoMsg(bot, __filename, err);
        });
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err);
    });
  }
};