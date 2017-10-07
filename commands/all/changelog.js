const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError;

module.exports = {
  desc: "Sends the latest changelog from the support server.",
  cooldown: 5,
  guildOnly: true,
  task(bot, msg) {
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
    let c_ = bot.getChannel('344944294487916544');
    c_.getMessages(0)
      .then((value) => {
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: 'Latest update(s):',
              icon_url: `${bot.user.avatarURL}`
            },
            description: `${value[0].content}`
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};