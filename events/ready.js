var Nf = new Intl.NumberFormat('en-US'),
  reload = require('require-reload'),
  _Logger = reload('../utils/Logger.js'),
  logger,
  version = reload('../package.json').version,
  formatSeconds = require("../utils/utils.js").formatSeconds,
  handleErrorNoMsg = require("../utils/utils.js").handleErrorNoMsg;

module.exports = (bot, config, games, utils) => {
  if (logger === undefined)
    logger = new _Logger(config.logTimestamp);
  utils.checkForUpdates();
  bot.shards.forEach(shard => {
    let name = games[~~(Math.random() * games.length)];
    name = name.replace(/\$\{GUILDSIZE\}/gi, bot.guilds.size);
    name = name.replace(/\$\{USERSIZE\}/gi, bot.users.size);
    shard.editStatus(null, {
      name: name,
      type: 0
    });
  });
  logger.logWithHeader('READY', 'bgGreen', 'black', `S:${Nf.format(bot.guilds.size)} U:${Nf.format(bot.users.size)} AVG:${Nf.format((bot.users.size / bot.guilds.size).toFixed(2))}`);
  USERAGENT = `${bot.user.username}/${version} - (https://github.com/KurozeroPB/Jeanne)`;
  /* Updates stats message in the support guild once the client is ready 
  setInterval(() => {
      logger.logWithHeader('SUCCESS', 'bgGreen', 'black', 'Updated stats message');
      const version = reload('../package.json').version;
      const totalCommandUsage = commandsProcessed + cleverbotTimesUsed;
      const c = bot.getChannel('240154456577015808');
      const messageID = '326381968763650059';
      c.editMessage(messageID, {
              content: ``,
              embed: {
                  color: config.defaultColor,
                  type: 'rich',
                  author: {
                      name: `Jeanne d'Arc Live Statistics:`,
                      url: `https://jeannedarc.xyz/`,
                      icon_url: `${bot.user.avatarURL}`
                  },
                  thumbnail: {
                      url: `${bot.user.avatarURL}`
                  },
                  fields: [{
                          name: `Memory Usage:`,
                          value: `${Math.round(process.memoryUsage().rss / 1024 / 1000)}MB`,
                          inline: true
                      },
                      {
                          name: `Shards:`,
                          value: `Current: ${c.guild.shard.id}\nTotal: ${bot.shards.size}`,
                          inline: true
                      },
                      {
                          name: `Version:`,
                          value: `v${version}`,
                          inline: true
                      },
                      {
                          name: `Node Version:`,
                          value: `${process.version}`,
                          inline: true
                      },
                      {
                          name: `Uptime:`,
                          value: `${formatSeconds(process.uptime())}`,
                          inline: false
                      },
                      {
                          name: `Voice Connections:`,
                          value: `${bot.voiceConnections.size}`,
                          inline: false
                      },
                      {
                          name: `Guilds:`,
                          value: `${Nf.format(bot.guilds.size)}`,
                          inline: true
                      },
                      {
                          name: `Channels:`,
                          value: `${Nf.format(Object.keys(bot.channelGuildMap).length)}`,
                          inline: true
                      },
                      {
                          name: `Users:`,
                          value: `${Nf.format(bot.users.size)}`,
                          inline: true
                      },
                      {
                          name: `Average Users/Guild:`,
                          value: `${Nf.format((bot.users.size / bot.guilds.size).toFixed(2))}`,
                          inline: true
                      },
                      {
                          name: `Total | Commands | Cleverbot:`,
                          value: `${Nf.format(totalCommandUsage)} | ${Nf.format(commandsProcessed)} | ${Nf.format(cleverbotTimesUsed)}`,
                          inline: true
                      },
                      {
                          name: `Average:`,
                          value: `${(totalCommandUsage / (bot.uptime / (1000 * 60))).toFixed(2)}/min`,
                          inline: true
                      }
                  ]
              }
          })
          .catch(err => {
              handleErrorNoMsg(bot, __filename, err);
          });
  }, 20000);
  */
};