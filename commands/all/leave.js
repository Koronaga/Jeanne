const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError;

module.exports = {
  desc: "Makes the bot leave.",
  guildOnly: true,
  requiredPermission: 'administrator',
  task(bot, msg) {
    /**
     * perm checks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     */
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    if (sendMessages === false) return;
    bot.createMessage(msg.channel.id, `It's not like this server was fun anyways, b-baka!`)
      .then(msg => {
        msg.channel.guild.leave();
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};