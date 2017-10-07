const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  Hearthstone = require('hearthstone-mashape')(`${config.hs_key}`, 'enUS');

module.exports = {
  desc: "Search hearthstone cards by name.",
  usage: "<card_name> | [gold] \` (Make sure to seperate card name and gold with a \`|\`",
  aliases: ['hs'],
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
    let str = args.toString();
    let array = str.split(/ ?\| ?/),
      card = array[0],
      option = array[1];
    let params = {
      name: `${card}`,
      collectible: 1
    };
    Hearthstone.card(params, (err, data) => {
      if (err) return handleError(bot, __filename, msg.channel, err);
      if (!data) return msg.channel.createMessage({
          content: ``,
          embed: {
            color: 0xff0000,
            author: {
              name: ``,
              url: ``,
              icon_url: ``
            },
            description: `Nothing found.`,
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
      if (!option) return msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `${msg.author.username}`,
              url: `${data[0] === undefined ? `` : ''}${data[0] !== undefined ? data[0].img : ''}`,
              icon_url: `${msg.author.avatarURL}`
            },
            description: `${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Name: `+data[0].name : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Card Set: `+data[0].cardSet : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Type: `+data[0].type : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Rarity: `+data[0].rarity : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Flavor: `+data[0].flavor : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Artist: `+data[0].artist : ''}
${data[0] === undefined ? `Make sure to use a card name.` : ''}${data[0] !== undefined ? `[Click here for the direct image url](`+data[0].img+`)` : ''}`,
            image: {
              url: `${data[0] === undefined ? `` : ''}${data[0] !== undefined ? data[0].img : ''}`
            }
          }
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      option = option.toLowerCase();
      if (option === 'gold') return msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `${msg.author.username}`,
              url: `${data[0] === undefined ? `` : ''}${data[0] !== undefined ? data[0].imgGold : ''}`,
              icon_url: `${msg.author.avatarURL}`
            },
            description: `${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Name: `+data[0].name : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Card Set: `+data[0].cardSet : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Type: `+data[0].type : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Rarity: `+data[0].rarity : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Flavor: `+data[0].flavor : ''}
${data[0] === undefined ? `` : ''}${data[0] !== undefined ? `Artist: `+data[0].artist : ''}
${data[0] === undefined ? `Make sure to use a card name.` : ''}${data[0] !== undefined ? `[Click here for the direct image url](`+data[0].imgGold+`)` : ''}`,
            image: {
              url: `${data[0] === undefined ? `` : ''}${data[0] !== undefined ? data[0].imgGold : ''}`
            }
          }
        })
        .catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      if ((option) && (option !== 'gold')) return 'wrong usage';
    });
  }
};