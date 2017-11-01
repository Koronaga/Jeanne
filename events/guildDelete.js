let reload = require('require-reload');
let config = reload('../config.json');
let _Logger = reload('../utils/Logger.js');
let bannedGuilds = reload('../banned_guilds.json');
let logger;
const updateAbalBots = require('../utils/utils.js').updateAbalBots;
const updateDiscordBots = require('../utils/utils.js').updateDiscordBots;
const handleErrorNoMsg = require('../utils/utils.js').handleErrorNoMsg;
const round = require('../utils/utils.js').round;
moment = require('../node_modules/moment');

module.exports = (bot, _settingsManager, _config, guild, unavailable) => {
  if (unavailable === true) return;
  const bots = guild.members.filter((u) => u.user.bot).length;
  const total = guild.memberCount;
  const humans = total - bots;
  const humanper = humans / total * 100;
  const botper = bots / total * 100;
  if (botper >= 60) return;
  if (bannedGuilds.bannedGuildIds.includes(guild.id)) return;
  if (logger === undefined) logger = new _Logger(_config.logTimestamp);
  logger.logWithHeader('LEFT GUILD', 'bgRed', 'black', `${guild.name} (${guild.id}) owned by ${guild.members.get(guild.ownerID).user.username}#${guild.members.get(guild.ownerID).user.discriminator}`);
  bot.executeWebhook(config.join_leaveWebhookID, config.join_leaveWebhookToken, {
    embeds: [{
      color: config.errorColor,
      title: 'Left guild:',
      description: `**__${guild.name} (${guild.id})__**`,
      thumbnail: {
        url: `${guild.iconURL ? guild.iconURL : ''}`
      },
      fields: [{
        name: 'Owner',
        value: `${guild.members.get(guild.ownerID).user.username}#${guild.members.get(guild.ownerID).user.discriminator}\n(${guild.ownerID})`,
        inline: true
      },
      {
        name: 'Total members',
        value: `${total}`,
        inline: true
      },
      {
        name: 'Humans',
        value: `${humans}, ${round(humanper, 2)}%`,
        inline: true
      },
      {
        name: 'Bots',
        value: `${bots}, ${round(botper, 2)}%`,
        inline: true
      },
      ]
    }],
    username: `${bot.user.username}`,
    avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
  }).then(() => {
    // Update server counts
    if (config.abalBotsKey) { //Send servercount to Abal's bot list
      if (bot.uptime !== 0) updateAbalBots(bot.user.id, config.abalBotsKey, bot.guilds.size);
    }
    if (config.discordbotsorg) { //Send servercount to discordbots.org
      if (bot.uptime !== 0) updateDiscordBots(bot.user.id, config.discordbotsorg, bot.guilds.size, bot.shards.size);
    }
  }).catch((err) => handleErrorNoMsg(bot, __filename, err));
};