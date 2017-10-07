const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError;

module.exports = {
  desc: "Shuts down Jeanne d'Arc.",
  ownerOnly: true,
  hidden: true,
  aliases: ['stop', 'end', 'sd'],
  task(bot, msg) {
    msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Shutting down, baii baii masta :heart:`
        }
      })
      .then(() => {
        process.exit(1);
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};