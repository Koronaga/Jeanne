const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  fs = require('fs');

module.exports = {
  desc: "Easy way for me to ban guilds.",
  usage: "<user_id>",
  aliases: ['blu', 'bluser'],
  cooldown: 5,
  hidden: true,
  ownerOnly: true,
  task(bot, msg, suffix) {
    var obj = JSON.parse(fs.readFileSync(`./banned_users.json`, 'utf8'));
    obj['bannedUserIds'].push(suffix);
    fs.writeFile(`./banned_users.json`, JSON.stringify(obj), (err) => {
      if (err) return handleError(bot, __filename, msg.channel, err);
      bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: `User added to the blacklist :black_heart:`
          }
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
    })
  }
};