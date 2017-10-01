module.exports = (bot, settingsManager, _config, user, oldUser) => {
    if (!user) return;
    if (user.bot === true) return;
    if (oldUser && user.username !== oldUser.username) {
        bot.guilds.forEach(guild => {
            if (guild.members.has(user.id)) {
                let nameEventChannel = settingsManager.getEventSetting(guild.id, 'namechanged');
                if (nameEventChannel !== null)
                    bot.createMessage(nameEventChannel, `\`[${new Date().toLocaleString()}]\` **Name Change:** \`\`${oldUser.username}#${oldUser.discriminator}\`\` is now \`\`${user.username}#${user.discriminator}\`\` **ID:** \`\`${user.id}\`\``);
            }
        });
    }
}