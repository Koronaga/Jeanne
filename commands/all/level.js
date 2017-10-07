const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  fs = require('fs');

module.exports = {
  desc: "Get your level and points.",
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
    if (embedLinks === false) return msg.channel.createMessage(`\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    if (!args) {
      let points = JSON.parse(fs.readFileSync(`./db/points.json`, 'utf8'));
      if (!points) return bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: 0xff0000,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Couldn't find your data.`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
      let userData = points[msg.author.id];
      if (!userData) return bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: 0xff0000,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Oh it looks like you do not have any points yet, better start talking and stop lurking boii.`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: `Profile of ${msg.author.username}`,
            url: ``,
            icon_url: ``
          },
          description: ``,
          fields: [{
              name: `Level`,
              value: `${userData.level}`,
              inline: true
            },
            {
              name: `Points`,
              value: `${userData.points}`,
              inline: true
            }
          ]
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    } else {
      const user = this.findMember(msg, args)
      if (!user) return bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.errorColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `That is not a valid guild member. Need to specify a name, ID or mention the user.`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
      // const userID = msg.channel.guild.members.get(user.id);
      let points = JSON.parse(fs.readFileSync(`./db/points.json`, 'utf8'));
      if (!points) return bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.errorColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Couldn't find your data.`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
      let userData = points[user.id];
      if (!userData) return bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.errorColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Oh it looks like you do not have any points yet, better start talking and stop lurking boii.`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: `Profile of ${user.username}`,
            url: ``,
            icon_url: ``
          },
          description: ``,
          fields: [{
              name: `Level`,
              value: `${userData.level}`,
              inline: true
            },
            {
              name: `Points`,
              value: `${userData.points}`,
              inline: true
            }
          ]
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    }
  }
};