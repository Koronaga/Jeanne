module.exports = {
  desc: 'Gets info about your anime list using the following tags: watching, completed, onhold. (note: completed doesn\'t return all completed.)',
  usage: '<watching/completed/onhold>, <mal_username>',
  example: 'watching, SushiGod',
  aliases: ['mallist', 'alist'],
  cooldown: 10,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
    if (!args) return 'wrong usage';
    args = args.toString();
    let data = args.split(/ ?, ?/),
      type = data[0],
      username = data[1];
    const myAnimeList = require('myanimelist')({ username: `${username}` });
    if (!type) return 'wrong usage';
    type = type.toLowerCase();
    if (type === 'watching') {
      myAnimeList.getAnimeList(1, (err, resp) => {
        if (err) return this.catchError(bot, msg, __filename, err);
        const t = resp.map((title) => {
          return title.series_title;
        }).toString();
        const titles = t.split(',').join('\n');
        const s = resp.map((score) => {
          return score.my_score;
        }).toString();
        const scores = s.split(',').join('\n');
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: 'Currently Watching',
            fields: [{
              name: 'Titles:',
              value: `${titles ? titles : '-'}`,
              inline: true
            },
            {
              name: 'Score:',
              value: `${scores ? scores : '-'}`,
              inline: true
            }]
          }
        }).catch((err) => this.catchMessage(err, msg));
      });
    } else if (type === 'completed') {
      let myAnimeList = require('myanimelist')({ username: `${username}` });
      myAnimeList.getAnimeList(2, (err, resp) => {
        if (err) return this.catchError(bot, msg, __filename, err);
        const t = resp.map((title) => {
          return title.series_title;
        }).toString();
        const titles = t.split(',').join('\n');
        const s = resp.map((score) => {
          return score.my_score;
        }).toString();
        const scores = s.split(',').join('\n');
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: 'Completed:',
            fields: [{
              name: 'Titles',
              value: `${titles ? titles : '-'}`,
              inline: true
            },
            {
              name: 'Score:',
              value: `${scores ? scores : '-'}`,
              inline: true
            }]
          }
        }).catch((err) => this.catchMessage(err, msg));
      });
    } else if (type === 'onhold') {
      const myAnimeList = require('myanimelist')({ username: `${username}` });
      myAnimeList.getAnimeList(3, (err, resp) => {
        if (err) return this.catchError(bot, msg, __filename, err);
        const t = resp.map((title) => {
          return title.series_title;
        }).toString();
        const titles = t.split(',').join('\n');
        const s = resp.map((score) => {
          return score.my_score;
        }).toString();
        const scores = s.split(',').join('\n');
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: 'On Hold',
            fields: [{
              name: 'Titles:',
              value: `${titles ? titles : '-'}`,
              inline: true
            },
            {
              name: 'Score:',
              value: `${scores ? scores : '-'}`,
              inline: true
            }]
          }
        }).catch((err) => this.catchMessage(err, msg));
      });
    }
  }
};