module.exports = (bot, settingsManager, _config, guild, user) => {
  let unbanEventChannel = settingsManager.getEventSetting(guild.id, 'userunbanned');
  if (unbanEventChannel !== null) {
    bot.createMessage(unbanEventChannel, {
      embed: {
        color: 0x42f442,
        author: {
          name: `${user.username}#${user.discriminator} (${user.id})`,
          icon_url: `${user.avatarURL}`
        },
        title: 'Type:',
        description: 'Unban',
        footer: {
          text: `${new Date().toLocaleString()}`
        }
      }
    }).catch(() => { return; });
  }
};