const fs = require('fs');

module.exports = {
  desc: 'Easy way for me to ban guilds.',
  usage: '<guild_id>',
  aliases: ['banguild', 'blg', 'blguild'],
  botPermissions: ['sendMessages', 'embedLinks'],
  cooldown: 5,
  hidden: true,
  ownerOnly: true,
  task(bot, msg, suffix, config) {
    bot.leaveGuild(suffix)
      .then(() => {
        let obj = JSON.parse(fs.readFileSync('./banned_guilds.json', 'utf8'));
        obj['bannedGuildIds'].push(suffix);
        fs.writeFile('./banned_guilds.json', JSON.stringify(obj), (err) => {
          if (err) return this.catchError(bot, msg, __filename, err);
          msg.channel.createMessage({
            embed: {
              color: config.defaultColor,
              description: 'Guild added to the blacklist :black_heart:'
            }
          }).catch((err) => this.catchMessage(err, msg));
        });
      }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};