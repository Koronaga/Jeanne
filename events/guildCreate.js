let reload = require('require-reload');
let config = reload('../config.json');
let _Logger = reload('../utils/Logger.js');
let bannedGuilds = reload('../banned_guilds.json');
let logger;
const handleErrorNoMsg = require('../utils/utils.js').handleErrorNoMsg;
const updateAbalBots = require('../utils/utils.js').updateAbalBots;
const updateDiscordBots = require('../utils/utils.js').updateDiscordBots;
const round = require('../utils/utils.js').round;
moment = require('../node_modules/moment');

module.exports = (bot, _settingsManager, _config, guild) => {
  const bots = bot.guilds.get(guild.id).members.filter((user) => user.user.bot).length;
  const total = bot.guilds.get(guild.id).memberCount;
  const humans = total - bots;
  const roles = guild.roles.map((c) => c).length;
  const createdOn = moment(guild.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss') + ' UTC ' + '(' + moment(guild.createdAt).fromNow() + ')';
  const validate = `${createdOn ? createdOn : 'n/a'}`;
  const humanper = humans / total * 100;
  const botper = bots / total * 100;
  bannedGuilds = reload('../banned_guilds.json');
  if (logger === undefined) logger = new _Logger(_config.logTimestamp);
  logger.logWithHeader('JOINED GUILD', 'bgGreen', 'black', `${guild.name} (${guild.id}) owned by ${guild.members.get(guild.ownerID).user.username}#${guild.members.get(guild.ownerID).user.discriminator}`);
  if (bannedGuilds.bannedGuildIds.includes(guild.id)) {
    logger.logWithHeader('LEFT BANNED GUILD', 'bgRed', 'black', guild.name);
    guild.leave();
    return;
  } else if (botper >= 60) {
    logger.logWithHeader('LEFT BOT FARM', 'bgRed', 'black', `${guild.name}, Humans: ${humans}(${round(humanper, 2)}%), Bots: ${bots}(${round(botper, 2)}%)`);
    guild.leave();
    return;
  } else if (config.nowelcomemessageGuild.includes(guild.id)) {
    logger.logWithHeader('DIDNT SEND WELCOME MESSGAE', 'bgBlue', 'black', guild.name);
  } else {
    if (config.abalBotsKey) { //Send servercount to Abal's bot list
      if (bot.uptime !== 0)
        updateAbalBots(bot.user.id, config.abalBotsKey, bot.guilds.size);
    }
    if (config.discordbotsorg) { //Send servercount to discordbots.org
      if (bot.uptime !== 0)
        updateDiscordBots(bot.user.id, config.discordbotsorg, bot.guilds.size, bot.shards.size);
    }
    bot.executeWebhook(config.join_leaveWebhookID, config.join_leaveWebhookToken, {
      embeds: [{
        color: config.defaultColor,
        title: 'Joined guild:',
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
        {
          name: 'Emotes',
          value: `${guild.emojis.length}`,
          inline: true
        },
        {
          name: 'Roles',
          value: `${roles}`,
          inline: true
        },
        {
          name: 'Created on',
          value: `${validate}`,
          inline: false
        }
        ]
      }],
      username: `${bot.user.username}`,
      avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
    }).catch((err) => handleErrorNoMsg(bot, __filename, err));
  }
};