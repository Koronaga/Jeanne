var fs = require('fs'),
  axios = require('axios'),
  reload = require('require-reload'),
  logger = new (reload('./Logger.js'))((reload('../config.json')).logTimestamp);
var config = reload('../config.json');

const WebSocket = require('ws');

/**
 * Contains various functions.
 * @module utils
 */

/**
 * Save a file safely, preventing it from being cleared.
 * @arg {String} dir Path from root folder including filename. (EX: db/servers)
 * @arg {String} ext File extension.
 * @arg {String} data Data to be written to the file.
 * @arg {Number} minSize=5 Will not save if less than this size in bytes.
 * @arg {Boolean} log=5 If it should log to the console.
 * @returns {Promise<Boolean|Error>} Will resolve with true if saved successfully.
 */

exports.safeSave = (file, ext, data, minSize = 5, log = true) => {
  return new Promise(async (resolve, reject) => {
    if (!file || !ext || !data)
      return reject(new Error('Invalid arguments'));
    if (file.startsWith('/')) file = file.substr(1);
    if (!ext.startsWith('.')) ext = '.' + ext;
    try {
      await fs.writeFileSync(`${__dirname}/../${file}-temp${ext}`, data);
    } catch (error) {
      logger.error(error, 'SAFE SAVE WRITE');
      reject(error);
    }
    try {
      let stats = await fs.statSync(`${__dirname}/../${file}-temp${ext}`);
      if (stats['size'] < minSize) {
        logger.debug('Prevented file from being overwritten', 'SAFE SAVE');
        resolve(false);
      } else {
        try {
          await fs.renameSync(`${__dirname}/../${file}-temp${ext}`, `${__dirname}/../${file}${ext}`);
          resolve(true);
          if (log === true) logger.debug(`Updated ${file}${ext}`, 'SAFE SAVE');
        } catch (error) {
          logger.error(error, 'SAFE SAVE RENAME');
          reject(error);
        }
      }
    } catch (error) {
      logger.error(error, 'SAFE SAVE STAT');
      reject(error);
    }
  });
};

exports.findMember = (msg, str) => {
  if (!str || str === '') return false;
  const guild = msg.channel.guild;
  if (!guild) return msg.mentions[0] ? msg.mentions[0] : false;
  if (/^\d{17,18}/.test(str) || /^<@!?\d{17,18}>/.test(str)) {
    const member = guild.members.get(/^<@!?\d{17,18}>/.test(str) ? str.replace(/<@!?/, '').replace('>', '') : str);
    return member ? member.user : false;
  } else if (str.length <= 33) {
    const isMemberName = (name, str) => name === str || name.startsWith(str) || name.includes(str);
    const member = guild.members.find((m) => {
      if (m.nick && isMemberName(m.nick.toLowerCase(), str.toLowerCase())) return true;
      return isMemberName(m.user.username.toLowerCase(), str.toLowerCase());
    });
    return member ? member.user : false;
  } else return false;
};

/**
 * Find a user matching the input string or return null if none found
 * @arg {String} query The input.
 * @arg {Eris.Guild} guild The guild to look on.
 * @arg {Boolean} [exact=false] Only look for an exact match.
 * @returns {?Eris.User} The found User.
 */
exports.findUserInGuild = (query, guild, exact = false) => {
  let found = null;
  if (query === undefined || guild === undefined)
    return found;
  query = query.toLowerCase();
  guild.members.forEach((m) => {
    if (m.user.username.toLowerCase() === query) found = m;
  });
  if (!found) guild.members.forEach((m) => {
    if (m.nick !== null && m.nick.toLowerCase() === query) found = m;
  });
  if (!found && exact === false) guild.members.forEach((m) => {
    if (m.user.username.toLowerCase().indexOf(query) === 0) found = m;
  });
  if (!found && exact === false) guild.members.forEach((m) => {
    if (m.nick !== null && m.nick.toLowerCase().indexOf(query) === 0) found = m;
  });
  if (!found && exact === false) guild.members.forEach((m) => {
    if (m.user.username.toLowerCase().includes(query)) found = m;
  });
  if (!found && exact === false) guild.members.forEach((m) => {
    if (m.nick !== null && m.nick.toLowerCase().includes(query)) found = m;
  });
  return found === null ? found : found.user;
};

