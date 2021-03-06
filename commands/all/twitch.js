const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  axios = require('axios');

module.exports = {
  desc: "Get info on a user or channel.",
  usage: "<user/channel> | <name>",
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
    if (!args) return 'wrong usage';
    const str = args + "";
    const array = str.split(/ ?\| ?/);
    let type = array[0],
      name = array[1];
    if (!type) return 'wrong usage';
    if (!name) return 'wrong usage';
    type = type.toLowerCase();
    if (type === 'user') {
      axios.get(`https://api.twitch.tv/kraken/users/${name}`, {
        headers: {
          "Client-ID": config.twitch_clientID,
          'User-Agent': USERAGENT
        }
      }).then(res => {
        if (res.status !== 200) return handleError(bot, __filename, msg.channel, res.data);
        const data = res.data;
        let createdAt = data.created_at;
        createdAt = createdAt.slice(0, 10);
        let logo = data.logo;
        if (logo === null) logo = '';
        let bio = data.bio;
        if (bio === null) bio = 'None';
        msg.channel.createMessage({
          content: ``,
          embed: {
            color: 0x6441A4,
            author: {
              name: `${data.display_name} (${data._id})`,
              url: `https://twitch.tv/${data.name}`,
              icon_url: `${logo}`
            },
            description: `${bio}\n` +
              `**Created At:** ${createdAt}`,
            thumbnail: {
              url: `${logo}`
            }
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err.response.data.status + ', ' + err.response.data.message);
      });


    } else if (type === 'channel') {
      axios.get(`https://api.twitch.tv/kraken/channels/${name}`, {
        headers: {
          "Client-ID": config.twitch_clientID,
          'User-Agent': USERAGENT
        }
      }).then(res => {
        if (res.status !== 200) return handleError(bot, __filename, msg.channel, res.data);
        const data = res.data;
        let createdAt = data.created_at;
        createdAt = createdAt.slice(0, 10);
        let logo = data.logo;
        if (logo === null) logo = '';
        let status = data.status;
        if (status === null) status = 'None';
        let broadcasterLang = data.broadcaster_language;
        if (broadcasterLang === null) broadcasterLang = 'None';
        let currentGame = data.game;
        if (currentGame === null) currentGame = 'None';
        let delay = data.delay;
        if (delay === null) delay = 'None';
        let mature = data.mature;
        if (mature === true) mature = 'Yes';
        if (mature === false) mature = 'No';
        let partner = data.partner;
        if (partner === true) partner = 'Yes';
        if (partner === false) partner = 'No';
        msg.channel.createMessage({
          content: ``,
          embed: {
            color: 0x6441A4,
            author: {
              name: `${data.display_name} (${data._id})`,
              url: `https://twitch.tv/${data.name}`,
              icon_url: `${logo}`
            },
            description: `${status}\n\n` +
              `**Created At:** ${createdAt}\n` +
              `**Broadcaster Language:** ${broadcasterLang}\n` +
              `**Language:** ${data.language}\n` +
              `**Mature Content:** ${mature}\n` +
              `**Current Game:** ${currentGame}\n` +
              `**Twitch Partner:** ${partner}\n` +
              `**Views:** ${data.views}\n` +
              `**Followers:** ${data.followers}\n` +
              `**Delay:** ${delay}\n` +
              `**Twitch Url:** ${data.url}`,
            thumbnail: {
              url: `${logo}`
            }
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err.response.data.status + ', ' + err.response.data.message);
      });
    } else {
      return 'wrong usage';
    }
  }
};