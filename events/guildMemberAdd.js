const personalGuildIDs = require('../config.json').personalGuildIDs;

module.exports = (bot, settingsManager, _config, guild, member) => {
  let welcomeMessage = settingsManager.getWelcome(guild, member);
  if (member.user.bot === true) return;
  if (welcomeMessage !== null) {
    if (welcomeMessage[0] === 'DM') {
      member.user.getDMChannel()
        .then((chan) => {
          chan.createMessage(welcomeMessage[1])
            .catch(() => { return; });
        });
    } else {
      bot.createMessage(welcomeMessage[0], welcomeMessage[1])
        .catch(() => { return; });
    }
  }

  let joinEventChannel = settingsManager.getEventSetting(guild.id, 'memberjoined');
  if (joinEventChannel !== null)
    bot.createMessage(joinEventChannel, `\`[${new Date().toLocaleString()}]\` **Member Joined:** ${member.user.username}`);

  // For personal guilds :)
  if (guild.id === personalGuildIDs[0]) {
    member.addRole('304266397947789322', 'New member')
      .catch(() => { return; });
  }
  if (guild.id === personalGuildIDs[1]) {
    member.addRole('311663620243324929', 'New member')
      .catch(() => { return; });
  }
};