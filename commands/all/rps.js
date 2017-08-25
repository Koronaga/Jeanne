const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

const RPS = [
    'rock',
    'paper',
    'scissors'
];

module.exports = {
    desc: "Play rps against Jeanne d'Arc",
    usage: "<rock/paper/scissors>",
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
        rpsTimesUsed++
        let choice = ~~(Math.random() * RPS.length),
            chosen = RPS[choice];
        let user = args.toLowerCase();
        if (args === chosen) {
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        icon_url: ``
                    },
                    description: `You: ${user}
Jeanne d'Arc: ${chosen}
Rip it's a tied game...`
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else if ((user === 'rock') && (chosen === 'scissors')) {
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        icon_url: ``
                    },
                    description: `You: rock
Jeanne d'Arc: scissors
Rock beats scissors, you win`
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else if ((user === 'rock') && (chosen === 'paper')) {
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        icon_url: ``
                    },
                    description: `You: rock
Jeanne d'Arc: paper
Paper beats rock, Jeanne d'Arc wins`
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else if ((user === 'paper') && (chosen === 'rock')) {
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        icon_url: ``
                    },
                    description: `You: paper
Jeanne d'Arc: rock
Paper beats rock, you win`
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else if ((user === 'paper') && (chosen === 'scissors')) {
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        icon_url: ``
                    },
                    description: `You: paper
Jeanne d'Arc: scissors
Scissors beats paper, Jeanne d'Arc wins`
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else if ((user === 'scissors') && (chosen === 'paper')) {
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        icon_url: ``
                    },
                    description: `You: scissors
Jeanne d'Arc: paper
Scissor beats paper, you win`
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else if ((user === 'scissors') && (chosen === 'rock')) {
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        icon_url: ``
                    },
                    description: `You: scissors
Jeanne d'Arc: rock
Rock beats scissors, Jeanne d'Arc wins`
                }
            }).catch(err => {
                handleError(bot, err);
            });
        }
    }
};