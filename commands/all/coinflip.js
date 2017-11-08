module.exports = {
  desc: 'Flip a coin.',
  aliases: ['coin', 'flip'],
  cooldown: 1,
  guildOnly: true,
  botPermissions: ['sendMessages'],
  task(bot, msg) {
    msg.channel.createMessage(`${msg.author.username} flipped a coin and it landed on ${Math.random() < .5 ? '**heads**' : '**tails**'}`)
      .catch((err) => this.catchMessage(err, msg));
  }
};