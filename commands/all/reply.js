const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Replay to a suggestion.",
    usage: "<channelid> | <message>",
    hidden: true,
    ownerOnly: true,
    task(bot, msg, args) {
        const str = args + "";
        const array = str.split(/ ?\| ?/),
            channelid = array[0],
            message = array[1];
        bot.createMessage(channelid, {
            content: ``,
            embed: {
                color: config.defaultColor,
                title: `Reply from owner:`,
                description: `${message}`
            },
        }).catch(err => {
            handleMsgError(bot, msg.channel, err);
        });
    }
};