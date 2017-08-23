const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    superagent = require('superagent');

module.exports = {
    desc: "Check if you upvoted Jeanne d'Arc. (Test/example command)",
    cooldown: 5,
    guildOnly: true,
    task(bot, msg) {
        votecheckTimesUsed++
        superagent.get('https://discordbots.org/api/bots/237578660708745216/votes')
            .query({ onlyids: true })
            .set('Authorization', config.discordbotsorg)
            .then(res => {
                let users = res.text;
                const check = users.includes(msg.author.id);
                if (check === false) return msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: ``,
                                url: ``,
                                icon_url: ``
                            },
                            description: `Ohno it looks like you didn't upvote me \\😢\n` +
                                `Please go to: [discordbots.org/bot/jeanne](https://discordbots.org/bot/jeanne) and click on upvote.`
                        }
                    })
                    .catch(err => {
                        handleError(err);
                    });
                if (check === true) return msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: ``,
                                url: ``,
                                icon_url: ``
                            },
                            description: `Yaay it looks like you upvoted for me thank you so much!! \\💗`,
                            footer: {
                                text: 'https://discordbots.org/bot/jeanne'
                            }
                        }
                    })
                    .catch(err => {
                        handleError(err);
                    });
            })
            .catch(err => {
                handleMsgError(msg.channel, err);
            });
    }
};