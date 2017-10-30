const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError;

module.exports = {
  desc: "Ban a user that is not in the guild.",
  usage: "<user_id> | [reason]",
  guildOnly: true,
  requiredPermission: 'banMembers',
  task(bot, msg, args) {
    /**
     * perm checks
     * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
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
      userToBan = array[0],
      reason = array[1];
    const deletedays = 7;
    const idRegex = /^\d{17,18}$/.test(userToBan);
    if (idRegex === true) {
      bot.banGuildMember(msg.channel.guild.id, userToBan, deletedays, reason)
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
    } else {
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.errorColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `The given ID is invalid, make sure you used a correct userID.`,
          fields: [{
            name: `For support join:`,
            value: `https://discord.gg/Vf4ne5b`,
            inline: true
          }]
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    }
  }
};