const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  giphy = require('giphy-api')();

module.exports = {
  desc: "Sends a gif from giphy using your search terms.",
  usage: "<tags> | nothing for absolutely random",
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
    giphy.random(`${args}`)
      .then((res) => {
        const imgURL = res.data.image_url;
        if (imgURL === undefined) return bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: 0xff0000,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: `Coudn't find any image.`
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
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
            description: `[Direct image url](${imgURL})
Frames: ${res.data.image_frames}
Width: ${res.data.image_width}
Height: ${res.data.image_height}`,
            image: {
              url: `${imgURL}`
            }
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};