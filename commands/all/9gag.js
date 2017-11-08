const gagScraper = require('9gag-scraper');

module.exports = {
  desc: 'Sends a random 9gag post.',
  example: '\u200b',
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, _, config) {
    const gag = new gagScraper();
    gag.getRandom((err, data) => {
      if (err) return this.catchError(bot, msg, __filename, err);
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          author: {
            name: `${data.title}`,
            url: `${data.url}`
          },
          description: `${data.url}`,
          image: {
            url: `${data.image}`
          }
        },
      }).catch((err) => this.catchMessage(err, msg));
    });
  }
};