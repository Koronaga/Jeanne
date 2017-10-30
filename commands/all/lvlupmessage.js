const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  handleErrorNoMsg = require('../../utils/utils.js').handleErrorNoMsg,
  fs = require('fs');

module.exports = {
  desc: "Enable/disable the level up message.",
  usage: "<enable/disable>",
  aliases: ['lvlmsg', 'levelmsg', 'levelmessage'],
  cooldown: 5,
  guildOnly: true,
  requiredPermission: 'administrator',
  task(bot, msg, suffix) {
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
    if (!suffix) return 'wrong usage';
    const lower = suffix.toLowerCase();
    let message = JSON.parse(fs.readFileSync(`./db/message.json`, 'utf8'));
    if (suffix === 'enable') {
      message[msg.channel.guild.id] = {
        type: "true"
      };
      fs.writeFile(`./db/message.json`, JSON.stringify(message), (err) => {
        if (err) handleErrorNoMsg(bot, __filename, err);
      });
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `:white_check_mark: Level up message is now enabled!`
        },
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    } else if (suffix === 'disable') {
      message[msg.channel.guild.id] = {
        type: "false"
      };
      fs.writeFile(`./db/message.json`, JSON.stringify(message), (err) => {
        if (err) handleErrorNoMsg(bot, __filename, err);
      });
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: 0xf4ce11,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `:white_check_mark: Level up message is now disabled!`
        },
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    }
  }
};