const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    sortProperties = require('../../utils/utils.js').sortProperties,
    fs = require('fs');

module.exports = {
    desc: "Top 5 global leaderboard",
    cooldown: 5,
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
        top5TimesUsed++
        let points = JSON.parse(fs.readFileSync(`./db/points.json`, 'utf8'));
        if (!points) {
            const err = 'points.json is empty!';
            return handleError(err);
        }
        const sorted = sortProperties(points, 'points', true, true);
        // Number 1
        const topOneID = sorted[0][0],
            userOne = bot.users.get(topOneID),
            topOneLevel = sorted[0][1].level,
            topOnePoints = sorted[0][1].points;
        let usernameOne;
        if (!userOne) usernameOne = 'User is unavailable';
        if (userOne) usernameOne = `${userOne.username}#${userOne.discriminator}`;
        // Number 2
        const topTwoID = sorted[1][0],
            userTwo = bot.users.get(topTwoID),
            topTwoLevel = sorted[1][1].level,
            topTwoPoints = sorted[1][1].points;
        let usernameTwo;
        if (!userTwo) usernameTwo = 'User is unavailable';
        if (userTwo) usernameTwo = `${userTwo.username}#${userTwo.discriminator}`;
        // Number 3
        const topThreeID = sorted[2][0],
            userThree = bot.users.get(topThreeID),
            topThreeLevel = sorted[2][1].level,
            topThreePoints = sorted[2][1].points;
        let usernameThree;
        if (!userThree) usernameThree = 'User is unavailable';
        if (userThree) usernameThree = `${userThree.username}#${userThree.discriminator}`;
        // Number 4
        const topFourID = sorted[3][0],
            userFour = bot.users.get(topFourID),
            topFourLevel = sorted[3][1].level,
            topFourPoints = sorted[3][1].points;
        let usernameFour;
        if (!userFour) usernameFour = 'User is unavailable';
        if (userFour) usernameFour = `${userFour.username}#${userFour.discriminator}`;
        // Number 5
        const topFiveID = sorted[4][0],
            userFive = bot.users.get(topFiveID),
            topFiveLevel = sorted[4][1].level,
            topFivePoints = sorted[4][1].points;
        let usernameFive;
        if (!userFive) usernameFive = 'User is unavailable';
        if (userFive) usernameFive = `${userFive.username}#${userFive.discriminator}`;
        msg.channel.createMessage({
            content: ``,
            embed: {
                color: config.defaultColor,
                title: `Top 5 global`,
                thumbnail: {
                    url: bot.user.dynamicAvatarURL('png', 2048)
                },
                fields: [{
                        name: `${usernameOne}`,
                        value: `Level: ${topOneLevel}\nPoints ${topOnePoints}`,
                        inline: false
                    },
                    {
                        name: `${usernameTwo}`,
                        value: `Level: ${topTwoLevel}\nPoints ${topTwoPoints}`,
                        inline: false
                    },
                    {
                        name: `${usernameThree}`,
                        value: `Level: ${topThreeLevel}\nPoints ${topThreePoints}`,
                        inline: false
                    },
                    {
                        name: `${usernameFour}`,
                        value: `Level: ${topFourLevel}\nPoints ${topFourPoints}`,
                        inline: false
                    },
                    {
                        name: `${usernameFive}`,
                        value: `Level: ${topFiveLevel}\nPoints ${topFivePoints}`,
                        inline: false
                    },
                ]
            }
        })
        .catch(err => {
            handleError(err);
        });
    }
};