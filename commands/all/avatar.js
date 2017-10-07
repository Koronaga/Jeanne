const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError;

module.exports = {
  desc: "Sends someone's avatar url. (The file size can be 128, 256, 512, 1024, or 2048. Defaults to 2048.)",
  usage: "<-s/--size> <size> OR <username/ID/@username> | <size>",
  aliases: ['ava', 'pfp', 'avi'],
  guildOnly: true,
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
    let format = '';
    let size = 2048;
    if (!args) {
      // j:avatar
      msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `Your Avatar:`,
              url: `${msg.author.dynamicAvatarURL(format, size)}`,
              icon_url: `${msg.author.dynamicAvatarURL(format, size)}`
            },
            description: `**[Click here for direct image link](${msg.author.dynamicAvatarURL(format, size)})**`,
            image: {
              url: `${msg.author.dynamicAvatarURL(format, size)}`
            }
          }
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
    } else if ((args.startsWith('--size')) || (args.startsWith('-s'))) {
      // j:avatar -s <size> || j:avatar --size <size>
      const str = args + "";
      const array = str.split(' ');
      let int = array[1];
      size = parseInt(int);
      msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `Your Avatar:`,
              url: `${msg.author.dynamicAvatarURL(format, size)}`,
              icon_url: `${msg.author.dynamicAvatarURL(format, size)}`
            },
            description: `**[Click here for direct image link](${msg.author.dynamicAvatarURL(format, size)})**`,
            image: {
              url: `${msg.author.dynamicAvatarURL(format, size)}`
            }
          }
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
    } else {
      // j:avatar <user> | <size>
      const str = args + "";
      const array = str.split(/ ?\| ?/);
      let member = array[0];
      let int = array[1];
      size = parseInt(int);
      if (!int)
        size = 2048;
      const user = this.findMember(msg, member);
      if (!user) return msg.channel.createMessage({
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
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      const id = msg.channel.guild.members.get(user.id);
      msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `${id.username}'s Avatar:`,
              url: `${user.dynamicAvatarURL(format, size)}`,
              icon_url: `${user.dynamicAvatarURL(format, size)}`
            },
            description: `**[Click here for direct image link](${user.dynamicAvatarURL(format, size)})**`,
            image: {
              url: `${user.dynamicAvatarURL(format, size)}`
            }
          }
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
    }
  }
};