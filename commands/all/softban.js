const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  findMember = require('../../utils/utils.js').findMember;

module.exports = {
  desc: "Softban the mentioned member.",
  usage: "<username/ID/@username> | [reason]",
  guildOnly: true,
  requiredPermission: 'banMembers',
  task(bot, msg, args) {
    /**
     * perm checks
     * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     * @param {boolean} banMembers - Checks if the bot permissions has banMembers
     */
    const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    const banMembers = msg.channel.permissionsOf(bot.user.id).has('banMembers');
    if (sendMessages === false) return;
    if (embedLinks === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    if (banMembers === false) return bot.createMessage(msg.channel.id, `\\❌ I'm missing the \`banMembers\` permission, which is required for this command to work.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    if (!args) return 'wrong usage';
    const str = args + "";
    const array = str.split(/ ?\| ?/),
      userToBan = array[0];
    let reason = array[1];
    if (!reason)
      reason = 'Responsible moderator did not provide a reason.';
    const user = findMember(msg, userToBan);
    const deletedays = 7;
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
    });
    bot.banGuildMember(msg.channel.guild.id, user.id, deletedays, reason)
      .catch(err => {
        if (err.message && err.message.includes('Privilege is too low...')) return msg.channel.createMessage(`\\❌ **My privilege is too low to ban this user.**\nI can't ban the owner of a server or people that have a higher role then I do.`)
          .catch(err => handleErrorNoMsg(bot, __filename, err));
        handleError(bot, __filename, msg.channel, err);
      });
    bot.unbanGuildMember(msg.channel.guild.id, user.id, 'Softban.')
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};