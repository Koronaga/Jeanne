const bannedSearchTerms = require('../../banned_search_terms.json');
const axios = require('axios');

module.exports = {
  desc: 'Search for images from http://danbooru.donmai.us',
  usage: '<search_terms>',
  example: 'yuri naked',
  aliases: ['db', 'dan'],
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  nsfw: true,
  task(bot, msg, args, config) {
    const search = args.split(/ /g).join('+');
    let searchBoolean = false;
    bannedSearchTerms.bannedWords.forEach((w) => {
      if (args.includes(w)) searchBoolean = true;
    });
    if (searchBoolean === true) return msg.channel.createMessage('<:RedCross:373596012755025920> | It is against Discord\'s ToS to search for this.')
      .catch((err) => this.catchMessage(err, msg));
    axios.get(`http://danbooru.donmai.us/posts.json?tags=${search}+order:random&limit=1`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': USERAGENT
      }
    }).then((res) => {
      if (!res.data[0]) return msg.channel.createMessage(`\\❌ Nothing found using the tag(s): **${args.split(/ /g).join(', ')}**`)
        .catch((err) => this.catchMessage(err, msg));
      let searchBoolean = false;
      bannedSearchTerms.bannedWords.forEach((w) => {
        if (res.data[0].tag_string.includes(w)) searchBoolean = true;
      });
      if (searchBoolean === true) return msg.channel.createMessage('<:RedCross:373596012755025920> | I can\'t show you this image, it is against Discord\'s ToS.')
        .catch((err) => this.catchMessage(err, msg));
      const imageUrl = 'http://danbooru.donmai.us' + res.data[0].file_url;
      const post = `http://danbooru.donmai.us/posts/${res.data[0].id}`;
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          description: `[View post](${post})\n` +
          `[View image](${imageUrl})`,
          image: {
            url: imageUrl
          }
        }
      }).catch((err) => this.catchMessage(err, msg));
    }).catch((err) => {
      if (err.includes('Request failed with status code 500')) return msg.channel.createMessage('<:RedCross:373596012755025920> | An error occurred on danbooru\'s side, please try again later.')
        .catch((err) => this.catchMessage(err, msg));
      this.catchError(bot, msg, __filename, err);
    });
  }
};