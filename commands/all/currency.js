const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  currency = require('y-currency');

module.exports = {
  desc: "Convert currency",
  usage: "<value> | <from_currency> | <to_currency> (Make sure to seperate them with a |)\nex. j:currency 10 | EUR | USD",
  aliases: ['cc'],
  guildOnly: true,
  cooldown: 10,
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
    const str = args.toString();
    const array = str.split(/ ?\| ?/),
      value = parseInt(array[0], 10),
      fromCurrency = array[1],
      toCurrency = array[2];
    if (!fromCurrency) return 'wrong usage';
    if (!toCurrency) return 'wrong usage';
    currency.convert(value, fromCurrency, toCurrency, (err, conv) => {
      if (err) {
        if ((err.message) && (err.message.includes('The result is undifined. Make sure that you are using correct currency symbols') || err.message.includes('Invalid parameter lengths'))) {
          msg.channel.createMessage(`\\❌ Either **${fromCurrency}** or **${toCurrency}** is an unsupported currency.\nPlease use the correct currency code. (http://www.xe.com\\symbols.php)`)
            .catch(err => handleErrorNoMsg(bot, __filename, err));
          return;
        }
        handleError(bot, __filename, msg.channel, err);
        return;
      }
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: `${msg.author.username}`,
            url: `${msg.author.avatarURL}`,
            icon_url: `${msg.author.avatarURL}`
          },
          description: `${fromCurrency}: ${value}
${toCurrency}: ${conv}`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    });
  }
};