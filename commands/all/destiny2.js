const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    axios = require('axios'),
    fs = require('fs'),
    getColors = require('get-image-colors'),
    imageDataURI = require('image-data-uri'),
    format = require('../../utils/utils.js').formatTime,
    round = require('../../utils/utils.js').round;

module.exports = {
    desc: "Get destiny 2 character data.",
    usage: "<xbox/psn/blizzard> | <displayname> | <character_number>`\nExample: j:d2 psn | kurozero | 1",
    aliases: ['d2'],
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
        if (!args) return 'wrong usage';
        const str = args + "";
        let array = str.split(/ ?\| ?/),
            system = array[0],
            displayName = array[1],
            characterNum = array[2];
        if (!system) return 'wrong usage';
        if (!displayName) return 'wrong usage';
        if (!characterNum) return 'wrong usage';
        system = system.toLowerCase();
        let membershipType;
        if (system === 'xbox') membershipType = 1;
        if (system === 'psn') membershipType = 2;
        if (system === 'blizzard') membershipType = 4;
        const things = 'psn xbox blizzard';
        if (!things.includes(system)) return 'wrong usage';
        if (/[^\d]/.test(characterNum)) return msg.channel.createMessage('\\❌ Last argument can only be a number between 0-2')
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        if (typeof characterNum === 'string' || characterNum instanceof String) characterNum = parseInt(characterNum);
        if (characterNum > 2) return msg.channel.createMessage('\\❌ Last argument can only be a number between 0-2')
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        const baseURI = "https://www.bungie.net/Platform";
        axios.get(baseURI + `/Destiny2/SearchDestinyPlayer/${membershipType}/${displayName}/`, {
                headers: {
                    'X-API-Key': config.destiny2_key
                }
            })
            .then(res => {
                if (res.data.ErrorCode !== 1) return msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.errorColor,
                            title: `Error:`,
                            description: `Code: ${res.data.ErrorCode}\n` +
                                `Status: ${res.data.ErrorStatus}\n` +
                                `Message: ${res.data.Message}`
                        }
                    })
                    .catch(err => {
                        handleError(bot, __filename, msg.channel, err);
                    });
                if (!res.data.Response[0]) return msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.errorColor,
                            description: `No user found for **${displayName}**`
                        }
                    })
                    .catch(err => {
                        handleError(bot, __filename, msg.channel, err);
                    });
                const player = res.data.Response[0];
                const destinyMembershipId = player.membershipId;
                axios.get(baseURI + `/Destiny2/${membershipType}/Profile/${destinyMembershipId}/ `, {
                        headers: {
                            'X-API-Key': config.destiny2_key
                        },
                        params: {
                            components: '200, 202'
                        }
                    })
                    .then(res => {
                        if (res.data.ErrorCode !== 1) return msg.channel.createMessage({
                                content: ``,
                                embed: {
                                    color: config.errorColor,
                                    title: `Error:`,
                                    description: `Code: ${res.data.ErrorCode}\n` +
                                        `Status: ${res.data.ErrorStatus}\n` +
                                        `Message: ${res.data.Message}`
                                }
                            })
                            .catch(err => {
                                handleError(bot, __filename, msg.channel, err);
                            });
                        let charData = res.data.Response.characters.data;
                        const characters = Object.keys(charData).map(key => {
                            return charData[key];
                        });
                        if (!characters[characterNum]) return msg.channel.createMessage({
                                content: ``,
                                embed: {
                                    color: config.errorColor,
                                    description: `No character found for **${displayName}**\nCharacter number: ${characterNum}`
                                }
                            })
                            .catch(err => {
                                handleError(bot, __filename, msg.channel, err);
                            });
                        // Genders
                        let gender;
                        if (characters[characterNum].genderType === 0) gender = 'Male';
                        if (characters[characterNum].genderType === 1) gender = 'Female';
                        // Class
                        let Class;
                        if (characters[characterNum].classType === 0) Class = 'Titan';
                        if (characters[characterNum].classType === 1) Class = 'Hunter';
                        if (characters[characterNum].classType === 2) Class = 'Warlock';
                        // Race
                        let race;
                        if (characters[characterNum].raceType === 0) race = 'Human';
                        if (characters[characterNum].raceType === 1) race = 'Awoken';
                        if (characters[characterNum].raceType === 2) race = 'Exo';
                        imageDataURI.encodeFromURL(`https://www.bungie.net${characters[characterNum].emblemPath}`)
                            .then(res => {
                                const decoded = imageDataURI.decode(res);
                                const buffer = decoded.dataBuffer;
                                getColors(buffer, 'image/jpg')
                                    .then(colors => {
                                        const hexEmbedColors = colors.map(color => color.hex());
                                        const hexEmbedColor = hexEmbedColors[0].replace("#", "0x");
                                        const embedColor = parseInt(hexEmbedColor);
                                        const hours = characters[characterNum].minutesPlayedTotal / 60;
                                        const seconds = characters[characterNum].minutesPlayedTotal * 60;
                                        const ms = seconds * 1000;
                                        msg.channel.createMessage({
                                                content: ``,
                                                embed: {
                                                    color: embedColor,
                                                    title: ``,
                                                    thumbnail: {
                                                        url: `https://www.bungie.net${characters[characterNum].emblemPath}`
                                                    },
                                                    fields: [{
                                                            name: `Level`,
                                                            value: `${characters[characterNum].levelProgression.level}`,
                                                            inline: true
                                                        },
                                                        {
                                                            name: `Light level`,
                                                            value: `${characters[characterNum].light}`,
                                                            inline: true
                                                        },
                                                        {
                                                            name: `Gender`,
                                                            value: `${gender}`,
                                                            inline: true
                                                        },
                                                        {
                                                            name: `Class`,
                                                            value: `${Class}`,
                                                            inline: true
                                                        },
                                                        {
                                                            name: `Race`,
                                                            value: `${race}`,
                                                            inline: true
                                                        },
                                                        {
                                                            name: `Time played`,
                                                            value: `${format(ms)}\nA total of ${round(hours, 0)} hours`,
                                                            inline: false
                                                        }
                                                    ],
                                                    footer: {
                                                        text: `All data is from bungie.net`,
                                                        icon_url: `https://b.catgirlsare.sexy/fTEL.png`
                                                    }
                                                }
                                            })
                                            .catch(err => {
                                                handleError(bot, __filename, msg.channel, err);
                                            });
                                    })
                                    .catch(err => {
                                        handleError(bot, __filename, msg.channel, err);
                                    });
                            })
                            .catch(err => {
                                handleError(bot, __filename, msg.channel, err);
                            });
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