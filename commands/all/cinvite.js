module.exports = {
  desc: 'Create an invite with a channel id.',
  hidden: true,
  ownerOnly: true,
  task(bot, msg, args, config) {
    const channelid = `${args}`;
    bot.createChannelInvite(channelid, {
      temporary: false,
      unique: true
    }).then((inv) => {
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: `${inv.guild} (${inv.channel})`,
          description: `https://discord.gg/${inv.code}`
        }
      }).catch((err) => this.catchMessage(err, msg));
    }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};