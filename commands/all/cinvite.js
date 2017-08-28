const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError;

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
                        handleError(bot, __filename, msg.channel, err);                     
                    });
            })
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);  
            });
    }
};