module.exports = {
  desc: 'Sends the latest changelog from the support server.',
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, _, config) {
    let channel = bot.getChannel('344944294487916544');
    channel.getMessages(0)
      .then((value) => {
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            author: {
              name: 'Latest update(s):',
              icon_url: `${bot.user.avatarURL}`
            },
            description: `${value[0].content}`
          }
        }).catch((err) => this.catchMessage(err, msg));
      }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};