const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  currency = require('y-currency');

module.exports = {
  desc: 'Convert currency',
  usage: '<value> | <from_currency> | <to_currency>',
  exmaple: '10 | EUR | USD',
  aliases: ['cc'],
  guildOnly: true,
  cooldown: 10,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
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
          return msg.channel.createMessage(`<:RedCross:373596012755025920> | Either **${fromCurrency}** or **${toCurrency}** is an unsupported currency.\nPlease use the correct currency code. (http://www.xe.com\\symbols.php)`)
            .catch((err) => this.catchMessage(err, msg));
        }
        return this.catchError(bot, msg, __filename, err);
      }
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          description: `${fromCurrency.toUpperCase()}: ${value}\n` +
          `${toCurrency.toUpperCase()}: ${conv}`
        }
      }).catch((err) => this.catchMessage(err, msg));
    });
  }
};