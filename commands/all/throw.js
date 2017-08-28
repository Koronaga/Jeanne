const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError;

const EMOTES = [
        ":trophy:",
        ":blue_car:",
        ":knife:",
        ":wrench:",
        ":tv:",
        ":poop:",
        ":basketball:",
        ":hammer:",
        ":paperclip:",
        ":scissors:",
        ":key:",
        ":syringe:"
    ],
    RECEIVED = [
        "You lil cunt",
        "Whyy!!",
        "Please don't do that again",
        "Go away...",
        "Not again >.>",
        "JESUS, why?",
        "common bruh",
        "fek yuu"
    ],
    GIVE = [
        "Hehe :stuck_out_tongue:",
        "Cus I can!",
        "Ohh I will hehe",
        "tchh ಠ_ಠ",
        "sowwy bby",
        ":yum:",
        "u wot",
        "Hm luv ya 2"
    ];

module.exports = {
    desc: "Throw a user.",
    usage: "<username | ID | @username>",
    cooldown: 2,
    guildOnly: true,
    task(bot, msg, suffix) {
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
        if (!suffix) return 'wrong usage';
        throwTimesUsed++
        let choice = ~~(Math.random() * EMOTES.length);
        var emotechoice = EMOTES[choice];
        let choice2 = ~~(Math.random() * RECEIVED.length);
        var receivedchoice = RECEIVED[choice2];
        var givechoice = GIVE[choice2];
        const user = this.findMember(msg, suffix);
        if (!user) return bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: 0xff0000,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `That is not a valid guild member. Need to specify a name, ID or mention the user.`
            }
        }).catch(err => {
            handleError(bot, __filename, msg.channel, err);
        });
        if (msg.author.id === user.id) return bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.defaultColor,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `waaat don't throw stuff at yourself dummy.`
            }
        }).catch(err => {
            handleError(bot, __filename, msg.channel, err);
        });
        if (user.id === bot.user.id) return bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.defaultColor,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `nonono we're not throwing stuff at me!`
            }
        }).catch(err => {
            handleError(bot, __filename, msg.channel, err);
        });
        if (user.id === "93973697643155456") return bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: config.defaultColor,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `NO! Don't hurt my master you meany ;-;`
            }
        }).catch(err => {
            handleError(bot, __filename, msg.channel, err);
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
                description: `**${msg.author.username}** threw ${emotechoice} at **${user.username}**

${user.username}: ${receivedchoice}
${msg.author.username}: ${givechoice}`
            }
        }).catch(err => {
            handleError(bot, __filename, msg.channel, err);
        });
    }
};