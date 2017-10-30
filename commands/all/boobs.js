const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  request = require('request-promise-native');

module.exports = {
  desc: "Sends a random boobs pic.",
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, args, config, settingsManager) {
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
    const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
    if (!nsfw) return bot.createMessage(msg.channel.id, 'You can only use this command in an **nsfw** channels, use \`j:settings nsfw <allow/deny>\`.')
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    request.get(`http://api.oboobs.ru/boobs/0/1/random`)
      .then(JSON.parse)
      .then(res => {
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: ``,
            image: {
              url: `http://media.oboobs.ru/${res[0].preview}`
            }
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};