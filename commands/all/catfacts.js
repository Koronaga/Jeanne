const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  catFacts = require('cat-facts'),
  request = require('request');

module.exports = {
  desc: "Gives you a random catfact with a cute cat image.",
  cooldown: 5,
  guildOnly: true,
  aliases: ['catfact'],
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
    catfactsTimesUsed++
    let randomFact = catFacts.random();
    request("http://random.cat/meow", function (err, response, body) {
      if (err) return handleError(bot, __filename, msg.channel, err);
      var cat = JSON.parse(body);
      if (!cat) return bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.errorColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Woops looks like something bad happened, please try again.`,
          fields: [{
            name: `For support join:`,
            value: `https://discord.gg/Vf4ne5b`,
            inline: true
          }]
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: `Click here for the direct image url`,
            url: `${cat.file}`,
            icon_url: ``
          },
          description: ``,
          thumbnail: {
            url: `${cat.file}`
          },
          fields: [{
            name: `**Cat fact:**`,
            value: `${randomFact}`
          }]
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    });
  }
};