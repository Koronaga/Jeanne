if (parseFloat(process.versions.node) < 6)
  throw new Error('Incompatible node version. Install Node 6 or higher.');

let reload = require('require-reload')(require);

const randomColor = require('random-color'),
  converter = require('hex2dec'),
  randomFloat = require('random-floating'),
  sentry = reload('./config.json').raven_dsn,
  Raven = require('raven');
Raven.config(sentry).install();

var fs = require('fs'),
  Eris = require('eris'),
  formatSeconds = require("./utils/utils.js").formatSeconds,
  handleErrorNoMsg = require("./utils/utils.js").handleErrorNoMsg,
  version = reload('./package.json').version,
  Nf = new Intl.NumberFormat('en-US'),
  round = require('./utils/utils.js').round,
  validateConfig = reload('./utils/validateConfig.js'),
  CommandManager = reload('./utils/CommandManager.js'),
  utils = reload('./utils/utils.js'),
  settingsManager = reload('./utils/settingsManager.js'),
  logger,
  games = reload('./special/games.json'),
  CommandManagers = [],
  events = {},
  bannedUsers = reload('./banned_users.json'),
  config = reload('./config.json');

USERAGENT = '';

commandsProcessed = 0;

gagTimesUsed = 0;
aboutTimesUsed = 0;
aestheticTimesUsed = 0;
animeTimesUsed = 0;
animelistTimesUsed = 0;
asciicatTimesUsed = 0;
assTimesUsed = 0;
avatarTimesUsed = 0;
banTimesUsed = 0;
boobsTimesUsed = 0;
booruTimesUsed = 0;
botTimesUsed = 0;
bullshitTimesUsed = 0;
catTimesUsed = 0;
catfactsTimesUsed = 0;
catgirlSFWTimesUsed = 0;
catgirlNSFWTimesUsed = 0;
changelogTimesUsed = 0;
channelinfoTimesUsed = 0;
characterTimesUsed = 0;
chooseTimesUsed = 0;
cleverbotTimesUsed = 0;
coinflipTimesUsed = 0;
colorTimesUsed = 0;
cmdusageTimesUsed = 0;
cryTimesUsed = 0;
cuddleTimesUsed = 0;
currencyTimesUsed = 0;
ddgsearchTimesUsed = 0;
destinyTimesUsed = 0;
discriminatorTimesUsed = 0;
emoteTimesUsed = 0;
facerecognitionTimesUsed = 0;
findinviteTimesUsed = 0;
funinsultTimesUsed = 0;
gifTimesUsed = 0;
googleTimesUsed = 0;
guildinfoTimesUsed = 0;
guildemotesTimesUsed = 0;
guildrolesTimesUsed = 0;
hackbanTimesUsed = 0;
hearthstoneTimesUsed = 0;
howtoTimesUsed = 0;
hugTimesUsed = 0;
ibsearchTimesUsed = 0;
imdbTimesUsed = 0;
insultTimesUsed = 0;
inviteTimesUsed = 0;
kickTimesUsed = 0;
killTimesUsed = 0;
kissTimesUsed = 0;
// kitsuTimesUsed = 0;
leagueTimesUsed = 0;
leaveTimesUsed = 0;
leetspeakTimesUsed = 0;
lennyTimesUsed = 0;
levelTimesUsed = 0;
lewdTimesUsed = 0;
lickTimesUsed = 0;
lmgtfyTimesUsed = 0;
lvlupmessageTimesUsed = 0;
mangaTimesUsed = 0;
mariomakerTimesUsed = 0;
morseTimesUsed = 0;
nomTimesUsed = 0;
notkawaiiTimesUsed = 0;
nyanTimesUsed = 0;
oldinsultTimesUsed = 0;
osuTimesUsed = 0;
overwatchTimesUsed = 0;
owoTimesUsed = 0;
patTimesUsed = 0;
permissionsTimesUsed = 0;
pinTimesUsed = 0;
pingTimesUsed = 0;
pokemonTimesUsed = 0;
pornTimesUsed = 0;
poutTimesUsed = 0;
pruneTimesUsed = 0;
punTimesUsed = 0;
pussyTimesUsed = 0;
radioJoinTimesUsed = 0;
radioLeaveTimesUsed = 0;
// radioNowplayingTimesUsed = 0;
raffleTimesUsed = 0;
rainbowsixsiegeTimesUsed = 0;
randomtextTimesUsed = 0;
rateTimesUsed = 0;
reactionTimesUsed = 0;
remindTimesUsed = 0;
respectTimesUsed = 0;
reverseTimesUsed = 0;
roleinfoTimesUsed = 0;
rollTimesUsed = 0;
rpsTimesUsed = 0;
sayTimesUsed = 0;
saydTimesUsed = 0;
settingsTimesUsed = 0;
sfwbooruTimesUsed = 0;
slapTimesUsed = 0;
smugTimesUsed = 0;
softbanTimesUsed = 0;
spinTimesUsed = 0;
stareTimesUsed = 0;
statsTimesUsed = 0;
steamTimesUsed = 0;
suggestTimesUsed = 0;
supportTimesUsed = 0;
throwTimesUsed = 0;
tickleTimesUsed = 0;
top5TimesUsed = 0;
translateTimesUsed = 0;
triggeredTimesUsed = 0;
twitchTimesUsed = 0;
unbanTimesUsed = 0;
unicodeTimesUsed = 0;
unpinTimesUsed = 0;
unsplashTimesUsed = 0;
uptimeTimesUsed = 0;
urbanTimesUsed = 0;
userinfoTimesUsed = 0;
votecheckTimesUsed = 0;
weatherTimesUsed = 0;
youtubeinfoTimesUsed = 0;
youtubesearchTimesUsed = 0;

