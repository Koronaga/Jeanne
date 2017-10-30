const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  handleErrorNoMsg = require('../../utils/utils.js').handleErrorNoMsg,
  Reddit = require("nraw");
const reddit = new Reddit(USERAGENT);

module.exports = {
  desc: "Search for a random post of a certain subreddit.",
  usage: "<subreddit>",
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, args, _, settingsManager) {
    reddit.subreddit(args).random().exec(data => {
      if (typeof data === 'object' && data[1]) {
        const posts = data[0].data.children;
        const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
        if (posts[0].data.over_18 === true && !nsfw) return msg.channel.createMessage('I did find a post but it was marked NSFW, go to a channel that allows NSFW\nor use \`j:settings nsfw <allow/deny>\` to enable NSFW here.')
          .catch(err => handleErrorNoMsg(bot, __filename, err));
        msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            title: `+${posts[0].data.score} ${posts[0].data.title}`,
            description: `[View image](${posts[0].data.url})\n[View post](https://www.reddit.com${posts[0].data.permalink})`,
            image: {
              url: `${posts[0].data.url}`
            }
          }
        }).catch(err => handleErrorNoMsg(bot, __filename, err));
      } else {
        const posts = data.data.children;
        const post = posts[Math.floor(Math.random() * posts.length)];
        const nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
        if (post.data.over_18 === true && !nsfw) return msg.channel.createMessage('I did find a post but it was marked NSFW, go to a channel that allows NSFW\nor use \`j:settings nsfw <allow/deny>\` to enable NSFW here.')
          .catch(err => handleErrorNoMsg(bot, __filename, err));
        msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            title: `+${post.data.score} ${post.data.title}`,
            description: `[View image](${post.data.url})\n[View post](https://www.reddit.com${post.data.permalink})`,
            image: {
              url: `${post.data.url}`
            }
          }
        }).catch(err => handleErrorNoMsg(bot, __filename, err));
      }
    });
  }
};