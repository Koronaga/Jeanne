const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  booru = require('../../custom_modules/booru'),
  banned = reload('../../banned_search_terms.json');

module.exports = {
  desc: "Send possibly nsfw image with the given tag(s) (Max 2 tags, seperate tags by space!\n(Use either s=safe, q=questionable or e=explicit for a tag to choose what you want) [nsfw]",
  usage: "<site> <tag1> [tag2] (Max 2 tags, tags must be seperated by space!).\nType: \"j:booru list\" for a list of sites the bot can get a picture from.",
  aliases: ['hentai'],
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
    var nsfw = settingsManager.getNSFW(msg.channel.guild.id, msg.channel.id);
    if (!nsfw) return msg.channel.createMessage('You can only use this command in an **nsfw** channels, use \`j:settings nsfw <allow/deny>\`.')
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    if (!args) return 'wrong usage'
    booruTimesUsed++
    var str = args + "";
    var array = str.split(' '),
      a = array[0],
      b = array[1],
      c = array[2];
    if (c !== undefined)
      var lower2 = c.toLowerCase();
    if (b !== undefined)
      var lower = b.toLowerCase();
    var bannedWord1 = banned.bannedWords[0];
    var bannedWord2 = banned.bannedWords[1];
    var bannedWord3 = banned.bannedWords[2];
    var bannedWord4 = banned.bannedWords[3];
    if ((array.length === 1) && (a !== 'list')) return 'wrong usage';
    if (a === 'list') {
      msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          author: {
            name: `${msg.author.username}`,
            icon_url: `${msg.author.avatarURL}`
          },
          description: `e621.net, aliases: ["e6","e621"]
e926.net, aliases: ["e9","e926"]
hypnohub.net, aliases: ["hh","hypo","hypohub"]
danbooru.donmai.us, aliases: ["db","dan","danbooru"]
konachan.com, aliases: ["kc","konac","kcom"]
konachan.net, aliases: ["kn","konan","knet"]
yande.re, aliases: ["yd","yand","yandere"]
gelbooru.com, aliases: ["gb","gel","gelbooru"]
rule34.xxx, aliases: ["r34","rule34"]
safebooru.org, aliases: ["sb","safe","safebooru"]
tbib.org, aliases: ["tb", "tbib","big"]
xbooru.com, aliases: ["xb","xbooru"]
youhate.us, aliases: ["yh","you","youhate"]
dollbooru.org, aliases: ["do","doll","dollbooru"]
rule34.paheal.net, aliases: ["pa","paheal"]`
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    } else {
      if (!c) {
        if (lower.includes(bannedWord1) || lower.includes(bannedWord2) || lower.includes(bannedWord3) || lower.includes(bannedWord4)) return msg.channel.createMessage({
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
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
        booru.search(`${a}`, [`${b}`], {
            limit: 1,
            random: true
          })
          .then(booru.commonfy)
          .then(images => {
            for (let image of images) {
              var tag = image.common.tags + "";
              if (tag.includes(banned.bannedWords[0]) || tag.includes(banned.bannedWords[1]) || tag.includes(banned.bannedWords[2]) || tag.includes(banned.bannedWords[3]) || tag.includes(banned.bannedWords[4]) || tag.includes(banned.bannedWords[5])) return msg.channel.createMessage({
                content: ``,
                embed: {
                  color: config.defaultColor,
                  author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                  },
                  description: `Sorry, it's against Discord's ToS to show you this images.`
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
              var tags = tag.split(',').join(', ');
              var img = image.common.file_url.toString(" ");
              var imguri = img.replace(/ /g, "%20");
              const embedName = `Click here for the direct image url`;
              // Check for description length
              const embedDesc = `Searched tags: ${b}, ${c}\n` +
                `Score: ${image.common.score}\n` +
                `Rating: ${image.common.rating}`;
              if (embedDesc.length > 2048) return msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    title: ``,
                    description: `⚠ The embed description has too many characters and couldn\'t be send, please try again.`
                  }
                })
                .catch(err => {
                  handleError(bot, __filename, msg.channel, err);
                });
              //Check image url length
              const embedUrl = `${imguri}`;
              if (embedUrl.length > 1024) return msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    title: ``,
                    description: `⚠ The image url has too many characters and couldn\'t be send, please try again.`
                  }
                })
                .catch(err => {
                  handleError(bot, __filename, msg.channel, err);
                });
              // Check for title length
              const embedTitle = `${embedName}${embedUrl}`;
              if (embedTitle.length > 1280) return msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    title: ``,
                    description: `⚠ The embed title has too many characters and couldn\'t be send, please try again.`
                  }
                })
                .catch(err => {
                  handleError(bot, __filename, msg.channel, err);
                });
              // Check for total embed characters
              const total = `${embedTitle}${embedDesc}${embedUrl}`;
              if (total.length > 6000) return msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    title: ``,
                    description: `⚠ The embed has too many characters and couldn\'t be send, please try again.`
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
                    name: embedName,
                    url: embedUrl
                  },
                  description: embedDesc,
                  image: {
                    url: embedUrl
                  }
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            }
          })
          .catch(err => {
            if (!err.name) {
              handleError(bot, __filename, msg.channel, err);
            } else if (err.name === 'booruError') {
              const error = `${err.name}\n${err.message}`;
              msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    description: `${error}`,
                    fields: [{
                      name: `For support join:`,
                      value: `https://discord.gg/Vf4ne5b`,
                      inline: true
                    }]
                  }
                })
                .catch(err => {
                  handleError(bot, __filename, msg.channel, err);
                });
            } else {
              handleError(bot, __filename, msg.channel, err);
            }
          });
      } else {
        if (lower2.includes(bannedWord1) || lower2.includes(bannedWord2) || lower2.includes(bannedWord3) || lower2.includes(bannedWord4)) return msg.channel.createMessage({
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
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
        booru.search(`${a}`, [`${b}`, `${c}`], {
            limit: 1,
            random: true
          })
          .then(booru.commonfy)
          .then(images => {
            for (let image of images) {
              var tag = image.common.tags + "";
              if (tag.includes(banned.bannedWords[0]) || tag.includes(banned.bannedWords[1]) || tag.includes(banned.bannedWords[2]) || tag.includes(banned.bannedWords[3]) || tag.includes(banned.bannedWords[4]) || tag.includes(banned.bannedWords[5])) return msg.channel.createMessage({
                content: ``,
                embed: {
                  color: config.defaultColor,
                  author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                  },
                  description: `Sorry, it's against Discord's ToS to show you this image.`
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
              var tags = tag.split(',').join(', ');
              var img = image.common.file_url.toString(" ");
              var imguri = img.replace(/ /g, "%20");
              const embedName = `Click here for the direct image url`;
              // Check for description length
              const embedDesc = `Searched tags: ${b}, ${c}\n` +
                `Score: ${image.common.score}\n` +
                `Rating: ${image.common.rating}`;
              if (embedDesc.length > 2048) return msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    title: ``,
                    description: `⚠ The embed description has too many characters and couldn\'t be send, please try again.`
                  }
                })
                .catch(err => {
                  handleError(bot, __filename, msg.channel, err);
                });
              //Check image url length
              const embedUrl = `${imguri}`;
              if (embedUrl.length > 1024) return msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    title: ``,
                    description: `⚠ The image url has too many characters and couldn\'t be send, please try again.`
                  }
                })
                .catch(err => {
                  handleError(bot, __filename, msg.channel, err);
                });
              // Check for title length
              const embedTitle = `${embedName}${embedUrl}`;
              if (embedTitle.length > 1280) return msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    title: ``,
                    description: `⚠ The embed title has too many characters and couldn\'t be send, please try again.`
                  }
                })
                .catch(err => {
                  handleError(bot, __filename, msg.channel, err);
                });
              // Check for total embed characters
              const total = `${embedTitle}${embedDesc}${embedUrl}`;
              if (total.length > 6000) return msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    title: ``,
                    description: `⚠ The embed has too many characters and couldn\'t be send, please try again.`
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
                    name: embedName,
                    url: embedUrl
                  },
                  description: embedDesc,
                  image: {
                    url: embedUrl
                  }
                }
              }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
              });
            }
          })
          .catch(err => {
            if (!err.name) {
              handleError(bot, __filename, msg.channel, err);
            } else if (err.name === 'booruError') {
              const error = `${err.name}\n${err.message}`;
              msg.channel.createMessage({
                  content: ``,
                  embed: {
                    color: config.errorColor,
                    description: `${error}`,
                    fields: [{
                      name: `For support join:`,
                      value: `https://discord.gg/Vf4ne5b`,
                      inline: true
                    }]
                  }
                })
                .catch(err => {
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