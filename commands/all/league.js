const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  formatSeconds = require("../../utils/utils.js").formatSeconds,
  API = require('lol-riot-api-module');

module.exports = {
  desc: "Get your profile info by name.",
  usage: "<region> | <name>",
  cooldown: 5,
  guildOnly: true,
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
    leagueTimesUsed++
    if (!args) return 'wrong usage';
    const str = args + "";
    const array = str.split(/ ?\| ?/),
      region = array[0],
      user = array[1];
    if (!user) return 'wrong usage';
    const api = new API({
      key: config.league_key,
      region: region
    });
    const options = {
      name: user
    };
    api.getSummoner(options, (err, data) => {
      if (err) return handleError(bot, __filename, msg.channel, err);
      const date = new Date(data.revisionDate);
      msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `Info of ${data.name}`,
              url: ``,
              icon_url: ``
            },
            description: `ID: ${data.id}`,
            fields: [{
                name: `Account ID`,
                value: `${data.accountId}`,
                inline: true
              },
              {
                name: `Summoner Level`,
                value: `${data.summonerLevel}`,
                inline: true
              }
            ],
            footer: {
              text: `${date.toString()}`
            }
          }
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
    });
  }
};