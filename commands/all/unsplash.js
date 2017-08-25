const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    superagent = require('superagent'),
    auth = {
        'Authorization': "Client-ID " + config.unsplash_key,
        'Content-Type': 'application/json'
    };

module.exports = {
    desc: "Get a beautiful picture from https://unsplash.com",
    cooldown: 60,
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
                handleError(bot, err);
            });
        unsplashTimesUsed++
        superagent.get('https://api.unsplash.com/photos/random')
            .set(auth)
            .end((err, res) => {
                if (err) return handleMsgError(bot, msg.channel, err);
                const data = res.body;
                let color = data.color.replace('#', '0x');
                color = parseInt(color);
                bot.createMessage(msg.channel.id, {
                    content: ``,
                    embed: {
                        color: color,
                        author: {
                            name: 'Photographer: ' + data.user.name,
                            url: data.user.links.html,
                            icon_url: data.user.profile_image.small
                        },
                        description: `[\`download image\`](${data.links.download})\n` +
                            `\\👍 Likes: ${data.likes}\n` +
                            `\\👀 Views: ${data.views}\n` +
                            `\\🌇 Location: ${data.location === undefined ? `n/a` : ''}${data.location !== undefined ? data.location.title : ''}`,
                        image: {
                            url: data.urls.regular
                        },
                        footer: {
                            text: `Image from https://unsplash.com`,
                            icon_url: `https://b.catgirlsare.sexy/7OSH.png`
                        }
                    }
                }).catch(err => {
                    handleError(bot, err);
                });
            });
    }
};