const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    google = require('google');

module.exports = {
    desc: "Sends top 3 search results.",
    usage: "<search_query>",
    aliases: ['search'],
    cooldown: 10,
    guildOnly: true,
    task(bot, msg, args) {
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
                handleError(bot, err);
            });
        googleTimesUsed++
        google(args, (err, res) => {
            if (err) return handleMsgError(bot, msg.channel, err);
            const data = res.links;
            msg.channel.createMessage({
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        author: {
                            name: `Top 3 results:`,
                            url: `https://google.com`,
                            icon_url: `https://b.catgirlsare.sexy/rl2B.png`
                        },
                        description: ``,
                        thumbnail: {
                            url: ``
                        },
                        fields: [{
                                name: `${data[0].title}`,
                                value: `${data[0].description}\n` +
                                    `${data[0].link}\n`,
                                inline: false
                            },
                            {
                                name: `${data[1].title}`,
                                value: `${data[1].description}\n` +
                                    `${data[1].link}\n`,
                                inline: false
                            },
                            {
                                name: `${data[2].title}`,
                                value: `${data[2].description}\n` +
                                    `${data[2].link}\n`,
                                inline: false
                            }
                        ]
                    }
                })
                .catch(err => {
                    handleError(bot, err);
                });
        });
    }
};