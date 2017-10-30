const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  handleErrorNoMsg = require('../../utils/utils.js').handleErrorNoMsg;

module.exports = {
  desc: "Control the bots shards.",
  usage: "[shard_id] [connect/disconnect] [auto_reconnect]",
  ownerOnly: true,
  hidden: true,
  task(bot, msg, args) {
    if (!args) {
      const message = bot.shards.map(shard => `Shard [${shard.id}]: (Status: ${shard.status}, Latency: ${shard.latency}, Guilds: ${bot.guilds.filter(g => g.shard.id === shard.id).length})`).join('\n');
      msg.channel.createMessage(`**Current shard [${msg.channel.guild.shard.id}]**\n` + '\`\`\`prolog\n' + message + '\`\`\`')
        .catch(err => handleErrorNoMsg(bot, __filename, err));
      return;
    }
    const array = args.split(/ /g),
      shard = array[0],
      func = array[1],
      bool = array[2];
    if (!shard) return msg.channel.createMessage(`Please define a shard.`)
      .catch(err => handleErrorNoMsg(bot, __filename, err));
    if (!func) return msg.channel.createMessage(`Please tell me what to do with shard **${shard}**.`)
      .catch(err => handleErrorNoMsg(bot, __filename, err));
    const find = bot.shards.find(s => s.id == shard);
    if (!find) return msg.channel.createMessage(`Shard **${shard}** does not exist.`)
      .catch(err => handleErrorNoMsg(bot, __filename, err));
    if (func === 'connect') {
      const s = bot.shards.find(s => s.id == shard);
      s.connect();
    } else if (func === 'disconnect') {
      if (!bool) return msg.channel.createMessage(`Please tell me if you want to auto reconnect.`)
        .catch(err => handleErrorNoMsg(bot, __filename, err));
      if (bool === 'true') {
        const s = bot.shards.find(s => s.id == shard);
        s.disconnect({
          reconnect: true
        });
      } else if (bool === 'false') {
        const s = bot.shards.find(s => s.id == shard);
        s.disconnect({
          reconnect: false
        });
      } else if (bool === 'auto') {
        const s = bot.shards.find(s => s.id == shard);
        s.disconnect({
          reconnect: 'auto'
        });
      }
    }
  }
};