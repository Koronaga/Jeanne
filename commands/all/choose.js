const RESPONSES = [
    c => `I chose **${c}**`,
    c => `I pick ${c}`,
    c => `${c} is the best choice`,
    c => `${c} is my choice`,
    c => `${c} of course!`
];
const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError;

module.exports = {
    desc: "Makes a choice for you.",
    usage: "<choice> | <choice> [| choice...]",
    aliases: ['c', 'pick', 'decide', 'choice'],
    cooldown: 5,
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
        chooseTimesUsed++
        let choices = suffix.split(/ ?\| ?/);
        if (choices.length < 2 && suffix.includes(','))
            choices = suffix.split(/, ?/);
        choices = choices.filter(c => c !== ''); //Remove empty choices
        if (choices.length < 2)
            return 'wrong usage';

        let pick = ~~(Math.random() * choices.length);
        choices.forEach((c, i) => {
            if ((c.includes('homework') || c.includes('sleep') || c.includes('study') || c.includes('productiv')) && Math.random() < .3)
                return pick = i; //Higher chance to pick choices containing key words
        });
        bot.createMessage(msg.channel.id, RESPONSES[~~(Math.random() * RESPONSES.length)](choices[pick]))
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
    }
};