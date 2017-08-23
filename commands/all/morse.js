const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    morse = require('morse-node').create();

module.exports = {
    desc: "Encode or decode morse code",
    usage: "<encode/decode> | <text/morse code>",
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
        let str = args.split(/ ?\| ?/),
            type = str[0],
            value = str[1];
        if (!args) return 'wrong usage';
        if (!type) return 'wrong usage';
        if (!value) return 'wrong usage';
        morseTimesUsed++
        let lType = type.toLowerCase();
        if (lType === "encode") {
            try {
                let encoded = morse.encode(value);
                if (!encoded) return bot.createMessage(msg.channel.id, {
                    content: ``,
                    embed: {
                        color: config.errorColor,
                        author: {
                            name: ``,
                            url: ``,
                            icon_url: ``
                        },
                        description: `Ahh eh oops, something went wrong please try again.`,
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
                            name: ``,
                            url: ``,
                            icon_url: ``
                        },
                        description: `${encoded}`
                    }
                }).catch(err => {
                    handleError(err);
                });
            } catch (e) {
                handleMsgError(msg.channel, err);
            }
        } else if (lType === "decode") {
            try {
                let decoded = morse.decode(value);
                if (!decoded) return bot.createMessage(msg.channel.id, {
                    content: ``,
                    embed: {
                        color: config.errorColor,
                        author: {
                            name: ``,
                            url: ``,
                            icon_url: ``
                        },
                        description: `Ahh eh oops, something went wrong please try again.`,
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
                            name: ``,
                            url: ``,
                            icon_url: ``
                        },
                        description: `${decoded}`
                    }
                }).catch(err => {
                    handleError(err);
                });
            } catch (e) {
                handleMsgError(msg.channel, err);
            }
        }
    }
};