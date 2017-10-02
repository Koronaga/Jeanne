const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  libVersion = require('../../node_modules/eris/package.json').version,
  botVersion = require('../../package.json').version;

module.exports = {
  desc: "Tells you about the bot.",
  aliases: ['info'],
  cooldown: 5,
  guildOnly: true,
  task(bot, msg) {
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
    aboutTimesUsed++
    const prefix = Object.keys(config.commandSets);
    msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          type: 'rich',
          author: {
            name: `Jeanne d'Arc`,
            url: `http://jeannedarc.xyz/`,
            icon_url: `${bot.user.avatarURL}`
          },
          description: ``,
          thumbnail: {
            url: `${bot.user.avatarURL}`
          },
          fields: [{
              name: `Creator:`,
              value: `<@!93973697643155456>\n(${bot.users.get('93973697643155456').username}#${bot.users.get('93973697643155456').discriminator})`,
              inline: true
            },
            {
              name: `Library:`,
              value: `Eris v${libVersion}`,
              inline: true
            },
            {
              name: `Language:`,
              value: `NodeJS/JavaScript`,
              inline: true
            },
            {
              name: `Node Version:`,
              value: `${process.version}`,
              inline: true
            },
            {
              name: `Bot Version:`,
              value: `v${botVersion}`,
              inline: true
            },
            {
              name: `Prefix:`,
              value: `\`${prefix}\``,
              inline: true
            },
            {
              name: `About Me:`,
              value: 'Jeanne is a fast and simple to use discord bot. It will make your discord experience much more fun!\n' +
                'The help commands are:\n' +
                '`j:help` for a full commands list',
              inline: false
            },
            {
              name: `Website:`,
              value: `[\`Website\`](http://jeannedarc.xyz/)`,
              inline: true
            },
            {
              name: `Support Server:`,
              value: `[\`Support server\`](https://discord.gg/Vf4ne5b)`,
              inline: true
            }
          ]
        }
      })
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
  }
};