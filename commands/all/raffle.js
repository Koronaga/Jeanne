const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    moment = require('../../node_modules/moment');

module.exports = {
    desc: "Gets a random member from the guild this command is used in.",
    cooldown: 5,
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
                handleError(err);
            });
        raffleTimesUsed++
        const allMembers = msg.channel.guild.members;
        const onlyUsers = allMembers.filter(m => m.bot === false);
        const randomMember = onlyUsers[Math.floor(Math.random() * onlyUsers.length)];
        let avatarURL = randomMember.user.dynamicAvatarURL('', 2048);
        if (!avatarURL) avatarURL = randomMember.defaultAvatarURL;
        msg.channel.createMessage({
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    title: `The winner is:`,
                    description: `${randomMember.mention}\n[${randomMember.username}#${randomMember.discriminator} - (${randomMember.id})]\n\n` +
                        `**Congratulations** <:blobparty:346004141426081795>`,
                    thumbnail: {
                        url: `${avatarURL}`
                    },
                    footer: {
                        text: `Member since: ${moment(randomMember.joinedAt).utc().format('ddd MMM DD YYYY | kk:mm:ss')} UTC (${moment(randomMember.joinedAt).fromNow()})`
                    }
                }
            })
            .catch(err => {
                handleError(err);
            });
    }
};