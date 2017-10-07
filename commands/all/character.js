const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  AniListAPI = require('anilist-api-pt'),
  client_id = config.anilist_clientID,
  client_secret = config.anilist_clientSecret,
  anilistApi = new AniListAPI({
    client_id,
    client_secret
  });

module.exports = {
  desc: "Search a manga or anime character.",
  usage: "<character_name>",
  aliases: ['char'],
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
    anilistApi.auth()
      .then(ani => {
        ani.characters.searchCharacters(`${args}`)
          .then(res => {
            const char = res[0];
            if (!char) return msg.channel.createMessage('\\❌ No character found.')
              .catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            let info = char.info.replace(/&#039;/g, '\'');
            info = info.slice(0, 500);
            let readMore = "";
            if (char.info.length > 500) readMore = `Read the full info [\`here\`](https://anilist.co/character/${char.id})`;
            msg.channel.createMessage({
                content: ``,
                embed: {
                  color: config.defaultColor,
                  author: {
                    name: `${char.name_first} ${char.name_last}`,
                    url: `https://anilist.co/character/${char.id}`,
                    icon_url: ``
                  },
                  description: ``,
                  thumbnail: {
                    url: `${char.image_url_med}`
                  },
                  fields: [{
                      name: `Alternative Names`,
                      value: `Japanese: ${char.name_japanese}\n` +
                        `${char.name_alt === null ? `` : ''}${char.name_alt !== null ? char.name_alt : ''}`,
                      inline: false
                    },
                    {
                      name: `Info`,
                      value: `${info}\n\n${readMore}`,
                      inline: false
                    }
                  ],
                  footer: {
                    icon_url: `https://b.catgirlsare.sexy/wj6g.png`,
                    text: `All information is provided by AniList`
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
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};