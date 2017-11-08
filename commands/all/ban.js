module.exports = {
  desc: 'Ban the mentioned member.',
  usage: '<username/ID/@username> | [reason]',
  guildOnly: true,
  requiredPermission: 'banMembers',
  botPermissions: ['sendMessages', 'embedLinks', 'banMembers'],
  task(bot, msg, args, config) {
    if (!args) return 'wrong usage';
    const str = args + '';
    const array = str.split(/ ?\| ?/),
      userToBan = array[0],
      reason = array[1];
    const user = this.findMember(msg, userToBan);
    const deletedays = 7;
    if (!user) return msg.channel.createMessage({
      embed: {
        color: config.errorColor,
        description: 'That is not a valid guild member. Need to specify a name, ID or mention the user.'
      }
    }).catch((err) => this.catchMessage(err, msg));
    bot.banGuildMember(msg.channel.guild.id, user.id, deletedays, reason)
      .catch((err) => this.catchMessage(err, msg));
  }
};