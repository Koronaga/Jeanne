const fs = require('fs');
var reload = require('require-reload')(require),
    config = reload('../../config.json'),
    error,
    logger,
    logger = new(reload('../../utils/Logger.js'))(config.logTimestamp);

module.exports = {
    desc: "Enable/disable the level up message.",
    usage: "<enable/disable>",
    aliases: ['lvlmsg', 'levelmsg', 'levelmessage'],
    cooldown: 5,
    guildOnly: true,
    requiredPermission: 'administrator',
    task(bot, msg, suffix) {
        /**
         * perm checks
         * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (embedLinks === false) return bot.createMessage(msg.channel.id, `❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
            .catch(err => {
                error = JSON.parse(err.response);
                if ((!error.code) && (!error.message)) return logger.error('\n' + err, 'ERROR')
                logger.error(error.code + '\n' + error.message, 'ERROR');
            });
        if (sendMessages === false) return;
        if (!suffix) return 'wrong usage';
        const lower = suffix.toLowerCase();
        let message = JSON.parse(fs.readFileSync(`./db/message.json`, 'utf8'));

        if (suffix === 'enable') {
            message[msg.channel.guild.id] = {
                type: "true"
            };
            fs.writeFile(`./db/message.json`, JSON.stringify(message), (err) => {
                if (err) console.error(err)
            });
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: 0xf4ce11,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `:white_check_mark: Level up message is now enabled!`
                },
            }).catch(err => {
                error = JSON.parse(err.response);
                if ((!error.code) && (!error.message)) return logger.error('\n' + err, 'ERROR')
                logger.error(error.code + '\n' + error.message, 'ERROR');
            });
        } else if (suffix === 'disable') {
            message[msg.channel.guild.id] = {
                type: "false"
            };
            fs.writeFile(`./db/message.json`, JSON.stringify(message), (err) => {
                if (err) console.error(err)
            });
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: 0xf4ce11,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `:white_check_mark: Level up message is now disabled!`
                },
            }).catch(err => {
                error = JSON.parse(err.response);
                if ((!error.code) && (!error.message)) return logger.error('\n' + err, 'ERROR')
                logger.error(error.code + '\n' + error.message, 'ERROR');
            });
        }
    }
};