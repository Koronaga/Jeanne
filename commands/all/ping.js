const RESPONSES = [
  "pong",
  "It's not like I wanted to say pong or anything b-baka!",
  "pong!",
  "what!?",
  "E-ehh pong?",
  "No..."
];
const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError;
let Nf = new Intl.NumberFormat('en-US');

module.exports = {
  desc: "Responds with pong.",
  help: "Used to check if the bot is working.\nReplies with 'pong' and the response delay.",
  aliases: ['p'],
  cooldown: 2,
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
    let choice = ~~(Math.random() * RESPONSES.length);
    bot.createMessage(msg.channel.id, {
      content: ``,
      embed: {
        color: config.defaultColor,
        author: {
          name: `${RESPONSES[choice]}`,
          icon_url: ``
        },
        description: ``
      }
    }).then(sentMsg => {
      bot.editMessage(msg.channel.id, sentMsg.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: `${RESPONSES[choice]}`,
            icon_url: ``
          },
          description: `Took me ${Nf.format(sentMsg.timestamp - msg.timestamp)}ms`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err);
    });
  }
};