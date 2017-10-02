const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  games = reload('../../special/games.json');

module.exports = {
  desc: "Change the bot's status to streaming. Available flags are:\n\t-f   Force the game to stay the same.\n\t-r   Return to random game cycling, ignoring the input.",
  help: "Start with a valid game object `{\"name\": \"\", \"type\": 0, \"url\": \"\"}`",
  usage: "<status object | url> <flag>",
  hidden: true,
  ownerOnly: true,
  task(bot, msg, args, config) {
    if (!args) return bot.createMessage(msg.channel.id, 'No args provided');
    if (args.endsWith('-r')) return bot.editStatus(null, {
        name: games[~~(Math.random() * games.length)],
        type: 1,
        url: args.replace(/ *\-r$/, '')
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });

    if (args.endsWith('-f')) {
      config.cycleGames = false;
      bot.editStatus(JSON.parse(args.replace(/ *\-f$/, '')))
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
    }
  }
};