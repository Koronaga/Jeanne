module.exports = (bot, settingsManager, _config, guild, member) => {
    let leaveEventChannel = settingsManager.getEventSetting(guild.id, 'memberleft');
    if (member.user.bot === true) return;
    if (leaveEventChannel !== null)
        bot.createMessage(leaveEventChannel, `\`[${new Date().toLocaleString()}]\` **Member Left:** ${member.user.username}`);
}