/**
 * Update the server count on [Abalabahaha's bot list]@{link https://bots.discord.pw/}.
 * @arg {String} id Client id.
 * @arg {String} key Your API key.
 * @arg {Number} server_count Server count.
 */
exports.updateAbalBots = (id, key, server_count) => {
  if (!key || !server_count) return;
  axios.post(`https://bots.discord.pw/api/bots/${id}/stats`, {
    server_count
  }, {
      headers: {
        'Authorization': key,
        'User-Agent': USERAGENT
      }
    }).then((res) => {
      if (res.status !== 200) return logger.error(res.status || res.data, 'ABAL BOT LIST UPDATE ERROR');
      logger.debug('Updated bot server count to ' + server_count, 'ABAL BOT LIST UPDATE');
    }).catch((err) => logger.error(`${err}\n${JSON.stringify(err.response.data)}`, 'ABAL BOT LIST UPDATE ERROR'));
};

/**
 * Update the server count on [discordbots]@{link https://discordbots.org}.
 * @arg {String} key Your API key.
 * @arg {Number} server_count Server count.
 * @arg {Number} shard_id Shard id.
 * @arg {Number} shard_count Shard count.
 */
exports.updateDiscordBots = (id, key, server_count, shard_count) => {
  if (!key || !server_count) return;
  axios.post(`https://discordbots.org/api/bots/${id}/stats`, {
    server_count,
    shard_count
  }, {
      headers: {
        'Authorization': key,
        'User-Agent': USERAGENT
      }
    }).then((res) => {
      if (res.status !== 200) return logger.error(res.status || res.data, 'BOTS .ORG LIST UPDATE ERROR');
      logger.debug('Updated bot server count to ' + server_count, 'BOTS .ORG LIST UPDATE');
    }).catch((err) => logger.error(`${err}\n${JSON.stringify(err.response.data)}`, 'BOTS .ORG LIST UPDATE ERROR'));
};

/**
 * Set the bot's avatar from /avatars/.
 * @arg {Eris.Client} bot The client.
 * @arg {String} url The direct url to the image.
 * @returns {Promise}
 */
exports.setAvatar = (bot, url) => {
  return new Promise((resolve, reject) => {
    if (bot !== undefined && typeof url === 'string') {
      axios.get(url, {
        headers: {
          'User-Agent': USERAGENT
        },
        responseType: 'arraybuffer'
      }).then((res) => {
        if (res.status === 200) {
          bot.editSelf({
            avatar: `data:${res.headers['content-type']};base64,${res.data.toString('base64')}`
          }).then(resolve)
            .catch(reject);
        } else {
          reject('Got status code ' + res.status || res.data);
        }
      }).catch((err) => reject(err.response.data.status + ', ' + err.response.data.message));
    } else {
      reject('Invalid parameters');
    }
  });
};

/**
 * Converts to human readable form
 * @arg {Number} milliseconds Time to format in milliseconds.
 * @returns {String} The formatted time.
 */
exports.formatTime = (milliseconds) => {
  let daysText = 'days';
  let hoursText = 'hours';
  let minutesText = 'minutes';
  let secondsText = 'seconds';

  let s = milliseconds / 1000;
  let seconds = (s % 60).toFixed(0);
  s /= 60;
  let minutes = (s % 60).toFixed(0);
  s /= 60;
  let hours = (s % 24).toFixed(0);
  s /= 24;
  let days = s.toFixed(0);

  if (days === 1) daysText = 'day';
  if (hours === 1) hoursText = 'hour';
  if (minutes === 1) minutesText = 'minute';
  if (seconds === 1) secondsText = 'second';

  return `${days} ${daysText}, ${hours} ${hoursText}, ${minutes} ${minutesText}, and ${seconds} ${secondsText}`;
};

/**
 * Converts to human readable form
 * @arg {Number} milliseconds Time to format in milliseconds.
 * @returns {String} The formatted time.
 */
