const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  handleErrorNoMsg = require('../../utils/utils.js').handleErrorNoMsg,
  owjs = require('overwatch-js');

module.exports = {
  desc: "Get overwatch data.",
  usage: "<profile/competitive/quickplay> | <xbl/psn/pc> | <region> | <username>",
  aliases: ['ow'],
  cooldown: 5,
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
    const array = str.split(/ ?\| ?/),
      type = array[0], // profile, comp, quick
      platform = array[1], // xbl, psn, pc
      region = array[2], // eu, us, kr, cn
      username = array[3];
    const user = username.replace("#", "-");
    const lower = type.toLowerCase();
    if (lower === 'profile' || lower === 'pf') {
      owjs.getOverall(platform, region, user)
        .then(data => {
          msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              author: {
                name: `Info for: ${username}`,
                url: `${!data.profile.url ? `` : ''}${data.profile.url ? data.profile.url : ''}`,
                icon_url: `${!data.profile.rankPicture ? `` : ''}${data.profile.rankPicture ? data.profile.rankPicture : ''}`
              },
              description: ``,
              thumbnail: {
                url: `${!data.profile.avatar ? `` : ''}${data.profile.avatar ? data.profile.avatar : ''}`
              },
              fields: [{
                  name: `Nick`,
                  value: `${!data.profile.nick ? `n/a` : ''}${data.profile.nick ? data.profile.nick : ''}`,
                  inline: true
                },
                {
                  name: `Level`,
                  value: `${!data.profile.level ? `n/a` : ''}${data.profile.level ? data.profile.level : ''}`,
                  inline: true
                },
                {
                  name: `Rank`,
                  value: `${!data.profile.rank ? `n/a` : ''}${data.profile.rank ? data.profile.rank : ''}`,
                  inline: true
                },
                {
                  name: `Season`,
                  value: `S: ${!data.profile.season ? `n/a` : ''}${data.profile.season ? data.profile.season.id : ''}\nR: ${!data.profile.season ? `n/a` : ''}${data.profile.season ? data.profile.season.rank : ''}`,
                  inline: true
                },
                {
                  name: `Best Rank`,
                  value: `${!data.profile.ranking ? `n/a` : ''}${data.profile.ranking ? data.profile.ranking : ''}`,
                  inline: false
                }
              ]
            }
          }).catch(err => {
            handleErrorNoMsg(bot, __filename, err);
          });
        }).catch(err => {
          if (err.message && err.message.includes('PROFILE_NOT_FOUND')) return msg.channel.createMessage(`\\❌ Profile not found for **${username}**.\nMake sure you used the correct region \`[eu, us, kr, cn]\``)
            .catch(err => handleErrorNoMsg(bot, __filename, err));
          handleError(bot, __filename, msg.channel, err);
        });
    } else if (lower === 'comp' || lower === 'c' || lower === 'competitive') {
      owjs.getOverall(platform, region, user)
        .then(data => {
          msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              author: {
                name: `Competitive info for: ${username}`,
                url: `${!data.profile.url ? `` : ''}${data.profile.url ? data.profile.url : ''}`,
                icon_url: `${!data.profile.rankPicture ? `` : ''}${data.profile.rankPicture ? data.profile.rankPicture : ''}`
              },
              description: ``,
              thumbnail: {
                url: `${!data.profile.avatar ? `` : ''}${data.profile.avatar ? data.profile.avatar : ''}`
              },
              fields: [{
                  name: `Average`,
                  value: `**Eliminations:** ${!data.competitive.global.eliminations_average ? `n/a` : ''}${data.competitive.global.eliminations_average ? data.competitive.global.eliminations_average : ''}
**Damage done:** ${!data.competitive.global.damage_done_average ? `n/a` : ''}${data.competitive.global.damage_done_average ? data.competitive.global.damage_done_average : ''}
**Deaths:** ${!data.competitive.global.deaths_average ? `n/a` : ''}${data.competitive.global.deaths_average ? data.competitive.global.deaths_average : ''}
**Final blows:** ${!data.competitive.global.final_blows_average ? `n/a` : ''}${data.competitive.global.final_blows_average ? data.competitive.global.final_blows_average : ''}
**Objective kills:** ${!data.competitive.global.objective_kills_average ? `n/a` : ''}${data.competitive.global.objective_kills_average ? data.competitive.global.objective_kills_average : ''}
**Solo kills:** ${!data.competitive.global.solo_kills_average ? `n/a` : ''}${data.competitive.global.solo_kills_average ? data.competitive.global.solo_kills_average : ''}`,
                  inline: true
                },
                {
                  name: `Total`,
                  value: `**Solo kills:** ${!data.competitive.global.solo_kills ? `n/a` : ''}${data.competitive.global.solo_kills ? data.competitive.global.solo_kills : ''}
**Objective kills:** ${!data.competitive.global.objective_kills ? `n/a` : ''}${data.competitive.global.objective_kills ? data.competitive.global.objective_kills : ''}
**Final blows:** ${!data.competitive.global.final_blows ? `n/a` : ''}${data.competitive.global.final_blows ? data.competitive.global.final_blows : ''}
**Damage done:** ${!data.competitive.global.damage_done ? `n/a` : ''}${data.competitive.global.damage_done ? data.competitive.global.damage_done : ''}
**Eliminations:** ${!data.competitive.global.eliminations ? `n/a` : ''}${data.competitive.global.eliminations ? data.competitive.global.eliminations : ''}
**Deaths:** ${!data.competitive.global.deaths ? `n/a` : ''}${data.competitive.global.deaths ? data.competitive.global.deaths : ''}
**Games played:** ${!data.competitive.global.games_played ? `n/a` : ''}${data.competitive.global.games_played ? data.competitive.global.games_played : ''}
**Games won:** ${!data.competitive.global.games_won ? `n/a` : ''}${data.competitive.global.games_won ? data.competitive.global.games_won : ''}
**Games lost:** ${!data.competitive.global.games_lost ? `n/a` : ''}${data.competitive.global.games_lost ? data.competitive.global.games_lost: ''}`,
                  inline: true
                },
                {
                  name: `Most in game`,
                  value: `**Eliminations:** ${!data.competitive.global.eliminations_most_in_game ? `n/a` : ''}${data.competitive.global.eliminations_most_in_game ? data.competitive.global.eliminations_most_in_game : ''}
**Final blows:** ${!data.competitive.global.final_blows_most_in_game ? `n/a` : ''}${data.competitive.global.final_blows_most_in_game ? data.competitive.global.final_blows_most_in_game : ''}
**Damage done:** ${!data.competitive.global.damage_done_most_in_game ? `n/a` : ''}${data.competitive.global.damage_done_most_in_game ? data.competitive.global.damage_done_most_in_game : ''}
**Objective kills:** ${!data.competitive.global.objective_kills_most_in_game ? `n/a` : ''}${data.competitive.global.objective_kills_most_in_game ? data.competitive.global.objective_kills_most_in_game : ''}
**Solo kills:** ${!data.competitive.global.solo_kills_most_in_game ? `n/a` : ''}${data.competitive.global.solo_kills_most_in_game ? data.competitive.global.solo_kills_most_in_game : ''}`,
                  inline: true
                },
                {
                  name: `Medals`,
                  value: `**Total:** ${!data.competitive.global.medals ? `n/a` : ''}${data.competitive.global.medals ? data.competitive.global.medals : ''}
**Gold:** ${!data.competitive.global.medals_gold ? `n/a` : ''}${data.competitive.global.medals_gold ? data.competitive.global.medals_gold : ''}
**Silver:** ${!data.competitive.global.medals_silver ? `n/a` : ''}${data.competitive.global.medals_silver ? data.competitive.global.medals_silver : ''}
**Bronze:** ${!data.competitive.global.medals_bronze ? `n/a` : ''}${data.competitive.global.medals_bronze ? data.competitive.global.medals_bronze : ''}`,
                  inline: true
                }
              ]
            }
          }).catch(err => {
            handleErrorNoMsg(bot, __filename, err);
          });
        }).catch(err => {
          if (err.message && err.message.includes('PROFILE_NOT_FOUND')) return msg.channel.createMessage(`\\❌ Profile not found for **${username}**.\nMake sure you used the correct region \`[eu, us, kr, cn]\``)
            .catch(err => handleErrorNoMsg(bot, __filename, err));
          handleError(bot, __filename, msg.channel, err);
        });
    } else if (lower === 'quick' || lower === 'q' || lower === 'quickplay') {
      owjs.getOverall(platform, region, user)
        .then(data => {
          bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
              color: config.defaultColor,
              author: {
                name: `Info for: ${username}`,
                url: `${!data.profile.url ? `` : ''}${data.profile.url ? data.profile.url : ''}`,
                icon_url: `${!data.profile.rankPicture ? `` : ''}${data.profile.rankPicture ? data.profile.rankPicture : ''}`
              },
              description: ``,
              thumbnail: {
                url: `${!data.profile.avatar ? `` : ''}${data.profile.avatar ? data.profile.avatar : ''}`
              },
              fields: [{
                  name: `Average`,
                  value: `**Eliminations:** ${!data.quickplay.global.eliminations_average ? `n/a` : ''}${data.quickplay.global.eliminations_average ? data.quickplay.global.eliminations_average : ''}
**Damage done:** ${!data.quickplay.global.damage_done_average ? `n/a` : ''}${data.quickplay.global.damage_done_average ? data.quickplay.global.damage_done_average : ''}
**Deaths:** ${!data.quickplay.global.deaths_average ? `n/a` : ''}${data.quickplay.global.deaths_average ? data.quickplay.global.deaths_average : ''}
**Final blows:** ${!data.quickplay.global.final_blows_average ? `n/a` : ''}${data.quickplay.global.final_blows_average ? data.quickplay.global.final_blows_average : ''}
**Healing done:** ${!data.quickplay.global.healing_done_average ? `n/a` : ''}${data.quickplay.global.healing_done_average ? data.quickplay.global.healing_done_average : ''}
**Objective kills:** ${!data.quickplay.global.objective_kills_average ? `n/a` : ''}${data.quickplay.global.objective_kills_average ? data.quickplay.global.objective_kills_average : ''}
**Solo kills:** ${!data.quickplay.global.solo_kills_average ? `n/a` : ''}${data.quickplay.global.solo_kills_average ? data.quickplay.global.solo_kills_average : ''}`,
                  inline: true
                },
                {
                  name: `Total`,
                  value: `**Solo kills:** ${!data.quickplay.global.solo_kills ? `n/a` : ''}${data.quickplay.global.solo_kills ? data.quickplay.global.solo_kills : ''}
**Objective kills:** ${!data.quickplay.global.objective_kills ? `n/a` : ''}${data.quickplay.global.objective_kills ? data.quickplay.global.objective_kills : ''}
**Final blows:** ${!data.quickplay.global.final_blows ? `n/a` : ''}${data.quickplay.global.final_blows ? data.quickplay.global.final_blows : ''}
**Damage done:** ${!data.quickplay.global.damage_done ? `n/a` : ''}${data.quickplay.global.damage_done ? data.quickplay.global.damage_done : ''}
**Eliminations:** ${!data.quickplay.global.eliminations ? `n/a` : ''}${data.quickplay.global.eliminations ? data.quickplay.global.eliminations : ''}
**Healing done:** ${!data.quickplay.global.healing_done ? `n/a` : ''}${data.quickplay.global.healing_done ? data.quickplay.global.healing_done : ''}
**Deaths:** ${!data.quickplay.global.deaths ? `n/a` : ''}${data.quickplay.global.deaths ? data.quickplay.global.deaths : ''}
**Games won:** ${!data.quickplay.global.games_won ? `n/a` : ''}${data.quickplay.global.games_won ? data.quickplay.global.games_won : ''}`,
                  inline: true
                },
                {
                  name: `Most in game`,
                  value: `**Eliminations:** ${!data.quickplay.global.eliminations_most_in_game ? `n/a` : ''}${data.quickplay.global.eliminations_most_in_game ? data.quickplay.global.eliminations_most_in_game : ''}
**Final blows:** ${!data.quickplay.global.final_blows_most_in_game ? `n/a` : ''}${data.quickplay.global.final_blows_most_in_game ? data.quickplay.global.final_blows_most_in_game : ''}
**Damage done:** ${!data.quickplay.global.damage_done_most_in_game ? `n/a` : ''}${data.quickplay.global.damage_done_most_in_game ? data.quickplay.global.damage_done_most_in_game : ''}
**Healing done:** ${!data.quickplay.global.healing_done_most_in_game ? `n/a` : ''}${data.quickplay.global.healing_done_most_in_game ? data.quickplay.global.healing_done_most_in_game : ''}
**Defensive assists:** ${!data.quickplay.global.defensive_assists_most_in_game ? `n/a` : ''}${data.quickplay.global.defensive_assists_most_in_game ? data.quickplay.global.defensive_assists_most_in_game : ''}
**Offensive assists:** ${!data.quickplay.global.offensive_assists_most_in_game ? `n/a` : ''}${data.quickplay.global.offensive_assists_most_in_game ? data.quickplay.global.offensive_assists_most_in_game : ''}
**Objective kills:** ${!data.quickplay.global.objective_kills_most_in_game ? `n/a` : ''}${data.quickplay.global.objective_kills_most_in_game ? data.quickplay.global.objective_kills_most_in_game : ''}
**Solo kills:** ${!data.quickplay.global.solo_kills_most_in_game ? `n/a` : ''}${data.quickplay.global.solo_kills_most_in_game ? data.quickplay.global.solo_kills_most_in_game : ''}`,
                  inline: true
                },
                {
                  name: `Medals`,
                  value: `**Total:** ${!data.quickplay.global.medals ? `n/a` : ''}${data.quickplay.global.medals ? data.quickplay.global.medals : ''}
**Gold:** ${!data.quickplay.global.medals_gold ? `n/a` : ''}${data.quickplay.global.medals_gold ? data.quickplay.global.medals_gold : ''}
**Silver:** ${!data.quickplay.global.medals_silver ? `n/a` : ''}${data.quickplay.global.medals_silver ? data.quickplay.global.medals_silver : ''}
**Bronze:** ${!data.quickplay.global.medals_bronze ? `n/a` : ''}${data.quickplay.global.medals_bronze ? data.quickplay.global.medals_bronze : ''}`,
                  inline: true
                }
              ]
            }
          }).catch(err => {
            handleErrorNoMsg(bot, __filename, err);
          });
        }).catch(err => {
          if (err.message && err.message.includes('PROFILE_NOT_FOUND')) return msg.channel.createMessage(`\\❌ Profile not found for **${username}**.\nMake sure you used the correct region \`[eu, us, kr, cn]\``)
            .catch(err => handleErrorNoMsg(bot, __filename, err));
          handleError(bot, __filename, msg.channel, err);
        });
    }
  }
};