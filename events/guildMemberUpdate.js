module.exports = (bot, settingsManager, _config, guild, member, oldMember) => {
    if (member.user.bot === true) return;
    if (oldMember && member.nick !== oldMember.nick) {
        let nickEventChannel = settingsManager.getEventSetting(guild.id, 'nicknamechanged');
        if (nickEventChannel !== null) {
            if (member.nick !== null)
                bot.createMessage(nickEventChannel, `\`[${new Date().toLocaleString()}]\` **Nickname Change:** \`\`${member.user.username}\`\` is now nicknamed \`\`${member.nick}\`\``);
            else
                bot.createMessage(nickEventChannel, `\`[${new Date().toLocaleString()}]\` **Nickname Change:** \`\`${member.user.username}\`\` removed their nickname`);
        }
    }
}