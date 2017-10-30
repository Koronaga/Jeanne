const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  findMember = require('../../utils/utils.js').findMember;

module.exports = {
  desc: "Get the permission of you or someone else either guild-wide or channel specific.",
  usage: "<channel/guild> | [username/id/@mention]",
  aliases: ['perms'],
  cooldown: 5,
  guildOnly: true,
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
    if (!args) return 'wrong usage';
    const str = args + "";
    const array = str.split(/ ?\| ?/);
    let type = array[0];
    let member = array[1];
    const lower = type.toLowerCase();
    if (type === 'guild') {
      if (!member) {
        let perms = msg.member.permission.json;
        perms = JSON.stringify(perms).split(',').join('\n');
        perms = perms.replace(/"/g, '');
        perms = perms.replace(/:/g, ': ');
        perms = perms.replace(/true/g, '**true**');
        const slice = perms.slice(1, -1);
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: `Guild-wide permissions for **${msg.author.mention}**\n${slice}`
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      } else {
        const user = findMember(msg, member);
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
        const mem = msg.channel.guild.members.get(user.id);
        let perms = mem.permission.json;
        perms = JSON.stringify(perms).split(',').join('\n');
        perms = perms.replace(/"/g, '');
        perms = perms.replace(/:/g, ': ');
        perms = perms.replace(/true/g, '**true**');
        const slice = perms.slice(1, -1);
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: `Guild-wide permissions for **${user.mention}**\n${slice}`
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      }
    } else if (type === 'channel') {
      if (!member) {
        let perms = msg.channel.permissionsOf(msg.author.id).json;
        perms = JSON.stringify(perms).split(',').join('\n');
        perms = perms.replace(/"/g, '');
        perms = perms.replace(/:/g, ': ');
        perms = perms.replace(/true/g, '**true**');
        const slice = perms.slice(1, -1);
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: `Channel specific permissions for **${msg.author.mention}**\n${slice}`
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      } else {
        const user = findMember(msg, member);
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
        let perms = msg.channel.permissionsOf(user.id).json;
        perms = JSON.stringify(perms).split(',').join('\n');
        perms = perms.replace(/"/g, '');
        perms = perms.replace(/:/g, ': ');
        perms = perms.replace(/true/g, '**true**');
        const slice = perms.slice(1, -1);
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: `Channel specific permissions for **${user.mention}**\n${slice}`
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      }
    } else {
      return 'wrong usage';
    }
  }
};