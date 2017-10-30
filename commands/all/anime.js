const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  Anime = require('malapi').Anime;

module.exports = {
  desc: "Shows info about an anime.",
  usage: "<anime_name>",
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
    if (!args) return 'wrong usage';
    Anime.fromName(args)
      .then(anime => {
        var genre = anime.genres.toString();
        var genres = genre.split(/, ?/).join(', ');
        msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              type: `rich`,
              author: {
                name: `${anime.title}`,
                icon_url: ``
              },
              description: `${anime.synopsis.split("\r")[0]}`,
              url: `${anime.detailsLink}`,
              image: {
                url: `${anime.image}`
              },
              fields: [{
                  name: `Type`,
                  value: `${anime.type}`,
                  inline: true
                },
                {
                  name: `Episodes`,
                  value: `${anime.episodes}`,
                  inline: true
                },
                {
                  name: `Status`,
                  value: `${anime.status}`,
                  inline: true
                },
                {
                  name: `Score`,
                  value: `${anime.statistics.score.value}`,
                  inline: true
                },
                {
                  name: `Ranking`,
                  value: `${anime.statistics.ranking}`,
                  inline: true
                },
                {
                  name: `Favorites`,
                  value: `${anime.statistics.favorites}`,
                  inline: true
                },
                {
                  name: `Aired`,
                  value: `${anime.aired}`,
                  inline: false
                },
                {
                  name: `Genres`,
                  value: `${genres}`,
                  inline: false
                },
                {
                  name: `Alternative titles`,
                  value: `${anime.alternativeTitles.english}
${anime.alternativeTitles.japanese}`,
                  inline: false
                }
              ],
              footer: {
                icon_url: `https://b.catgirlsare.sexy/Jxmy.png`,
                text: `All information is provided by My Anime List`
              }
            }
          })
          .catch(err => {
            handleError(bot, __filename, msg.channel, err);
          });
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};