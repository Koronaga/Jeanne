const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleErrorNoMsg = require('../../utils/utils.js').handleErrorNoMsg;

module.exports = {
  desc: 'Echo',
  usage: '<text> | [#channel]',
  aliases: ['echo'],
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
    if (embedLinks === false) return msg.channel.createMessage('\\❌ I\'m missing the \`embedLinks\` permission, which is required for this command to work.')
      .catch((err) => handleErrorNoMsg(bot, __filename, err));
    if (!args) return 'wrong usage';
    const str = args + '';
    const array = str.split(/ ?\| ?/),
      text = array[0];
    if (msg.channelMentions[0]) {
      const chan = msg.channel.guild.channels.get(msg.channelMentions[0]);
      chan.createMessage({
        embed: {
          color: config.defaultColor,
          description: `${text}` || 'echo'
        }
      }).catch((err) => handleErrorNoMsg(bot, __filename, err));
      return;
    }
    msg.channel.createMessage({
      embed: {
        color: config.defaultColor,
        description: `${text}` || 'echo'
      }
    }).catch((err) => handleErrorNoMsg(bot, __filename, err));
  }
};