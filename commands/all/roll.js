const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  Nf = new Intl.NumberFormat('en-US');

module.exports = {
  desc: "Roll a number between the given range.",
  usage: "[[min-]max]",
  cooldown: 2,
  aliases: ['random'],
  task(bot, msg, suffix) {
    /**
     * perm checks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     */
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    if (sendMessages === false) return;
    let args = suffix.match(/(?:(\d+)-)?(\d+)/);
    let roll = args === null ? [1, 10] : [parseInt(args[1]) || 1, parseInt(args[2])];
    bot.createMessage(msg.channel.id, `${msg.author.username} rolled **${Nf.format(roll[0])}-${Nf.format(roll[1])}** and got **${Nf.format(~~((Math.random() * (roll[1] - roll[0] + 1)) + roll[0]))}**`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};