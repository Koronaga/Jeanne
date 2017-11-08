const aesthetics = require('aesthetics');

module.exports = {
  desc: 'Convert text to aesthetic text.',
  usage: '<text>',
  example: 'This will be aesthetic',
  aliases: ['aes'],
  guildOnly: true,
  cooldown: 5,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args) {
    if (!args) return 'wrong usage';
    const conv = aesthetics(args);
    msg.channel.createMessage(conv)
      .catch((err) => this.catchMessage(err, msg));
  }
};