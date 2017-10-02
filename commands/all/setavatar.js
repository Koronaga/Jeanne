const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  setAvatar = require('../../utils/utils.js').setAvatar;

module.exports = {
  desc: "Set the bot's avatar from a URL.",
  usage: "<url>",
  hidden: true,
  ownerOnly: true,
  task(bot, msg, suffix) {
    if (!suffix) return;
    setAvatar(bot, suffix)
      .then(() => {
        bot.createMessage(msg.channel.id, 'Avatar updated')
          .catch(err => {
            handleError(bot, __filename, msg.channel, err);
          });
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};