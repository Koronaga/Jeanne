const os = require('os-utils');
const utils = require('../../utils/utils.js');

module.exports = {
  desc: "",
  cooldown: 5,
  guildOnly: true,
  ownerOnly: true,
  hidden: true,
  task(bot, msg) {
    let cpuusage;
    os.cpuUsage(value => {
      cpuusage = value;
      return cpuusage;
    });
    let cpufree;
    os.cpuFree(value => {
      cpufree = value;
      return cpufree;
    });
    const platform = os.platform();
    const cpuCount = os.cpuCount();
    const freemem = os.freemem();
    const totalmem = os.totalmem();
    const freememPercentage = os.freememPercentage();
    const sysUptime = os.sysUptime();
    const processUptime = os.processUptime();
    const loadavg = os.loadavg(1);

    setTimeout(() => {
      msg.channel.createMessage(`\`\`\`prolog
               CPU Usage -> ${utils.round(cpuusage * 100, 2)} %
                CPU Free -> ${utils.round(cpufree * 100, 2)} %
                Platform -> ${platform}
               CPU Count -> ${cpuCount}
             Free Memory -> ${utils.round(freemem / 1000, 2)} GB
            Total Memory -> ${utils.round(totalmem / 1000, 2)} GB
  Free Memory Percentage -> ${utils.round(freememPercentage * 100, 2)} %
           System Uptime -> ${utils.formatSeconds(sysUptime)}
          Process Uptime -> ${utils.formatSeconds(processUptime)}
              Avg Load -> ${loadavg}
\`\`\``);
    }, 2000);
  }
};
