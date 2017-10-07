const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError;

module.exports = {
  desc: "Prunes the given number of messages. If no number is given it's standard 50.",
  usage: "<number>",
  aliases: ['purge', 'clear'],
  guildOnly: true,
  requiredPermission: 'manageMessages',
  cooldown: 5,
  task(bot, msg, suffix) {
    /**
     * perm checks
     * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
     * @param {boolean} manageMessages - Checks if the bots permissions has manageMessages
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     */
    const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
    const manageMessages = msg.channel.permissionsOf(bot.user.id).has('manageMessages');
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    if (sendMessages === false) return;
    if (embedLinks === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    if (manageMessages === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`manageMessages\` permission, which is required for this command to work.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    var limit;
    if (!suffix) {
      limit = 50 + 1;
    } else if (suffix) {
      var count = parseInt(suffix);
      limit = count + 1;
      if (count > 100) return msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.errorColor,
            title: `Exceeded max messages to delete`,
            description: `Messages to delete is limited to 100.`
          }
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
    }
    bot.purgeChannel(msg.channel.id, limit)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};