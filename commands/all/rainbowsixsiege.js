const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  RainbowSixApi = require('rainbowsix-api-node'),
  R6 = new RainbowSixApi();

module.exports = {
  desc: "Get your r6 siege data.",
  usage: "<username> | <platform> (uplay, xone, ps4)",
  aliases: ['r6', 'rsix', 'r6s'],
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
    rainbowsixsiegeTimesUsed++
    var args = args.toString();
    var data = args.split(/ ?\| ?/),
      uname = data[0],
      pform = data[1];

    let username = `${uname}`;
    let platform = `${pform}`; // uplay, xone, ps4

    R6.stats(username, platform)
      .then(res => {
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `Info of: ${res.player.username}`,
              url: ``,
              icon_url: ``
            },
            description: ``,
            thumbnail: {
              url: `https://b.catgirlsare.sexy/cb_j.jpg`
            },
            fields: [{
                name: `Progression`,
                value: `**Level:** ${res.player.stats.progression.level}
**XP:** ${res.player.stats.progression.xp}`,
                inline: true
              },
              {
                name: `Ranked`,
                value: `**Wins:** ${res.player.stats.ranked.wins}
**Losses:** ${res.player.stats.ranked.losses}
**w/l ratio:** ${res.player.stats.ranked.wlr}
**Kills:** ${res.player.stats.ranked.kills}
**Deaths:** ${res.player.stats.ranked.deaths}
**k/d ratio:** ${res.player.stats.ranked.kd}`,
                inline: true
              },
              {
                name: `Casual`,
                value: `**Wins:** ${res.player.stats.casual.wins}
**Losses:** ${res.player.stats.casual.losses}
**w/l ratio:** ${res.player.stats.casual.wlr}
**Kills:** ${res.player.stats.casual.kills}
**Deaths:** ${res.player.stats.casual.deaths}
**k/d ratio:** ${res.player.stats.casual.kd}`,
                inline: true
              },
              {
                name: `Overall`,
                value: `**Revives:** ${res.player.stats.overall.revives}
**Suicides:** ${res.player.stats.overall.suicides}
**Reinforcements deployed:** ${res.player.stats.overall.reinforcements_deployed}
**Barricades built:** ${res.player.stats.overall.barricades_built}
**Steps moved:** ${res.player.stats.overall.steps_moved}
**Bullets fired:** ${res.player.stats.overall.bullets_fired}
**Bullets hit:** ${res.player.stats.overall.bullets_hit}
**Headshots:** ${res.player.stats.overall.headshots}
**Melee kills:** ${res.player.stats.overall.melee_kills}
**Penetration kills:** ${res.player.stats.overall.penetration_kills}
**Assists:** ${res.player.stats.overall.assists}`,
                inline: true
              }
            ]
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      }).catch(err => {
        var title = err.errors.map(t => t.title);
        var detail = err.errors.map(d => d.detail);
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.errorColor,
            author: {
              name: `${err.status}`,
              url: ``,
              icon_url: `https://b.catgirlsare.sexy/NBRh.png`
            },
            description: ``,
            thumbnail: {
              url: `https://b.catgirlsare.sexy/NBRh.png`
            },
            fields: [{
              name: `${title}`,
              value: `${detail}`,
              inline: false
            }]
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      });
  }
};