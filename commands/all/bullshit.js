module.exports = {
  desc: 'Just bullshit.',
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, _, config) {
    msg.channel.createMessage({
      embed: {
        color: config.defaultColor,
        image: {
          url: 'https://b.catgirlsare.sexy/yrKt.png'
        }
      }
    }).catch((err) => this.catchMessage(err, msg));
  }
};