const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    axios = require('axios'),
    findMember = require('../../utils/utils.js').findMember;

module.exports = {
    desc: "Slap someone.",
    usage: "<username/id/@mention>",
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
                handleError(err);
            });
        if (!args) return 'wrong usage';
        slapTimesUsed++
        const user = findMember(msg, args);
        if (!user) return bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.errorColor,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `That is not a valid guild member. Need to specify a name, ID or mention the user.`
            }
        }).catch(err => {
            handleError(err);
        });
        const base_url = "https://rra.ram.moe",
            type = "slap",
            path = "/i/r?type=" + type;
        axios.get(base_url + path)
            .then(res => {
                if (res.data.error) return handleMsgError(msg.channel, `ERROR: ${res.data.error}`);
                bot.createMessage(msg.channel.id, {
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        author: {
                            name: ``,
                            url: ``,
                            icon_url: ``
                        },
                        description: `${msg.author.username} slaps ${user.username}`,
                        image: {
                            url: base_url + res.data.path
                        },
                        footer: {
                            text: `using the ram.moe API`,
                            icon_url: ``
                        }
                    }
                }).catch(err => {
                    handleError(err);
                });
            })
            .catch(err => {
                handleError(err);
            });
    }
};