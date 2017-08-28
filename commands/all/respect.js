const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    utils = reload('../../utils/utils.js'),
    fs = require('fs');

const RESPONSES = [
    ":heart:",
    ":yellow_heart:",
    ":green_heart:",
    ":blue_heart:",
    ":purple_heart:"
];

module.exports = {
    desc: "Pay your respect.",
    aliases: ['f'],
    cooldown: 2,
    guildOnly: true,
    task(bot, msg, suffix) {
        /**
         * perm checks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
         */
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
        if (sendMessages === false) return;
        if (embedLinks === false) return msg.channel.createMessage(`\\❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        respectTimesUsed++
        let choice = ~~(Math.random() * RESPONSES.length);
        if (!suffix) {
            let respect = JSON.parse(fs.readFileSync(`./db/respect.json`, 'utf8'));
            let count = respect["res"];
            count.total++;
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `**${msg.author.username}** has paid their respect ${RESPONSES[choice]}`,
                    fields: [{
                        name: `Total respects paid:`,
                        value: `${count.total}`,
                        inline: true
                    }]
                }
            }).then(() => {
                utils.safeSave('db/respect', '.json', JSON.stringify(respect));
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else {
            let respect = JSON.parse(fs.readFileSync(`./db/respect.json`, 'utf8'));
            let count = respect["res"];
            count.total++;
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `**${msg.author.username}** has paid their respect for **${suffix}** ${RESPONSES[choice]}`,
                    fields: [{
                        name: `Total respects paid:`,
                        value: `${count.total}`,
                        inline: true
                    }]
                }
            }).then(() => {
                utils.safeSave('db/respect', '.json', JSON.stringify(respect));
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        }
    }
};