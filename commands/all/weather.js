const reload = require('require-reload'),
    config = reload('../../config.json');
let Wunderground = require('wunderground-api');
let client = new Wunderground(`${config.wu_key}`);
var error,
    logger,
    logger = new(reload('../../utils/Logger.js'))(config.logTimestamp);

module.exports = {
    desc: "Get the weather from the specified city and state/country.",
    usage: "<City> | <State/Country>",
    aliases: ['we'],
    cooldown: 30,
    guildOnly: true,
    task(bot, msg, args) {
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
        if (!args) return 'wrong usage'
        let str = args.toString();
        let array = str.split(/ ?\| ?/),
            city = array[0],
            state = array[1];
        let opts = {
            city: `${city}`,
            state: `${state}`
        }
        client.conditions(opts, (err, data) => {
            if (err) return bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: 0xff0000,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `${err}`,
                    fields: [{
                        name: `For support join:`,
                        value: `https://discord.gg/Vf4ne5b`,
                        inline: true
                    }]
                }
            }).catch(err => {
                logger.error('\n' + err, 'ERROR')
            });
            if (!data) return bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: 0xff0000,
                    author: {
                        name: ``,
                        url: ``,
                        icon_url: ``
                    },
                    description: `There was no data found for this location :(`,
                    fields: [{
                        name: `For support join:`,
                        value: `https://discord.gg/Vf4ne5b`,
                        inline: true
                    }]
                }
            }).catch(err => {
                logger.error('\n' + err, 'ERROR')
            });
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: 0xf4ce11,
                    author: {
                        name: `${data.icon}`,
                        url: `${data.icon_url}`,
                        icon_url: `${data.icon_url}`
                    },
                    description: ``,
                    thumbnail: {
                        url: `${data.icon_url}`
                    },
                    fields: [{
                            name: `Location:`,
                            value: `${data.display_location.full}`,
                            inline: false
                        },
                        {
                            name: `Time:`,
                            value: `${data.observation_time}`,
                            inline: false
                        },
                        {
                            name: `Wind:`,
                            value: `${data.wind_string}`,
                            inline: false
                        },
                        {
                            name: `Temperature:`,
                            value: `Fahrenheit: ${data.temp_f}°F\nCelsius: ${data.temp_c}°C`,
                            inline: true
                        },
                        {
                            name: `\"Feelslike\" temperature:`,
                            value: `Fahrenheit: ${data.feelslike_f}°F\nCelsius: ${data.feelslike_c}°C`,
                            inline: true
                        },
                        {
                            name: `Humidity:`,
                            value: `${data.relative_humidity}`,
                            inline: true
                        },
                        {
                            name: `Wind Speed:`,
                            value: `${data.wind_mph}mph\n${data.wind_kph}kph`,
                            inline: true
                        },
                        {
                            name: `Visibility:`,
                            value: `${data.visibility_mi}mi\n${data.visibility_km}km`,
                            inline: true
                        }
                    ]
                }
            }).catch(err => {
                error = JSON.parse(err.response);
                if ((!error.code) && (!error.message)) return logger.error('\n' + err, 'ERROR')
                logger.error(error.code + '\n' + error.message, 'ERROR');
            });
        });
    }
};