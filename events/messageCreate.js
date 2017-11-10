let reload = require('require-reload')(require);
let cleverbot = reload('../special/cleverbot.js');
let utils = reload('../utils/utils.js');
let points = reload('../db/points.json');
let message = reload('../db/message.json');
let updatePoints = false;
let updateMessage = false;
const fs = require('fs');

module.exports = {
  handler(bot, msg, CommandManagers, config, settingsManager) {
    if (!msg.author) return;
    if (msg.author.bot === true) return;

    const invCheck = new RegExp(/(https:\/\/)?discord\.gg\/(\w+\b)/gi);
    settingsManager.getDeleteInvitesGuild(msg.channel.guild.id)
      .then(() => {
        if (invCheck.test(msg.content)) {
          msg.delete()
            .then(() => {
              msg.channel.createMessage(`${msg.member.mention} Sending invites is not allwed in this server.`)
                .then((m) => {
                  setTimeout(() => {
                    m.delete()
                      .catch(() => { return; });
                  }, 2000);
                }).catch(() => {
                  msg.channel.createMessage('<:RedCross:373596012755025920> | Auto delete invite links is enabled but I can\'t delete messages. Please give me the required permissions!')
                    .catch(() => { return; });
                });
            });
        }
      }).catch(() => { return; });
      
    if (!msg.channel.guild) return bot.createMessage(msg.channel.id, 'Commands do not work in DMs.')
      .catch(() => { return; });
    for (let i = 0; i < CommandManagers.length; i++) {
      if ((msg.content.startsWith(CommandManagers[i].prefix)) && (!msg.channel.guild)) return msg.channel.createMessage('Commands can only be used in a server/guild.')
        .catch(() => { return; });
      if (msg.content.startsWith(CommandManagers[i].prefix))
        return CommandManagers[i].processCommand(bot, msg, config, settingsManager);
    }

    if (config.cleverbot && msg.channel.guild === undefined || (msg.mentions.length !== 0 && msg.content.search(new RegExp(`^<@!?${bot.user.id}>`)) === 0))
      cleverbot(bot, msg, config, settingsManager);

    if (!points[msg.author.id]) points[msg.author.id] = {
      points: 0,
      level: 0
    };
    let userData = points[msg.author.id];
    updatePoints = true;
    userData.points++;

    let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
    if (curLevel > userData.level) {
      // Level up!
      userData.level = curLevel;
      let message = JSON.parse(fs.readFileSync('./db/message.json', 'utf8'));
      if (config.nowelcomemessageGuild.includes(msg.channel.guild.id)) return;
      if ((!message[msg.channel.guild.id]) || (message[msg.channel.guild.id].type.includes('true'))) {
        bot.createMessage(msg.channel.id, `<@${msg.author.id}> You've leveled up to level **${curLevel}**!`)
          .catch(() => { return; });
      } else if (message[msg.channel.guild.id].type.includes('false')) {
        return;
      }
    }
  },
  reloadCleverbot(bot, channelId) {
    try {
      cleverbot = reload('../special/cleverbot.js');
      bot.createMessage(channelId, 'Reloaded special/cleverbot');
    } catch (error) {
      console.error(error);
      bot.createMessage(channelId, `Error reloading cleverbot: ${error}`);
    }
  }
};

// points/message shit
const interval = setInterval(() => {
  if (updatePoints === true) {
    utils.safeSave('db/points', '.json', JSON.stringify(points));
    updatePoints = false;
  }
  if (updateMessage === true) {
    utils.safeSave('db/message', '.json', JSON.stringify(message));
    updateMessage = false;
  }
}, 30000);

function handleShutdown() { // eslint-disable-line no-unused-vars
  return Promise.all([utils.safeSave('db/points', '.json', JSON.stringify(points)), utils.safeSave('db/message', '.json', JSON.stringify(message))]);
}

function destroy() { // eslint-disable-line no-unused-vars
  clearInterval(interval);
  if (updateCommand === true) // eslint-disable-line no-undef
    utils.safeSave('db/points', '.json', JSON.stringify(points));
  if (updateMessage === true)
    utils.safeSave('db/message', '.json', JSON.stringify(message));
}