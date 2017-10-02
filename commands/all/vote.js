const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError;

module.exports = {
  desc: "Start a vote.",
  usage: "<vote>",
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, args) {
    /* Check for author's nickname */
    let voteAuthor;
    if (msg.author.nickname) voteAuthor = msg.author.nickname;
    if (!msg.author.nickname) voteAuthor = msg.author.username;
    /* Check for author's avatarURL */
    let voteAuthorAvatar;
    if (msg.author.avatarURL) voteAuthorAvatar = msg.author.avatarURL;
    if (!msg.author.avatarURL) voteAuthorAvatar = msg.author.defaultAvatarURL;
    const voteTexts = [
      "owo what's this? A vote has started:",
      "Oh!" + voteAuthor + "has started a vote:",
      "Oh hey, look at this interesting vote:"
    ];
    const voteText = voteTexts[Math.floor(Math.random() * voteTexts.length)];
    msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          title: `${voteText}`, // <= random vote text
          description: `${args}`, // <= The vote
          footer: {
            text: `${voteAuthor}#${msg.author.discriminator}`, // <= The member's username that started the vote
            icon_url: `${voteAuthorAvatar}` // <= The member's avatar that started the vote
          }
        }
      })
      .then(sentMsg => {
        sentMsg.addReaction('check:314349398811475968') // check:314349398811475968
          .catch(err => {
            handleError(bot, __filename, msg.channel, err);
          });
        setTimeout(() => {
          sentMsg.addReaction('xmark:314349398824058880') // xmark:314349398824058880
            .catch(err => {
              handleError(bot, __filename, msg.channel, err);
            });
        }, 1000);
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};