const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  Kitsu = require('../../custom_modules/kitsu/index');

const kitsu = new Kitsu();

module.exports = {
  desc: "Shows info about an manga.",
  usage: "<manga_name>",
  cooldown: 10,
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
    kitsu.searchManga(args)
      .then(manga => {
        if (!manga[0]) return msg.channel.createMessage(`\\❌ No results found for **${args}**`)
          .catch(err => {
            handleError(bot, __filename, msg.channel, err);
          });
        let endDate = '?';
        if (manga[0].endDate) endDate = manga[0].endDate;
        let ageRating = 'n/a';
        if (manga[0].ageRating) ageRating = manga[0].ageRating;
        let ageRatingGuide = 'n/a';
        if (manga[0].ageRatingGuide) ageRatingGuide = manga[0].ageRatingGuide;
        let chapterCount = 'n/a';
        if (manga[0].chapterCount) chapterCount = manga[0].chapterCount;
        msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            title: `${manga[0].titles.english}`,
            description: `https://kitsu.io/manga/${manga[0].slug}\n\n${manga[0].synopsis}`,
            thumbnail: {
              url: `${manga[0].posterImage.original}`
            },
            fields: [{
                name: `Type`,
                value: `${manga[0].mangaType}`,
                inline: true
              },
              {
                name: `Rank`,
                value: `${manga[0].ratingRank}`,
                inline: true
              },
              {
                name: `Chapters`,
                value: `${chapterCount}`,
                inline: true
              },
              {
                name: `Volumes`,
                value: `${manga[0].volumeCount}`,
                inline: true
              },
              {
                name: `Readers`,
                value: `${manga[0].userCount}`,
                inline: true
              },
              {
                name: `Avg Rating`,
                value: `${manga[0].averageRating}%`,
                inline: true
              },
              {
                name: `Favorites`,
                value: `${manga[0].favoritesCount}`,
                inline: true
              },
              {
                name: `Popularity Rank`,
                value: `${manga[0].popularityRank}`,
                inline: true
              },
              {
                name: `Age Rating`,
                value: `${ageRating}`,
                inline: true
              },
              {
                name: `Age Rating Guide`,
                value: `${ageRatingGuide}`,
                inline: true
              },
              {
                name: `Alternative titles`,
                value: `Romaji: ${manga[0].titles.romaji}\nJapanese: ${manga[0].titles.japanese}`,
                inline: true
              },
              {
                name: `Start/end date`,
                value: `${manga[0].startDate} to ${endDate}`,
                inline: true
              }
            ],
            footer: {
              text: `All information is provided by kitsu.io`,
              icon_url: `https://b.catgirlsare.sexy/RNne.png`
            }
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};