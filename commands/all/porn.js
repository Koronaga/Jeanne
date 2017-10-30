const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  Pornsearch = require('../../custom_modules/pornsearch/index.js'),
  banned = reload('../../banned_search_terms.json'),
  getRandomInt = require('../../utils/utils.js').getRandomInt;

module.exports = {
  desc: "Search for gifs from pornhub.com and sex.com",
  usage: "<query> | [page_number]",
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, args, config, settingsManager) {
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
    const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
    if (!nsfw) return msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `You can only use this command in an **nsfw** channels, use \`j:settings nsfw <allow/deny>\`.`
        }
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    if (!args) return 'wrong usage';
    const str = args + "";
    const array = str.split(/ ?\| ?/),
      searchTerms = array[0],
      pageNumber = array[1];
    let bannedWordBool = false;
    banned.bannedWords.forEach(w => {
      if (searchTerms.includes(w)) bannedWordBool = true;
    });
    if (bannedWordBool === true) return msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: ``,
            url: ``,
            icon_url: ``
          },
          description: `Sorry it's against Discord's ToS to search for these tags.`
        }
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    const drivers = ['pornhub', 'sex'];
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const search = new Pornsearch(searchTerms, driver);
    search.gifs(pageNumber)
      .then(gifs => {
        const result = gifs[Math.floor(Math.random() * gifs.length)];
        if (!result) return msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.errorColor,
              title: `Error`,
              description: `No results were found with **${searchTerms}**`
            }
          })
          .catch(err => {
            handleError(bot, __filename, msg.channel, err);
          });
        msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              author: {
                name: `${result.title}`,
                url: `${result.url}`,
                icon_url: ``
              },
              description: `[Direct Image Url](${result.url})`,
              image: {
                url: `${result.url}`
              },
              footer: {
                text: `Gifs might not show if the size is too big, you can still click the link.`
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