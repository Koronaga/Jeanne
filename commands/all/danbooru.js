const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  handleErrorNoMsg = require('../../utils/utils.js').handleErrorNoMsg,
  bannedSearchTerms = require('../../banned_search_terms.json'),
  axios = require('axios');

module.exports = {
  desc: "Search for images from http://danbooru.donmai.us",
  usage: "<search_terms>",
  aliases: ['db', 'dan'],
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, args, _, settingsManager) {
    const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
    if (!nsfw) return msg.channel.createMessage('You can only use this command in an **nsfw** channel, use \`j:settings nsfw <allow/deny>\`.')
      .catch(err => handleErrorNoMsg(bot, __filename, err));
    /**
     * perm checks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
     */
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
    if (sendMessages === false) return;
    if (embedLinks === false) return msg.channel.createMessage(`\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
      .catch(err => handleErrorNoMsg(bot, __filename, err));
    let searchBoolean = false;
    bannedSearchTerms.bannedWords.forEach(w => {
      if (args.includes(w)) searchBoolean = true;
    });
    if (searchBoolean === true) return msg.channel.createMessage(`\\❌ It is against Discord's ToS to search for this.`)
      .catch(err => handleErrorNoMsg(bot, __filename, err));
    axios.get(`http://danbooru.donmai.us/posts.json?tags=${args}+order:random&limit=1`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': USERAGENT
      }
    }).then(res => {
      if (!res.data[0]) return msg.channel.createMessage(`\\❌ Nothing found using the tag(s): **${args}**`)
        .catch(err => handleErrorNoMsg(bot, __filename, err));
      let searchBoolean = false;
      bannedSearchTerms.bannedWords.forEach(w => {
        if (res.data[0].tag_string.includes(w)) searchBoolean = true;
      });
      if (searchBoolean === true) return msg.channel.createMessage(`\\❌ I can't show you this image, it is against Discord's ToS.`)
        .catch(err => handleErrorNoMsg(bot, __filename, err));
      const imageUrl = 'http://danbooru.donmai.us' + res.data[0].file_url;
      const post = `http://danbooru.donmai.us/posts/${res.data[0].id}`;
      msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          description: `[View post](${post})\n` +
            `[View image](${imageUrl})`,
          image: {
            url: imageUrl
          }
        }
      }).catch(err => handleErrorNoMsg(bot, __filename, err));
    }).catch(err => handleError(bot, __filename, msg.channel, err));
  }
};