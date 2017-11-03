let reload = require('require-reload'),
  config = reload('../../config.json'),
  fs = require('fs');

module.exports = {
  desc: '',
  aliases: ['lvl', 'points', 'profile', 'rank'],
  cooldown: 5,
  task(bot, msg, args) {
    /**
     * perm checks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
     */
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
    if (sendMessages === false) return;
    if (embedLinks === false) return msg.channel.createMessage('<:RedCross:373596012755025920> | I\'m missing the \`embedLinks\` permission, which is required for this command to work.')
      .catch((e) => this.catchMessage(e, msg));
    if (!args) {
      let points = JSON.parse(fs.readFileSync('./db/points.json', 'utf8'));
      if (!points) return msg.channel.createMessage({
        embed: {
          color: 0xff0000,
          description: 'Couldn\'t find your data.'
        }
      }).catch((err) => this.catchMessage(msg, err));
      let userData = points[msg.author.id];
      if (!userData) return bot.createMessage(msg.channel.id, {
        embed: {
          color: 0xff0000,
          description: 'Oh it looks like you do not have any points yet, better start talking and stop lurking boii.'
        }
      }).catch((e) => this.catchMessage(e, msg));
      bot.createMessage(msg.channel.id, {
        embed: {
          color: config.defaultColor,
          author: {
            name: `Profile of ${msg.author.username}`,
          },
          fields: [{
            name: 'Level',
            value: `${userData.level}`,
            inline: true
          },
          {
            name: 'Points',
            value: `${userData.points}`,
            inline: true
          }
          ]
        }
      }).catch((err) => this.catchMessage(err, msg));
    } else {
      const user = this.findMember(msg, args);
      if (!user) return bot.createMessage(msg.channel.id, {
        embed: {
          color: config.errorColor,
          description: 'That is not a valid guild member. Need to specify a name, ID or mention the user.'
        }
      }).catch((e) => this.catchMessage(e, msg));
      let points = JSON.parse(fs.readFileSync('./db/points.json', 'utf8'));
      if (!points) return bot.createMessage(msg.channel.id, {
        embed: {
          color: config.errorColor,
          description: 'Couldn\'t find your data.'
        }
      }).catch((err) => this.catchMessage(err, msg));
      let userData = points[user.id];
      if (!userData) return bot.createMessage(msg.channel.id, {
        embed: {
          color: config.errorColor,
          description: 'Oh it looks like you do not have any points yet, better start talking and stop lurking boii.'
        }
      }).catch((err) => this.catchMessage(err, msg));
      bot.createMessage(msg.channel.id, {
        embed: {
          color: config.defaultColor,
          author: {
            name: `Profile of ${user.username}`,
          },
          fields: [{
            name: 'Level',
            value: `${userData.level}`,
            inline: true
          },
          {
            name: 'Points',
            value: `${userData.points}`,
            inline: true
          }
          ]
        }
      }).catch((err) => this.catchMessage(err, msg));
    }
  }
};