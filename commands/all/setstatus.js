const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    games = reload('../../special/games.json');

module.exports = {
    desc: "Change the bot's status.",
    help: "Start with a valid game ex. `with you`. Available flags are:\n\t-f   Force the game to stay the same.\n\t-r   Return to random game cycling, ignoring the input.",
    usage: "<status object | status> [flag]",
    hidden: true,
    ownerOnly: true,
    task(bot, msg, args, config) {
        const str = args + "";
        const array = str.split(/ ?\| ?/),
            status = array[0],
            game = array[1];
        if (!args) return bot.createMessage(msg.channel.id, 'No args provided')
            .catch(err => {
                handleError(err);
            });

        if (game.endsWith('-r')) return bot.editStatus(status, { name: games[~~(Math.random() * games.length)], type: 0 })
            .catch(err => {
                handleMsgError(msg.channel, err);
            });

        if (game.endsWith('-f')) {
            config.cycleGames = false;
            bot.editStatus(status, { name: game.replace(/ *\-f$/, ''), type: 0 })
                .catch(err => {
                    handleMsgError(msg.channel, err);
                });
        }
    }
};