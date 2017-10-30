const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  axios = require('axios'),
  moment = require('../../node_modules/moment'),
  {
    flag,
    code,
    name
  } = require('country-emoji');
const baseURI = 'https://api.lepeli.fr';

module.exports = {
  desc: "Get info about a steam user.",
  usage: "<steamid32/steamid64/customurl>",
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
    axios.get(baseURI + `/steamid/`, {
        params: {
          s: args,
          key: config.steam_key
        }
      })
      .then(res => {
        const data = res.data;
        if (data.status != 200) return msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.errorColor,
            title: `ERROR`,
            description: `Status: ${data.status}\nMessage: ${data.message}\n\nFor support join: https://discord.gg/Vf4ne5b`
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
        const lastlogoff = new Date(data.profile.lastlogoff * 1000).toISOString();
        const timecreated = new Date(data.profile.timecreated * 1000).toISOString();
        let location = data.profile.location;
        if (!location) location = 'n/a';
        let realname = data.profile.realname;
        if (!realname) realname = 'n/a';
        msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: `${flag(data.profile.loccountrycode)} **__${data.profile.username}__**`,
            thumbnail: {
              url: `${data.avatars.avatarfull}`
            },
            fields: [{
                name: `Real name`,
                value: `${realname}`,
                inline: true
              },
              {
                name: `Privacy`,
                value: `${data.profile.privacy}`,
                inline: true
              },
              {
                name: `Last seen`,
                value: `${data.profile.state}`,
                inline: true
              },
              {
                name: `Last logoff`,
                value: `${moment(lastlogoff).utc().format('dddd - DD/MM/YYYY | kk:mm:ss')} UTC (${moment(lastlogoff).fromNow()})`,
                inline: false
              },
              {
                name: `Current state`,
                value: `${data.profile.personastate}`,
                inline: true
              },
              {
                name: `Location`,
                value: `${location}`,
                inline: true
              },
              {
                name: `Created on`,
                value: `${moment(timecreated).utc().format('dddd - DD/MM/YYYY | kk:mm:ss')} UTC (${moment(timecreated).fromNow()})`,
                inline: false
              },
              {
                name: `\u200b`,
                value: `steamid32: **${data.id.steamid32}**\nsteamid64: **${data.id.steamid64}**\ncustomurl: **${data.id.customurl}**`,
                inline: false
              }
            ]
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};