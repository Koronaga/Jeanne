var reload = require('require-reload')(require),
    config = reload('../../config.json'),
    error,
    logger,
    logger = new(reload('../../utils/Logger.js'))(config.logTimestamp);

const RESPONSES = [
    "would you like your eggs scrambled or fried?",
    "I am jelly ;-;",
    "Carpet.",
    "I hid the body 👍",
    "UNICORNS POOPED IN MY BED!",
    "whatever you do, don't turn off the light tonight!",
    "Do you have a pickle?",
    "Sorry, I'm to busy giving my unicorn a bath.",
    "Go to the bathroom and lock the door if u hear anything run!!",
    "I'm pregnant, I think you're the dad.",
    "I am so blue I'm greener than purple.",
    "I stepped on a Corn Flake, now I'm a Cereal Killer",
    "Llamas eat sexy paper clips",
    "Banana error.",
    "Everyday a grape licks a friendly cow",
    "On a scale from one to ten what is your favourite colour of the alphabet?",
    "The sparkly lamp ate a pillow then punched Larry.",
    "Look, a distraction!",
    "Screw world peace, I want a pony",
    "What do you think about the magical yellow unicorn who dances on the rainbow with a spoonful of blue cheese dressing?"
];
const COLORSDECIAML = [
    0x2B54CE,
    0xFF8000,
    0x9932CC,
    0x008080,
    0x800080,
    0x808080,
    0xEE82EE,
    0xFFB6C1,
    0x86B3E8,
    0x93FFAA,
    0x979E79
];

module.exports = {
    desc: "Sends a random line of text.",
    aliases: ['text', 'randomt', 'rt'],
    cooldown: 2,
    task(bot, msg) {
        /**
         * perm checks
         * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
         * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
         */
        const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
        const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
        if (embedLinks === false) return bot.createMessage(msg.channel.id, `❌ I'm missing the \`embedLinks\` permission, which is required for this command to work.`)
            .catch(err => {
                error = JSON.parse(err.response);
                if ((!error.code) && (!error.message)) return logger.error('\n' + err, 'ERROR')
                logger.error(error.code + '\n' + error.message, 'ERROR');
            });
        if (sendMessages === false) return;
        let choice = ~~(Math.random() * RESPONSES.length);
        let choose = ~~(Math.random() * COLORSDECIAML.length);
        var color = COLORSDECIAML[choose];
        bot.createMessage(msg.channel.id, {
            content: ``,
            embed: {
                color: color,
                author: {
                    name: ``,
                    url: ``,
                    icon_url: ``
                },
                description: `${RESPONSES[choice]}`
            }
        }).catch(err => {
            error = JSON.parse(err.response);
            if ((!error.code) && (!error.message)) return logger.error('\n' + err, 'ERROR')
            logger.error(error.code + '\n' + error.message, 'ERROR');
        });
    }
};