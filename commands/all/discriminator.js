const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError;

module.exports = {
    desc: "Shows the first 5 users with the given discriminator.",
    usage: "<guild/global> | <discriminator>",
    aliases: ['discrim'],
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
                handleError(bot, __filename, msg.channel, err);
            });
        if (!args) return 'wrong usage';
        discriminatorTimesUsed++
        const str = args + "";
        let array = str.split(/ ?\| ?/),
            option = array[0],
            discrim = array[1];
        if (!discrim) return 'wrong usage';
        if (!option) return 'wrong usage';
        option = option.toLowerCase();
        const isNum = /^\d{4}$/.test(discrim);
        if (isNum === false) return 'wrong usage';
        if (option === 'guild') {
            let res = JSON.stringify((msg.channel.guild.members.filter(u => u.discriminator == discrim) || [{}]).map(u => u.username + '#' + u.discriminator));
            res = JSON.parse(res, 'utf8');
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `**Guild users with the discriminator:** \`${discrim}\`
${res[0] === undefined ? 'None' : ''}${res[0] !== undefined ? res[0] : ''}
${res[1] === undefined ? '' : ''}${res[1] !== undefined ? res[1] : ''}
${res[2] === undefined ? '' : ''}${res[2] !== undefined ? res[2] : ''}
${res[3] === undefined ? '' : ''}${res[3] !== undefined ? res[3] : ''}
${res[4] === undefined ? '' : ''}${res[4] !== undefined ? res[4] : ''}`
                }
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else if (option === 'global') {
            let res = JSON.stringify((bot.users.filter(u => u.discriminator == discrim) || [{}]).map(u => u.username + '#' + u.discriminator));
            res = JSON.parse(res, 'utf8');
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `**Global users with the discriminator:** \`${discrim}\`
${res[0] === undefined ? 'None' : ''}${res[0] !== undefined ? res[0] : ''}
${res[1] === undefined ? '' : ''}${res[1] !== undefined ? res[1] : ''}
${res[2] === undefined ? '' : ''}${res[2] !== undefined ? res[2] : ''}
${res[3] === undefined ? '' : ''}${res[3] !== undefined ? res[3] : ''}
${res[4] === undefined ? '' : ''}${res[4] !== undefined ? res[4] : ''}`
                }
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else {
            return 'wrong usage';
        }
    }
};