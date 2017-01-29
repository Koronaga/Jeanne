const libVersion = require('../../node_modules/eris/package.json').version,
	botVersion = require('../../package.json').version;

module.exports = {
  desc: "Tells you about the bot.",
  aliases: ['info'],
  cooldown: 5,
  task(bot, msg) {
      bot.createMessage(msg.channel.id, { content: ``,
        embed: {
          color: 0xf4ce11,
          type: 'rich',
          author: {
            name: `Shinobu`,
            url: `https://shinobubot.xyz`,
            icon_url: `${bot.user.avatarURL}`
          },
          description: ``,
          thumbnail: {
            url: `${bot.user.avatarURL}`
          },
          fields: [
            {
              name: `Creator:`,
              value: `Kurozero#3420`,
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
              name: `Bot Version:`,
              value: `v${botVersion}`,
              inline: true
            },
            {
              name: `About Me:`,
              value: 'shinobu is a well made and simple to use discord bot. It will make your discord experience much more fun! shinobu is created with the MiraiBot framework *and framework only!*, and I got some help from AlexFlipnote (KawaiiBot creator) thank you very much for that! The help commands are: `s!help`',
              inline: false
            },
            {
              name: `Website:`,
              value: `https://shinobubot.xyz`,
              inline: true
            },
            {
              name: `Support Server`,
              value: `https://discord.gg/Vf4ne5b`,
              inline: true
            }
          ]
        }
      })
  }
};