exports.formatTimeForSpotify = (milliseconds) => {
  let s = milliseconds / 1000;
  let seconds = (s % 60).toFixed(0);
  s /= 60;
  let minutes = (s % 60).toFixed(0);

  return `${minutes}:${seconds}`;
};

/**
 * Another way to convert to human readable form
 * @arg {Number} time Time to format in milliseconds.
 * @returns {String} The formatted time.
 */
exports.formatSeconds = (time) => {
  let days = Math.floor((time % 31536000) / 86400);
  let hours = Math.floor(((time % 31536000) % 86400) / 3600);
  let minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60);
  let seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60);
  days = days > 9 ? days : days;
  hours = hours > 9 ? hours : hours;
  minutes = minutes > 9 ? minutes : minutes;
  seconds = seconds > 9 ? seconds : seconds;
  return `${days} Days, ${hours} Hours, ${minutes} Minutes and ${seconds} Seconds`;
};
/**
 * Another way to convert to human readable form
 * @arg {Number} time Time to format in milliseconds.
 * @returns {String} The formatted time.
 */
exports.formatYTSeconds = (time) => {
  let hoursText = 'hours';
  let minutesText = 'minutes';
  let secondsText = 'seconds';

  let hours = Math.floor(((time % 31536000) % 86400) / 3600);
  let minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60);
  let seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60);
  hours = hours > 9 ? hours : hours;
  minutes = minutes > 9 ? minutes : minutes;
  seconds = seconds > 9 ? seconds : seconds;
  if (hours === 1) hoursText = 'hour';
  if (minutes === 1) minutesText = 'minute';
  if (seconds === 1) secondsText = 'second';

  return `${hours} ${hoursText}, ${minutes} ${minutesText} and ${seconds} ${secondsText}`;
};

/** Check for a newer version of Jeanne d'Arc */
exports.checkForUpdates = () => {
  let version = ~~(require('../package.json').version.split('.').join('')); //This is used to convert it to a number that can be compared
  axios.get('https://raw.githubusercontent.com/kurozeroPB/Jeanne/master/package.json')
    .then((res) => {
      if (res.status !== 200) {
        logger.warn(`Error checking for updates: ${res.data}`);
      } else {
        let latest = ~~(res.data.version.split('.').join(''));
        if (latest > version) logger.warn('A new version of Shinobu is avalible', 'OUT OF DATE');
      }
    }).catch((err) => logger.warn(`Error checking for updates:\n${err.response.data.status + ', ' + err.response.data.message}`));
};

/**
 * @param {number} value number that needs to be rounded
 * @param {number} precision number thing
 */
