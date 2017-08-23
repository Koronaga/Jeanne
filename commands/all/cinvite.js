const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Create an invite with a channel id.",
    hidden: true,
    ownerOnly: true,
    task(bot, msg, args) {
        const channelid = `${args}`;
        bot.createChannelInvite(channelid, { temporary: false, unique: true })
            .then(inv => {
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            title: `${inv.guild} (${inv.channel})`,
                            description: `https://discord.gg/${inv.code}`
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