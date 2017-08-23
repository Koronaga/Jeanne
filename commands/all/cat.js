const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    request = require('request');

module.exports = {
    desc: "Sends random cat image from http://random.cat",
    usage: "",
    cooldown: 5,
    guildOnly: true,
    task(bot, msg) {
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
        catTimesUsed++
        request("http://random.cat/meow", (err, response, body) => {
            if (err) return handleMsgError(msg.channel, err);
            var cat = JSON.parse(body);
            if (!cat) return bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.errorColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `Ewps looks like I couldn't catch a cat for you, please try again.`,
                    fields: [{
                        name: `For support join:`,
                        value: `https://discord.gg/Vf4ne5b`,
                        inline: true
                    }]
                }
            }).catch(err => {
                handleError(err);
            });
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: `${msg.author.username} requested a cat ;3`,
                        url: `${cat.file}`,
                        icon_url: ``
                    },
                    description: `[Click here for the direct image link](${cat.file})`,
                    image: {
                        url: `${cat.file}`
                    }
                },
            }).catch(err => {
                handleError(err);
            });
        });
    }
};