const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  {
    flag,
    code,
    name
  } = require('country-emoji'),
  Wunderground = require('wunderground-api'),
  wu = new Wunderground(`${config.wu_key}`);

module.exports = {
  desc: "Get the weather from the specified city and state/country.",
  usage: "<city> | <state>",
  aliases: ['we'],
  cooldown: 30,
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
    let str = args.toString();
    let array = str.split(/ ?\| ?/),
      city = array[0],
      state = array[1];
    let opts = {
      city: `${city}`,
      state: `${state}`
    };
    wu.conditions(opts, (err, data) => {
      if (err) return handleError(bot, __filename, msg.channel, err);
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
        handleError(bot, __filename, msg.channel, err);
      });
      const originIcon = data.icon_url;
      let icon = 'https://b.catgirlsare.sexy/Ci0m.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/chanceflurries.gif') icon = 'https://b.catgirlsare.sexy/TIu3.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/chancerain.gif') icon = 'https://b.catgirlsare.sexy/m67u.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/chancesleet.gif') icon = 'https://b.catgirlsare.sexy/PucX.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/chancesnow.gif') icon = 'https://b.catgirlsare.sexy/Aa3n.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/chancetstorms.gif') icon = 'https://b.catgirlsare.sexy/cGwc.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/clear.gif') icon = 'https://b.catgirlsare.sexy/XnXc.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/cloudy.gif') icon = 'https://b.catgirlsare.sexy/safl.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/flurries.gif') icon = 'https://b.catgirlsare.sexy/TIu3.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/fog.gif') icon = 'https://b.catgirlsare.sexy/tX1L.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/hazy.gif') icon = 'https://b.catgirlsare.sexy/XpnO.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/mostlycloudy.gif') icon = 'https://b.catgirlsare.sexy/dREn.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/mostlysunny.gif') icon = 'https://b.catgirlsare.sexy/ETbd.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/partlycloudy.gif') icon = 'https://b.catgirlsare.sexy/FivB.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/partlysunny.gif') icon = 'https://b.catgirlsare.sexy/1dYA.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/sleet.gif') icon = 'https://b.catgirlsare.sexy/PucX.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/rain.gif') icon = 'https://b.catgirlsare.sexy/BqdX.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/snow.gif') icon = 'https://b.catgirlsare.sexy/3KCo.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/sunny.gif') icon = 'https://b.catgirlsare.sexy/XnXc.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/tstorms.gif') icon = 'https://b.catgirlsare.sexy/K8ik.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_chanceflurries.gif') icon = 'https://b.catgirlsare.sexy/tdFC.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_chancerain.gif') icon = 'https://b.catgirlsare.sexy/m67u.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_chancesleet.gif') icon = 'https://b.catgirlsare.sexy/PucX.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_chancesnow.gif') icon = 'https://b.catgirlsare.sexy/Aa3n.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_chancetstorms.gif') icon = 'https://b.catgirlsare.sexy/GmUi.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_clear.gif') icon = 'https://b.catgirlsare.sexy/4Jvx.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_cloudy.gif') icon = 'https://b.catgirlsare.sexy/safl.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_flurries.gif') icon = 'https://b.catgirlsare.sexy/tdFC.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_fog.gif') icon = 'https://b.catgirlsare.sexy/MDBC.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_hazy.gif') icon = 'https://b.catgirlsare.sexy/XpnO.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_mostlycloudy.gif') icon = 'https://b.catgirlsare.sexy/YhUk.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_mostlysunny.gif') icon = 'https://b.catgirlsare.sexy/lRcb.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_partlycloudy.gif') icon = 'https://b.catgirlsare.sexy/CnOr.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_partlysunny.gif') icon = 'https://b.catgirlsare.sexy/yAcT.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_sleet.gif') icon = 'https://b.catgirlsare.sexy/PucX.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_rain.gif') icon = 'https://b.catgirlsare.sexy/BqdX.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_snow.gif') icon = 'https://b.catgirlsare.sexy/3KCo.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_sunny.gif') icon = 'https://b.catgirlsare.sexy/4Jvx.png';
      if (originIcon === 'http://icons.wxug.com/i/c/k/nt_tstorms.gif') icon = 'https://b.catgirlsare.sexy/K8ik.png';
      msg.channel.createMessage({
        content: ``,
        embed: {
          color: config.defaultColor,
          title: `The weather is ${data.weather}`,
          thumbnail: {
            url: `${icon}`
          },
          fields: [{
              name: `Location:`,
              value: `${flag(data.display_location.country)} ${data.display_location.full}`,
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
        handleError(bot, __filename, msg.channel, err);
      });
    });
  }
};