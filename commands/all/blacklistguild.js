const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    fs = require('fs');

module.exports = {
    desc: "Easy way for me to ban guilds.",
    usage: "<guildID>",
    aliases: ['banguild', 'blg', 'blguild'],
    cooldown: 5,
    hidden: true,
    ownerOnly: true,
    task(bot, msg, suffix) {
        bot.leaveGuild(suffix).then(() => {
            var obj = JSON.parse(fs.readFileSync(`./banned_guilds.json`, 'utf8'));
            obj['bannedGuildIds'].push(suffix);
            fs.writeFile(`./banned_guilds.json`, JSON.stringify(obj), (err) => {
                if (err) return handleMsgError(msg.channel, err);
                bot.createMessage(msg.channel.id, {
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: ``,
                                url: ``,
                                icon_url: ``
                            },
                            description: `Guild added to the blacklist :black_heart:`
                        }
                    })
                    .catch(err => {
                        handleError(err);
                    });
            });
        }).catch(err => {
            handleMsgError(msg.channel, err);
        });
    }
};