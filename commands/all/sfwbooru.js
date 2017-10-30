const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  booru = require('sfwbooru');

module.exports = {
  desc: "Sends a sfw image from a booru site with the given tags. (Max 2 tags, seperate tags by space!",
  usage: "<site> <tag1> [tag2] (Max 2 tags, tags must be seperated by space!).\nType: \"j:sfwbooru list\" for a list of sites the bot can get a picture from.",
  aliases: ['sfw'],
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
    if (!args) return 'wrong usage';
    var str = args + "";
    var array = str.split(' '),
      a = array[0],
      b = array[1],
      c = array[2];
    const lower = a.toLowerCase();
    if (lower === 'list') {
      bot.createMessage(msg.channel.id, {
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: `${msg.author.username}`,
            icon_url: `${msg.author.avatarURL}`
          },
          description: `konachan.net, aliases: ["kn","konan","knet"]
safebooru.org, aliases: ["sb","safe","safebooru"]
dollbooru.org, aliases: ["do","doll","dollbooru"]`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    } else {
      if ((b) && (!c)) {
        booru.search(`${a}`, [`${b}`, `s`], {
            limit: 1,
            random: true
          })
          .then(booru.commonfy)
          .then(images => {
            for (let image of images) {
              var img = image.common.file_url.toString(" ");
              var imguri = img.replace(/ /g, "%20");
              bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                  color: config.defaultColor,
                  author: {
                    name: `Click here for the direct image url`,
                    url: `${imguri}`,
                    icon_url: `${msg.author.avatarURL}`
                  },
                  description: `Searched tags: ${b}
Score: ${image.common.score}
Rating: ${image.common.rating}`,
                  image: {
                    url: `${imguri}`
                  }
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            }
          })
          .catch(err => {
            if (err.name === 'booruError') {
              bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                  color: config.errorColor,
                  author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                  },
                  description: `${err.message}`,
                  fields: [{
                    name: `For support join:`,
                    value: `https://discord.gg/Vf4ne5b`,
                    inline: true
                  }]
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            } else {
              handleError(bot, __filename, msg.channel, err);
            }
          });
      } else if ((!b) && (!c)) {
        booru.search(`${a}`, [`s`], {
            limit: 1,
            random: true
          })
          .then(booru.commonfy)
          .then(images => {
            for (let image of images) {
              var img = image.common.file_url.toString(" ");
              var imguri = img.replace(/ /g, "%20");
              bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                  color: config.defaultColor,
                  author: {
                    name: `Click here for the direct image url`,
                    url: `${imguri}`,
                    icon_url: `${msg.author.avatarURL}`
                  },
                  description: `Score: ${image.common.score}
Rating: ${image.common.rating}`,
                  image: {
                    url: `${imguri}`
                  }
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            }
          })
          .catch(err => {
            if (err.name === 'booruError') {
              bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                  color: config.errorColor,
                  author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                  },
                  description: `${err.message}`,
                  fields: [{
                    name: `For support join:`,
                    value: `https://discord.gg/Vf4ne5b`,
                    inline: true
                  }]
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            } else {
              handleError(bot, __filename, msg.channel, err);
            }
          });
      } else {
        booru.search(`${a}`, [`${b}`, `${c}`, `s`], {
            limit: 1,
            random: true
          })
          .then(booru.commonfy)
          .then(images => {
            for (let image of images) {
              var img = image.common.file_url.toString(" ");
              var imguri = img.replace(/ /g, "%20");
              bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                  color: config.defaultColor,
                  author: {
                    name: `Click here for the direct image url`,
                    url: `${imguri}`,
                    icon_url: `${msg.author.avatarURL}`
                  },
                  description: `Searched tags: ${b}, ${c}
Score: ${image.common.score}
Rating: ${image.common.rating}`,
                  image: {
                    url: `${imguri}`
                  }
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            }
          })
          .catch(err => {
            if (err.name === 'booruError') {
              bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                  color: config.errorColor,
                  author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                  },
                  description: `${err.message}`,
                  fields: [{
                    name: `For support join:`,
                    value: `https://discord.gg/Vf4ne5b`,
                    inline: true
                  }]
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            } else {
              handleError(bot, __filename, msg.channel, err);
            }
          });
      }
    }
  }
};