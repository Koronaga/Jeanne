const fs = require('fs');

module.exports = {
  desc: 'Easy way for me to ban guilds.',
  usage: '<user_id>',
  aliases: ['blu', 'bluser'],
  botPermissions: ['sendMessages', 'embedLinks'],
  cooldown: 5,
  hidden: true,
  ownerOnly: true,
  task(bot, msg, suffix, config) {
    let obj = JSON.parse(fs.readFileSync('./banned_users.json', 'utf8'));
    obj['bannedUserIds'].push(suffix);
    fs.writeFile('./banned_users.json', JSON.stringify(obj), (err) => {
      if (err) return this.catchError(bot, msg, __filename, err);
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          description: 'User added to the blacklist :black_heart:'
        }
      }).catch((err) => this.catchMessage(err, msg));
    });
  }
};