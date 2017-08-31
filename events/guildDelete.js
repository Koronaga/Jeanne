var reload = require('require-reload'),
    config = require('../config.json'),
    _Logger = reload('../utils/Logger.js'),
    bannedGuilds = reload('../banned_guilds.json'),
    utils = reload('../utils/utils.js'),
    updateAbalBots = require('../utils/utils.js').updateAbalBots,
    updateDiscordBots = require('../utils/utils.js').updateDiscordBots,
    handleErrorNoMsg = require("../utils/utils.js").handleErrorNoMsg,
    formatTime = reload('../utils/utils.js').formatTime,
    version = reload('../package.json').version,
    Nf = new Intl.NumberFormat('en-US'),
    logger;
moment = require('../node_modules/moment');
const round = require('../utils/utils.js').round;

module.exports = (bot, _settingsManager, _config, guild, unavailable) => {
    // Guild unavailable thing
    if (unavailable === true) return bot.createMessage('306837434275201025', {
        content: ``,
        embed: {
            color: config.errorColor,
            title: `Left guild:`,
            description: `Just some random guild bruh.`,
        }
    }).catch(err => {
        handleErrorNoMsg(bot, __filename, err);
    });
    const bots = guild.members.filter(u => u.user.bot).length,
        total = guild.memberCount,
        humans = total - bots,
        humanper = humans / total * 100,
        botper = bots / total * 100;
    if (botper >= 60) return;
    if (bannedGuilds.bannedGuildIds.includes(guild.id)) return;
    if (logger === undefined) logger = new _Logger(_config.logTimestamp);
    logger.logWithHeader('LEFT GUILD', 'bgRed', 'black', `${guild.name} (${guild.id}) owned by ${guild.members.get(guild.ownerID).user.username}#${guild.members.get(guild.ownerID).user.discriminator}`);
    bot.executeWebhook(config.join_leaveWebhookID, config.join_leaveWebhookToken, {
            embeds: [{
                color: config.errorColor,
                title: `Left guild:`,
                description: `**__${guild.name} (${guild.id})__**`,
                thumbnail: {
                    url: `${guild.iconURL === null ? `` : ''}${guild.iconURL !== null ? guild.iconURL : ''}`
                },
                fields: [{
                        name: `Owner`,
                        value: `${guild.members.get(guild.ownerID).user.username}#${guild.members.get(guild.ownerID).user.discriminator}\n(${guild.ownerID})`,
                        inline: true
                    },
                    {
                        name: `Total members`,
                        value: `${total}`,
                        inline: true
                    },
                    {
                        name: `Humans`,
                        value: `${humans}, ${round(humanper, 2)}%`,
                        inline: true
                    },
                    {
                        name: `Bots`,
                        value: `${bots}, ${round(botper, 2)}%`,
                        inline: true
                    },
                ]
            }],
            username: `${bot.user.username}`,
            avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
        })
        .then(() => {
            // Update server counts
            if (config.abalBotsKey) { //Send servercount to Abal's bot list
                if (bot.uptime !== 0) updateAbalBots(bot.user.id, config.abalBotsKey, bot.guilds.size);
            }
            if (config.discordbotsorg) { //Send servercount to discordbots.org
                if (bot.uptime !== 0) updateDiscordBots(bot.user.id, config.discordbotsorg, bot.guilds.size, bot.shards.size);
            }
        })
        .catch(err => {
            handleErrorNoMsg(bot, __filename, err);
        });
};