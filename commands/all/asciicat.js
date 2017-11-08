const catMe = require('cat-me');

module.exports = {
  desc: 'Sends a unicode cat ;3',
  usage: '[option] (\'list\' to view all options)',
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
    let cat = catMe();
    if (!args) return msg.channel.createMessage(`\`\`\`${cat}\`\`\``)
      .catch((err) => this.catchMessage(err, msg));
    let lower = args.toLowerCase();
    if (lower === 'list') return msg.channel.createMessage({
      embed: {
        color: config.defaultColor,
        title: 'All cat options:',
        description: 'grumpy\n' +
        'approaching\n' +
        'tubby\n' +
        'confused\n' +
        'playful\n' +
        'thoughtful\n' +
        'delighted\n' +
        'nyan\n' +
        'resting'
      }
    }).catch((err) => this.catchMessage(err, msg));

    cat = catMe(`${args}`);
    msg.channel.createMessage(`\`\`\`${cat}\`\`\``)
      .catch((err) => this.catchMessage(err, msg));
  }
};