validateConfig(config).catch(() => process.exit(0));
logger = new(reload('./utils/Logger.js'))(config.logTimestamp);

var bot = new Eris(config.token, {
  autoReconnect: true,
  disableEveryone: true,
  getAllUsers: true,
  messageLimit: 10,
  sequencerWait: 100,
  moreMentions: true,
  disableEvents: config.disableEvents,
  maxShards: config.shardCount,
  gatewayVersion: 6,
  cleanContent: true
});

function loadCommandSets() {
  return new Promise(resolve => {
    CommandManagers = [];
    for (let prefix in config.commandSets) { //Add command sets
      let color = config.commandSets[prefix].color;
      if (color && !logger.isValidColor(color)) {
        logger.warn(`Log color for ${prefix} invalid`);
        color = undefined;
      }
      CommandManagers.push(new CommandManager(config, prefix, config.commandSets[prefix].dir, color));
    }
    resolve();
  });
}

function initCommandManagers(index = 0) {
  return new Promise((resolve, reject) => {
    CommandManagers[index].initialize(bot, config, settingsManager) //Load CommandManager at {index}
      .then(() => {
        logger.debug(`Loaded CommandManager ${index}`, 'INIT');
        index++;
        if (CommandManagers.length > index) { //If there are more to load
          initCommandManagers(index) //Loop through again
            .then(resolve)
            .catch(reject);
        } else //If that was the last one resolve
          resolve();
      }).catch(reject);
  });
}

function loadEvents() { // Load all events in events/
  return new Promise((resolve, reject) => {
    fs.readdir(__dirname + '/events/', (err, files) => {
      if (err) reject(`Error reading events directory: ${err}`);
      else if (!files) reject('No files in directory events/');
      else {
        for (let name of files) {
          if (name.endsWith('.js')) {
            name = name.replace(/\.js$/, '');
            try {
              events[name] = reload(`./events/${name}.js`);
              initEvent(name);
            } catch (e) {
              logger.error(`${e}\n${e.stack}`, 'Error loading ' + name.replace(/\.js$/, ''));
            }
          }
        }
        resolve();
      }
    });
  });
}

function initEvent(name) { // Setup the event listener for each loaded event.
  if (name === 'messageCreate') {
    bot.on('messageCreate', msg => {
      if (msg.content.startsWith(config.reloadCommand) && config.adminIds.includes(msg.author.id)) //check for reload or eval command
        reloadModule(msg);
      else if (msg.content.startsWith(config.evalCommand) && config.adminIds.includes(msg.author.id))
        evaluate(msg);
      else
        events.messageCreate.handler(bot, msg, CommandManagers, config, settingsManager);
    });
  } else if (name === 'channelDelete') {
    bot.on('channelDelete', channel => {
      settingsManager.handleDeletedChannel(channel);
    });
  } else if (name === 'ready') {
    bot.on('ready', () => {
      events.ready(bot, config, games, utils);
    });
  } else {
    bot.on(name, function () { // MUST NOT BE ANNON/ARROW FUNCTION
      events[name](bot, settingsManager, config, ...arguments);
    });
  }
}

