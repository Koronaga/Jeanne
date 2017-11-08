const ddg = require('ddg');

module.exports = {
  desc: 'Gets top 4 results from duckduckgo.',
  usage: '<text_to_search>',
  example: 'anime',
  aliases: ['ddg'],
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
    if (!args) return 'wrong usage';
    ddg.query(`${args}`, (err, data) => {
      if (err) return this.catchError(bot, msg, __filename, err);
      let message = '';
      data.RelatedTopics.forEach((topic, i) => {
        if (i >= 4) return;
        message += `**${topic.FirstURL}**\n*${topic.Text}*\n`;
      });
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: 'Top 4 results:',
          thumbnail: {
            url: 'https://b.catgirlsare.sexy/o1Ih.png'
          },
          description: `${message}`
        }
      }).catch((err) => this.catchMessage(err, msg));
    });
  }
};