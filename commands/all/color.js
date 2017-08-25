const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    randomColor = require('random-color'),
    hexRgb = require('hex-rgb'),
    converter = require('hex2dec'),
    randomFloat = require('random-floating'),
    rgbHex = require('rgb-hex');

module.exports = {
    desc: "Previews a random color or a color you give in the args.",
    usage: "<random/#hex_code/rgb(r, g, b,)>",
    aliases: ['colour'],
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
        colorTimesUsed++
        const type = args.toLowerCase();
        if (type === 'random') {
            // generate random number
            const rn = randomFloat({
                min: 0.3,
                max: 0.99,
                fixed: 2
            });
            const rn2 = randomFloat({
                min: 0.3,
                max: 0.99,
                fixed: 2
            });
            // generate random color
            const color = randomColor(rn, rn2);
            const hex = color.hexString();
            // convert to rgb
            const rgb = hexRgb(`${hex}`).join(', ');
            // make usable for dec
            const hex2 = hex.replace("#", "0x");
            // convert to decimal
            const dec = converter.hexToDec(`${hex2}`);
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: dec,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: ``,
                    thumbnail: {
                        url: `http://api.thegathering.xyz/color/index.php?color=${hex.replace("#", "")}`
                    },
                    fields: [{
                            name: `Hex`,
                            value: `${hex.toUpperCase()}`,
                            inline: false
                        },
                        {
                            name: `RGB`,
                            value: `(${rgb})`,
                            inline: false
                        },
                        {
                            name: `Decimal`,
                            value: `${dec}`,
                            inline: false
                        }
                    ]
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else if (type.startsWith('#')) {
            const hexRegex = /^#[0-9a-fA-F]{6}$/.test(type);
            if (hexRegex === false) return msg.channel.createMessage('\\❌ Invalid hex code. Use the following format \`#hex_code\`, e.g. \`#F4CE11\`');
            const hex = type,
                rgb = hexRgb(`${hex}`).join(', '),
                embedHex = hex.replace('#', '0x'),
                decimal = converter.hexToDec(`${embedHex}`);
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: decimal,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: ``,
                    thumbnail: {
                        url: `http://api.thegathering.xyz/color/index.php?color=${hex.replace("#", "")}`
                    },
                    fields: [{
                            name: `Hex`,
                            value: `${hex.toUpperCase()}`,
                            inline: false
                        },
                        {
                            name: `RGB`,
                            value: `(${rgb})`,
                            inline: false
                        },
                        {
                            name: `Decimal`,
                            value: `${decimal}`,
                            inline: false
                        }
                    ]
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else if (type.startsWith('rgb')) {
            const rgbRegex = /^rgb\(\d{1,3}, ?\d{1,3}, ?\d{1,3}\)$/.test(type);
            if (rgbRegex === false) return msg.channel.createMessage('\\❌ Invalid rgb code. Use the following format \`rgb(r, g, b,)\`, e.g. \`rgb(244, 206, 17)\`');
            const rgb = type,
                hexcode = rgbHex(`${rgb}`),
                hex = '#' + hexcode,
                embedHex = '0x' + hexcode,
                decimal = converter.hexToDec(`${embedHex}`),
                embedRgb = rgb.replace('rgb', '').replace(/, ?/g, ', ');
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: decimal,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: ``,
                    thumbnail: {
                        url: `http://api.thegathering.xyz/color/index.php?color=${hexcode}`
                    },
                    fields: [{
                            name: `Hex`,
                            value: `${hex.toUpperCase()}`,
                            inline: false
                        },
                        {
                            name: `RGB`,
                            value: `${embedRgb}`,
                            inline: false
                        },
                        {
                            name: `Decimal`,
                            value: `${decimal}`,
                            inline: false
                        }
                    ]
                }
            }).catch(err => {
                handleError(bot, err);
            });
        } else {
            return 'wrong usage';
        }
    }
};