function miscEvents() {
  return new Promise(resolve => {
    if (bot.listeners('error').length === 0) {
      bot.on('error', (e, id) => {
        logger.error(`${e}\n${e.stack}`, `SHARD ${id} ERROR`);
      });
    }
    if (bot.listeners('shardReady').length === 0) {
      bot.on('shardReady', id => {
        logger.logBold(` SHARD ${id} CONNECTED`, 'green');
      });
    }
    if (bot.listeners('disconnected').length === 0) {
      bot.on('disconnected', () => {
        logger.logBold(' DISCONNECTED FROM DISCORD', 'red');
      });
    }
    if (bot.listeners('shardDisconnect').length === 0) {
      bot.on('shardDisconnect', (e, id) => {
        logger.error(e, `SHARD ${id} DISCONNECT`);
      });
    }
    if (bot.listeners('shardResume').length === 0) {
      bot.on('shardResume', id => {
        logger.logBold(` SHARD ${id} RESUMED`, 'green');
      });
    }
    if (bot.listeners('guildCreate').length === 0) {
      bot.on('guildCreate', guild => {
        logger.debug(guild.name, 'GUILD CREATE');
      });
    }
    if (bot.listeners('guildDelete').length === 0) {
      bot.on('guildDelete', (guild, unavailable) => {
        if (unavailable === false)
          logger.debug(guild.name, 'GUILD REMOVE');
      });
    }
    return resolve();
  });
}

function login() {
  logger.logBold(`Logging in...`, 'green');
  bot.connect().catch(error => {
    logger.error(error, 'LOGIN ERROR');
  });
}

//Load commands and log in
loadCommandSets()
  .then(initCommandManagers)
  .then(loadEvents)
  .then(miscEvents)
  .then(login)
  .catch(error => {
    logger.error(error, 'ERROR IN INIT');
  });

function reloadModule(msg) {
  logger.debug(`${msg.author.username}: ${msg.content}`, 'RELOAD MODULE');
  let arg = msg.content.substr(config.reloadCommand.length).trim();

  for (let i = 0; i < CommandManagers.length; i++) { //If arg starts with a prefix for a CommandManager reload/load the file.
    if (arg.startsWith(CommandManagers[i].prefix))
      return CommandManagers[i].reload(bot, msg.channel.id, arg.substr(CommandManagers[i].prefix.length), config, settingsManager);
  }

  if (arg === 'CommandManagers') {

    loadCommandSets()
      .then(initCommandManagers)
      .then(() => {
        msg.channel.createMessage('Reloaded CommandManagers');
      }).catch(error => {
        logger.error(error, 'ERROR IN INIT');
      });

  } else if (arg.startsWith('utils/')) {

    fs.access(`${__dirname}/${arg}.js`, fs.R_OK | fs.F_OK, err => {
      if (err)
        msg.channel.createMessage('That file does not exist!');
      else {
        switch (arg.replace(/(utils\/|\.js)/g, '')) {
          case 'CommandManager':
            CommandManager = reload('./utils/CommandManager.js');
            msg.channel.createMessage('Reloaded utils/CommandManager.js');
            break;
          case 'settingsManager':
            {
              let tempCommandList = settingsManager.commandList;
              settingsManager.destroy();
              settingsManager = reload('./utils/settingsManager.js');
              settingsManager.commandList = tempCommandList;
              msg.channel.createMessage('Reloaded utils/settingsManager.js');
              break;
            }
          case 'utils':
            utils = reload('./utils/utils.js');
            msg.channel.createMessage('Reloaded utils/utils.js');
            break;
          case 'validateConfig':
            validateConfig = reload('./utils/validateConfig.js');
            msg.channel.createMessage('Reloaded utils/validateConfig.js');
            break;
          case 'Logger':
            logger = new(reload('./utils/Logger.js'))(config.logTimestamp);
            msg.channel.createMessage('Reloaded utils/Logger.js');
            break;
          default:
            msg.channel.createMessage("Can't reload that because it isn't already loaded");
            break;
        }
      }
    });

  } else if (arg.startsWith('events/')) {

    arg = arg.substr(7);
    if (events.hasOwnProperty(arg)) {
      events[arg] = reload(`./events/${arg}.js`);
      msg.channel.createMessage(`Reloaded events/${arg}.js`);
    } else
      msg.channel.createMessage("That event isn't loaded");

  } else if (arg.startsWith('special/')) {

    switch (arg.substr(8)) {
      case 'cleverbot':
        events.messageCreate.reloadCleverbot(bot, msg.channel.id);
        break;
      case 'games':
        games = reload('./special/games.json');
        msg.channel.createMessage('Reloaded special/games.json');
        break;
      default:
        msg.channel.createMessage("Not found");
        break;
    }

  } else if (arg === 'config') {

    validateConfig = reload('./utils/validateConfig.js');
    config = reload('./config.json');
    validateConfig(config).catch(() => process.exit(0));
    msg.channel.createMessage("Reloaded config");
  }
}

