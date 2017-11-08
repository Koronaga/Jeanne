moment = require('../../node_modules/moment');

module.exports = {
  desc: 'Shows info of the channel this command is used in. (only text channels for now)',
  aliases: ['ci', 'cinfo', 'channel'],
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, _, config) {
    const icon = msg.channel.guild.dynamicIconURL('png', 2048);
    msg.channel.createMessage({
      embed: {
        color: config.defaultColor,
        author: {
          name: `Channel info of ${msg.channel.name ? msg.channel.name : '?'}`,
        },
        description: `ID: ${msg.channel.id}`,
        thumbnail: {
          url: `${icon ? icon : ''}`
        },
        fields: [{
          name: 'Guild',
          value: `${msg.channel.guild.name ? msg.channel.guild.name : '-'}`,
          inline: true
        },
        {
          name: 'Name',
          value: `${msg.channel.mention ? msg.channel.mention : '-'}`,
          inline: true
        },
        {
          name: 'Position',
          value: `${msg.channel.position ? msg.channel.position : '-'}`,
          inline: true
        },
        {
          name: 'Topic',
          value: `${msg.channel.topic ? msg.channel.topic : '-'}`,
          inline: true
        },
        {
          name: 'Created On',
          value: `${moment(msg.channel.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} UTC (${moment(msg.channel.createdAt).fromNow()})`
        }]
      }
    }).catch((err) => this.catchMessage(err, msg));
  }
};