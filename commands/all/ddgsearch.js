const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    ddg = require('ddg');

module.exports = {
    desc: "Gets top 4 results from duckduckgo.",
    usage: "<Text_to_search>",
    aliases: ['ddg'],
    cooldown: 5,
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
        if (!args) return 'wrong usage';
        ddgsearchTimesUsed++
        ddg.query(`${args}`, (err, data) => {
            if (err) return handleMsgError(bot, msg.channel, err);
            // Topic 1
            var topic1URL = '';
            var topic1Text = '';
            if (data.RelatedTopics[0] === undefined) {
                topic1URL = 'n/a';
                topic1Text = 'n/a';
            } else {
                topic1URL = data.RelatedTopics[0].FirstURL;
                topic1Text = data.RelatedTopics[0].Text;
            }
            // Topic 2
            var topic2URL = '';
            var topic2Text = '';
            if (data.RelatedTopics[1] === undefined) {
                topic2URL = 'n/a';
                topic2Text = 'n/a';
            } else {
                topic2URL = data.RelatedTopics[1].FirstURL;
                topic2Text = data.RelatedTopics[1].Text;
            }
            // Topic 3
            var topic3URL = '';
            var topic3Text = '';
            if (data.RelatedTopics[2] === undefined) {
                topic3URL = 'n/a';
                topic3Text = 'n/a';
            } else {
                topic3URL = data.RelatedTopics[2].FirstURL;
                topic3Text = data.RelatedTopics[2].Text;
            }
            // Topic 4
            var topic4URL = '';
            var topic4Text = '';
            if (data.RelatedTopics[3] === undefined) {
                topic4URL = 'n/a';
                topic4Text = 'n/a';
            } else {
                topic4URL = data.RelatedTopics[3].FirstURL;
                topic4Text = data.RelatedTopics[3].Text;
            }
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: `Top 4 results:`,
                        url: ``,
                        icon_url: ``
                    },
                    thumbnail: {
                        url: `https://b.catgirlsare.sexy/o1Ih.png`
                    },
                    description: ``,
                    fields: [{
                            name: `Topic 1`,
                            value: `${topic1URL}
${topic1Text}`,
                            inline: false
                        },
                        {
                            name: `Topic 2`,
                            value: `${topic2URL}
${topic2Text}`,
                            inline: false
                        },
                        {
                            name: `Topic 3`,
                            value: `${topic3URL}
${topic3Text}`,
                            inline: false
                        },
                        {
                            name: `Topic 4`,
                            value: `${topic4URL}
${topic4Text}`,
                            inline: false
                        }
                    ]
                }
            }).catch(err => {
                handleError(bot, err);
            });
        });
    }
};