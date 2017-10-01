const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
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
                handleError(bot, __filename, msg.channel, err);
            });
        googleTimesUsed++
        google(args, (err, res) => {
            if (err) return handleError(bot, __filename, msg.channel, err);
            const data = res.links;
            if (!data[0]) return msg.channel.createMessage(`\\❌ No results for **${args}**`)
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
            let title2;
            let desc2;
            if (!data[1]) {
                title2 = 'n/a';
                desc2 = 'n/a';
            } else {
                title2 = data[1].title;
                desc2 = `${data[1].description}\n${data[1].link}`;
            }
            let title3;
            let desc3;
            if (!data[2]) {
                title3 = 'n/a';
                desc3 = 'n/a';
            } else {
                title3 = data[2].title;
                desc3 = `${data[2].description}\n${data[2].link}`;
            }
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
                                name: `${title2}`,
                                value: `${desc2}\n`,
                                inline: false
                            },
                            {
                                name: `${title3}`,
                                value: `${desc3}\n`,
                                inline: false
                            }
                        ]
                    }
                })
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
        });
    }
};