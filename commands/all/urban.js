const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  urban = require('relevant-urban');

module.exports = {
  desc: "Search for a definition on urban dictionary.",
  usage: "<word> (or nothing for random)",
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
    if (!args) return urban.random()
      .then(def => {
        let example = def.example;
        if (!example) example = 'None';
        let author = def.author;
        if (!author) author = 'None';
        let thumbsUp = def.thumbsUp;
        if (!thumbsUp) thumbsUp = '0';
        let thumbsDown = def.thumbsDown;
        if (!thumbsDown) thumbsDown = '0';
        msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              type: `rich`,
              author: {
                name: `${def.word}`,
                icon_url: ``
              },
              description: `${def.definition}`,
              url: `${def.urbanURL}`,
              thumbnail: {
                url: `https://b.catgirlsare.sexy/KAFl.jpg`
              },
              fields: [{
                  name: `Example:`,
                  value: `${example}`,
                  inline: true
                },
                {
                  name: `Author:`,
                  value: `${author}`,
                  inline: false
                },
                {
                  name: `ThumbsUp:`,
                  value: `\\👍 ${thumbsUp}`,
                  inline: true
                },
                {
                  name: `ThumbsDown`,
                  value: `\\👎 ${thumbsDown}`,
                  inline: true
                }
              ],
              footer: {
                icon_url: ``,
                text: `All information is provided by urban dictionary`
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
    urban.random(args)
      .then(def => {
        let example = def.example;
        if (!example) example = 'None';
        let author = def.author;
        if (!author) author = 'None';
        let thumbsUp = def.thumbsUp;
        if (!thumbsUp) thumbsUp = '0';
        let thumbsDown = def.thumbsDown;
        if (!thumbsDown) thumbsDown = '0';
        let tags = def.tags.join(', ');
        if (!tags) tags = 'None';
        msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              type: `rich`,
              author: {
                name: `${def.word}`,
                icon_url: ``
              },
              description: `${def.definition}`,
              url: `${def.urbanURL}`,
              thumbnail: {
                url: `https://b.catgirlsare.sexy/KAFl.jpg`
              },
              fields: [{
                  name: `Example:`,
                  value: `${example}`,
                  inline: true
                },
                {
                  name: `Author:`,
                  value: `${author}`,
                  inline: false
                },
                {
                  name: `ThumbsUp:`,
                  value: `\\👍 ${thumbsUp}`,
                  inline: true
                },
                {
                  name: `ThumbsDown`,
                  value: `\\👎 ${thumbsDown}`,
                  inline: true
                },
                {
                  name: `Tags:`,
                  value: `${tags}`,
                  inline: false
                }
              ],
              footer: {
                icon_url: ``,
                text: `All information is provided by urban dictionary`
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