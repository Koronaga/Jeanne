const answers = [
  'Yes!',
  'No way!',
  'Obviously',
  'Try again next time',
  'Probably not',
  'Probably',
  'Think harder and try again!',
  'Idk u tell me..',
  'Keep on dreaming!',
  'Without a doubt',
  'My sources say no',
  'Very doubtful',
  'It is decidedly so..',
  'My reply is no',
  'Better not tell you now..',
  'Don\'t count on it..',
  'Cannot predict now..'
];

module.exports = {
  desc: 'ya know, 8ball does 8ball things.',
  usage: '<question>',
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, args) {
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    if (sendMessages === false) return;
    if (!args) return 'wrong usage';
    const choice = answers[Math.floor(Math.random() * answers.length)];
    msg.channel.createMessage('🎱 | ' + choice)
      .catch((e) => this.catchError(e, msg));
  }
};