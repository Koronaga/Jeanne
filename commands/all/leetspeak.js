const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  Leetscript = require('leetscript');

module.exports = {
  desc: "Convert text to leetspeak.",
  usage: "<simple/advanced> | <text>",
  aliases: ['leet'],
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
        handleError(bot, __filename, msg.channel, err);
      });
    if (!args) return 'wrong usage';
    leetspeakTimesUsed++
    const str = args + "";
    const array = str.split(/ ?\| ?/),
      option = array[0],
      text = array[1];
    const lower = option.toLowerCase();
    if (lower === 'simple') {
      const LeetSimple = new Leetscript(true);
      const simple = LeetSimple.encode(`${text}`);
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `${simple}`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    } else if (lower === 'advanced') {
      const LeetAdvanced = new Leetscript();
      const advanced = LeetAdvanced.encode(`${text}`)
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `${advanced}`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    } else {
      return 'wrong usage';
    }
  }
};