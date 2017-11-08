const Kitsu = require('kawaii-kitsune');
const kitsu = new Kitsu();

module.exports = {
  desc: 'Shows info about an anime.',
  usage: '<anime_name>',
  example: 'fate/apocrypha',
  cooldown: 10,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config, settingsManager) {
    if (!args) return 'wrong usage';
    kitsu.searchAnime(args)
      .then((res) => {
        const anime = res[0];
        const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
        if (anime.nsfw === true && !nsfw) return msg.channel.createMessage()
          .catch((err) => this.catchMessage(msg, err));
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: anime.titles.english ? anime.titles.english : anime.titles.romaji,
            url: anime.slug ? 'https://kitsu.io/anime/' + anime.slug : '',
            thumbnail: {
              url: anime.posterImage.original ? anime.posterImage.original : ''
            },
            description: anime.synopsis.replace(/<br\\?>/gi, '\n'),
            fields: [
              {
                name: 'Episodes',
                value: `${anime.episodeCount ? anime.episodeCount : '-'}`,
                inline: true
              },
              {
                name: 'Episode length',
                value: `${anime.episodeLength ? anime.episodeLength : '-'}`,
                inline: true
              },
              {
                name: 'Show type',
                value: anime.showType ? anime.showType : '-',
                inline: true
              },
              {
                name: 'Average rating',
                value: anime.averageRating ? anime.averageRating : '-',
                inline: true
              },
              {
                name: 'Rating rank',
                value: `${anime.ratingRank ? anime.ratingRank : '-'}`,
                inline: true
              },
              {
                name: 'Popularity rank',
                value: `${anime.popularityRank ? anime.popularityRank : '-'}`,
                inline: true
              },
              {
                name: 'Users',
                value: `${anime.userCount ? anime.userCount : '-'}`,
                inline: true
              },
              {
                name: 'Favorites',
                value: `${anime.favoritesCount ? anime.favoritesCount : '-'}`,
                inline: true
              },
              {
                name: 'Age rating',
                value: anime.ageRating ? anime.ageRating : '-',
                inline: true
              },
              {
                name: 'Age rating guide',
                value: anime.ageRatingGuide ? anime.ageRatingGuide : '-',
                inline: true
              },
              {
                name: 'Trailer',
                value: anime.youtubeVideoId ? 'https://youtube.com/watch?v=' + anime.youtubeVideoId : '-',
                inline: true
              },
              {
                name: 'Start/End',
                value: `${anime.startDate ? anime.startDate : '?'} until ${anime.endDate ? anime.endDate : '?'}`,
                inline: false
              }
            ]
          }
        }).catch((err) => this.catchMessage(err, msg));
      }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};