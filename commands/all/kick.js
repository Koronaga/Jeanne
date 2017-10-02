const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  findMember = require('../../utils/utils.js').findMember;

module.exports = {
  desc: "Kick the mentioned member.",
  usage: "<username/ID/@username> | [reason]",
  guildOnly: true,
  requiredPermission: 'kickMembers',
  task(bot, msg, args) {
    /**
     * perm checks
     * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     * @param {boolean} kickMembers - Checks if the bots permissions has kickMembers
     */
    const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    const kickMembers = msg.channel.permissionsOf(bot.user.id).has('kickMembers');
    if (sendMessages === false) return;
    if (embedLinks === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    if (kickMembers === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`kickMembers\` permission, which is required for this command to work.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    if (!args) return 'wrong usage';
    kickTimesUsed++
    const str = args + "";
    const array = str.split(/ ?\| ?/),
      userToKick = array[0],
      reason = array[1];
    const user = findMember(msg, userToKick);
    if (!user) return bot.createMessage(msg.channel.id, {
      content: ``,
      embed: {
        color: config.errorColor,
        author: {
          name: ``,
          url: ``,
          icon_url: ``
        },
        description: `That is not a valid guild member. Need to specify a name, ID or mention the user.`
      }
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err);
    });
    bot.kickGuildMember(msg.channel.guild.id, user.id, reason)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};