function evaluate(msg) {
  logger.debug(`${msg.author.username}: ${msg.content}`, 'EVAL');
  let toEval = msg.content.substr(config.evalCommand.length).trim();
  let result = '~eval failed~';
  let lower = toEval.toLowerCase();
  if (lower.includes('bot.token')) return bot.createMessage(msg.channel.id, 'owo nothing to be found here.');
  try {
    result = eval(toEval);
  } catch (error) {
    logger.debug(error.message, 'EVAL FAILED');
    msg.channel.createMessage(`\`\`\`diff\n- ${error}\`\`\``); //Send error to chat also.
  }

  if (result !== '~eval failed~') {
    logger.debug(result, 'EVAL RESULT');
    msg.channel.createMessage(`__**Result:**__ \n${result}`);
  }
}

setInterval(() => { // Update the bot's status for each shard every 10 minutes
  if (games.length !== 0 && bot.uptime !== 0 && config.cycleGames === true) {
    bot.shards.forEach(shard => {
      let name = games[~~(Math.random() * games.length)];
      name = name.replace(/\$\{GUILDSIZE\}/gi, bot.guilds.size);
      name = name.replace(/\$\{USERSIZE\}/gi, bot.users.size);
      shard.editStatus(null, {
        name: name,
        type: 0
      });
    });
  }
}, 600000);

// Hope this isn't api abuse owo
// Default color 0x020003
/* Ehh might get in trouble for this owo
setInterval(() => {
    const randomNumOne = randomFloat({ min: 0.3, max: 0.99, fixed: 2 });
    const randomNumTwo = randomFloat({ min: 0.3, max: 0.99, fixed: 2 });
    let color = randomColor(randomNumOne, randomNumTwo);
    let hexColor = color.hexString();
    color = hexColor.replace("#", "0x");
    color = converter.hexToDec(`${color}`);

    const reason = hexColor;
    bot.editRole('229007062032580608', '347203487320244225', { color: color }, reason)
        .then(() => {
            console.log(`Updated role color to ${hexColor}!`);
        }).catch(err => {
            handleError(bot, err);
        });
}, 600000);
*/

// Process Events, so the bot doesn't crash when there is an unhandled error.
process.on('SIGINT', () => {
  bot.disconnect({
    reconnect: false
  });
  settingsManager.handleShutdown().then(() => process.exit(0));
  setTimeout(() => {
    process.exit(0);
  }, 5000);
});

process.on("uncaughtException", err => {
  handleErrorNoMsg(bot, __filename, err);
});

process.on("unhandledRejection", err => {
  handleErrorNoMsg(bot, __filename, err);
});

// Voice Connection Events
bot.on("voiceChannelLeave", (member, oldChannel) => {
  let vc = bot.voiceConnections.find((vc) => vc.id === oldChannel.guild.id);
  setTimeout(() => {
    /*
    After 5 seconds of a meber leaving,
    Check if the voice channel member size is 1, if the bot has a voice connection and if that last member is the bot.
    If all these are true, leave the voice connection because we don't want to play for nobody.
    */
    if ((oldChannel.voiceMembers.size === 1) && (vc) && (oldChannel.voiceMembers.has(bot.user.id))) {
      bot.leaveVoiceChannel(oldChannel.id);
      bot.voiceConnections.remove(vc);
    }
  }, 10000);
});

bot.on("voiceChannelSwitch", (member, newChannel, oldChannel) => {
  let vc = bot.voiceConnections.find((vc) => vc.id === oldChannel.guild.id);
  setTimeout(() => {
    /*
    After 5 seconds of a meber leaving,
    Check if the voice channel member size is 1, if the bot has a voice connection and if that last member is the bot.
    If all these are true, leave the voice connection because we don't want to play for nobody.
    */
    if ((oldChannel.voiceMembers.size === 1) && (vc) && (oldChannel.voiceMembers.has(bot.user.id))) {
      bot.leaveVoiceChannel(oldChannel.id);
      bot.voiceConnections.remove(vc);
    }
  }, 10000);
});