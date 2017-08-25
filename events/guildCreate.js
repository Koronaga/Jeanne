var reload = require('require-reload'),
    config = reload('../config.json'),
    _Logger = reload('../utils/Logger.js'),
    bannedGuilds = reload('../banned_guilds.json'),
    handleError = require("../utils/utils.js").handleError,
    handleMsgError = require("../utils/utils.js").handleMsgError,
    utils = reload('../utils/utils.js'),
    formatTime = reload('../utils/utils.js').formatTime,
    version = reload('../package.json').version,
    Nf = new Intl.NumberFormat('en-US'),
    logger;
moment = require('../node_modules/moment');
const round = require('../utils/utils.js').round;

module.exports = (bot, _settingsManager, _config, guild) => {
    let defid = guild.defaultChannel ? guild.defaultChannel.id : null;
    const bots = bot.guilds.get(guild.id).members.filter(user => user.user.bot).length,
        total = bot.guilds.get(guild.id).memberCount,
        humans = total - bots,
        roles = guild.roles.map(c => c).length,
        createdOn = moment(guild.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss') + ' UTC ' + '(' + moment(guild.createdAt).fromNow() + ')',
        validate = `${createdOn === null ? `n/a` : ''}${createdOn !== null ? createdOn : ''}`,
        humanper = humans / total * 100,
        botper = bots / total * 100;

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
                utils.updateAbalBots(bot.user.id, config.abalBotsKey, bot.guilds.size);
        }
        if (config.discordbotsorg) { //Send servercount to discordbots.org
            if (bot.uptime !== 0)
                utils.updateDiscordBots(bot.user.id, config.discordbotsorg, bot.guilds.size, bot.shards.size);
        }
        bot.executeWebhook(config.join_leaveWebhookID, config.join_leaveWebhookToken, {
                embeds: [{
                    color: config.defaultColor,
                    title: `Joined guild:`,
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
                        {
                            name: `Emotes`,
                            value: `${guild.emojis.length}`,
                            inline: true
                        },
                        {
                            name: `Roles`,
                            value: `${roles}`,
                            inline: true
                        },
                        {
                            name: `Created on`,
                            value: `${validate}`,
                            inline: false
                        }
                    ]
                }],
                username: `${bot.user.username}`,
                avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
            })
            .catch(err => {
                handleError(bot, err);
            });
        if (!guild.defaultChannel) return;
        guild.defaultChannel.createMessage("Awesome a new server!\nType `j:help` for a commands list.\nYou could also view all my commands on https://cmds.jeannedarc.xyz")
            .catch(err => {
                handleError(bot, err);
            });
    }
}