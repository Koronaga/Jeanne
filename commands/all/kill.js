const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  findMember = require('../../utils/utils.js').findMember,
  randomItem = require('random-item');

module.exports = {
  desc: "Kill someone.",
  usage: "<username/ID/@username>",
  cooldown: 2,
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
    const user = findMember(msg, args);
    let ded = [
      `${msg.author.username} personally hogtied ${user.username} and threw him/her on the train tracks, baibai :wave:`,
      `${msg.author.username} dragged ${user.username} behind his/her horse.`,
      `${msg.author.username} shootes ${user.username} between the legs, wewlad that must hurt.`,
      `${msg.author.username} hogtied ${user.username} and threw you at the wolves.`,
      `${msg.author.username} got his/her bug net launcher gun and shot it at ${user.username}, wasn't very effective tho.`,
      `${msg.author.username} kicked ${user.username} of the roof.`,
      `${msg.author.username} hit ${user.username} with a pickup.`,
      `There's noway ${msg.author.username} can kill ${user.username} lol.`,
      `${msg.author.username} grabbed a flamethrower and burned everything around him including ${user.username}.`,
      `${msg.author.username} tried to kill ${user.username} but he/she killed him/herself lmao nugget.`,
      `${msg.author.username} used shadow clone jutsu and rasengan on ${user.username}.`,
      `${msg.author.username} killed ${user.username} with a massive fart.`,
      `${msg.author.username} ripped off his/her clothes and ${user.username} died from a massive nosebleed`,
      `Violence is never the solution.`,
      `${msg.author.username} grabbed his pocked knife, too bad ${user.username} had a gun.`
    ];
    const text = randomItem(ded);
    if (!args) return 'wrong usage';
    killTimesUsed++
    if (!user) return bot.createMessage(msg.channel.id, {
      content: ``,
      embed: {
        color: 0xff0000,
        author: {
          name: ``,
          url: ``,
          icon_url: ``
        },
        description: `That is not a valid guild member. Need to specify a name, ID or mention the user.`
      }
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err);
    });
    if (user.id === msg.author.id) return bot.createMessage(msg.channel.id, {
      content: ``,
      embed: {
        color: config.defaultColor,
        author: {
          name: ``,
          url: ``,
          icon_url: ``
        },
        description: `Oh boii lets not kill ourselves :heart:`
      }
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err);
    });
    if (user.id === bot.user.id) return bot.createMessage(msg.channel.id, {
      content: ``,
      embed: {
        color: config.defaultColor,
        author: {
          name: ``,
          url: ``,
          icon_url: ``
        },
        description: `Please don't kill me ;-;`
      }
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err);
    });
    if (user.id === '93973697643155456') return bot.createMessage(msg.channel.id, {
      content: ``,
      embed: {
        color: config.defaultColor,
        author: {
          name: ``,
          url: ``,
          icon_url: ``
        },
        description: `Nuuuu don't kill my masta please ;-;`
      }
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err);
    });
    bot.createMessage(msg.channel.id, {
      content: ``,
      embed: {
        color: config.defaultColor,
        author: {
          name: ``,
          url: ``,
          icon_url: ``
        },
        description: `${text}`
      }
    }).catch(err => {
      handleError(bot, __filename, msg.channel, err);
    });
  }
}