exports.round = (value, precision) => {
  let multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Get a random int
 * @param {number} min minimum number
 * @param {number} max maximum number
 */
exports.getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Handle an error with a message
 * @param {object} bot client object
 * @param {string} commandUsed file path of the command
 * @param {object} channel channel object
 * @param {object|string} error the error that was returned
 */
exports.handleError = (bot, commandUsed, channel, error) => {
  channel.createMessage({
    embed: {
      color: config.errorColor,
      description: `${error}\n\nFor support join: https://discord.gg/Vf4ne5b`
    }
  }).catch((e) => logger.error(e, 'ERROR'));
  bot.executeWebhook(config.errWebhookID, config.errWebhookToken, {
    embeds: [{
      color: config.errorColor,
      title: 'ERROR',
      description: `**${new Date().toLocaleString()}**\n\n**${commandUsed}**\n${error.stack}`,
    }],
    username: `${bot.user.username}`,
    avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`,

  }).catch((e) => logger.error(e, 'ERROR'));
  logger.error(error, 'ERROR');
};

/**
 * Handle an error with a message
 * @param {object} bot client object
 * @param {string} commandUsed file path of the command
 * @param {object|string} error the error that was returned
 */
exports.handleErrorNoMsg = (bot, commandUsed, error) => {
  bot.executeWebhook(config.errWebhookID, config.errWebhookToken, {
    embeds: [{
      color: config.errorColor,
      title: 'ERROR',
      description: `**${new Date().toLocaleString()}**\n\n**${commandUsed}**\n${error.stack}`,
    }],
    username: `${bot.user.username}`,
    avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
  }).catch((e) => logger.error(e, 'ERROR'));
  logger.error(error, 'ERROR');
};

exports.errorWebhook = (bot, error, type) => {
  if (type === 'WARN') {
    bot.executeWebhook(config.errWebhookID, config.errWebhookToken, {
      embeds: [{
        title: 'WARNING',
        color: config.warnColor,
        description: `**${new Date().toLocaleString()}**\n\n${error}`,
      }],
      username: `${bot.user.username}`,
      avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
    }).catch((e) => logger.error(e, 'ERROR'));
  } else if (type === 'ERROR') {
    bot.executeWebhook(config.errWebhookID, config.errWebhookToken, {
      embeds: [{
        title: 'ERROR',
        color: config.errorColor,
        description: `**${new Date().toLocaleString()}**\n\n${error.stack ? error.stack : error}`,
      }],
      username: `${bot.user.username}`,
      avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
    }).catch((e) => logger.error(e, 'ERROR'));
  }
};

exports.shardWebhook = (bot, shardID, type, error) => {
  if (!error) {
    if (type === 'ready') {
      bot.executeWebhook(config.shardWebhookID, config.shardWebhookToken, {
        embeds: [{
          title: 'Ready',
          color: config.defaultColor,
          description: `**${new Date().toLocaleString()}**\n\nShard [${shardID}] ready`,
        }],
        username: `${bot.user.username}`,
        avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
      });
    } else if (type === 'resume') {
      bot.executeWebhook(config.shardWebhookID, config.shardWebhookToken, {
        embeds: [{
          title: 'Resume',
          color: config.defaultColor,
          description: `**${new Date().toLocaleString()}**\n\nShard [${shardID}] resumed`,
        }],
        username: `${bot.user.username}`,
        avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
      });
    }
  } else {
    bot.executeWebhook(config.shardWebhookID, config.shardWebhookToken, {
      embeds: [{
        title: 'Disconnect',
        color: config.defaultColor,
        description: `**${new Date().toLocaleString()}**\n\nShard [${shardID}] disconnected\n${error}`,
      }],
      username: `${bot.user.username}`,
      avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
    });
  }
};

/**
 * Sort object properties (only own properties will be sorted).
 * @param {object} obj object to sort properties
 * @param {string|int} sortedBy 1 - sort object properties by specific value.
 * @param {bool} isNumericSort true - sort object properties as numeric value, false - sort as string value.
 * @param {bool} reverse false - reverse sorting.
 * @returns {Array} array of items in [[key,value],[key,value],...] format.
 */
exports.sortProperties = (obj, sortedBy, isNumericSort, reverse) => {
  sortedBy = sortedBy || 1; // by default first key
  isNumericSort = isNumericSort || false; // by default text sort
  reverse = reverse || false; // by default no reverse

  var reversed = (reverse) ? -1 : 1;

  var sortable = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      sortable.push([key, obj[key]]);
    }
  }
  if (isNumericSort)
    sortable.sort(function (a, b) {
      return reversed * (a[1][sortedBy] - b[1][sortedBy]);
    });
  else
    sortable.sort(function (a, b) {
      var x = a[1][sortedBy].toLowerCase(),
        y = b[1][sortedBy].toLowerCase();
      return x < y ? reversed * -1 : x > y ? reversed : 0;
    });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
};

exports.startMoeWS = () => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://listen.moe/api/v2/socket');
    ws.on('open', function open() {
      axios.post('https://listen.moe/api/authenticate', {
        username: config.listenmoe_username,
        password: config.listenmoe_password
      }, {
          headers: {
            'User-Agent': USERAGENT,
            'Accept': 'application/json',
          },
        }).then((res) => {
          if (res.data.success === false) return reject(res.data.message);
          const auth = JSON.stringify({
            'token': res.data.token
          });
          ws.send(auth);
        }).catch((err) => reject(err));
    });
    ws.on('message', function incoming(data) {
      if (!data) {
        reject(new Error('No data was returned'));
      } else {
        resolve(data);
      }
    });
    setTimeout(() => {
      ws.close();
    }, 5000);
  });
};