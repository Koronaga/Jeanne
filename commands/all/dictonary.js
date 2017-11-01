const axios = require('axios');

module.exports = {
  desc: 'Search the disctonary for a word or use \`j:dict language\` to see the available languages',
  usage: '<lang/"language"> | <text>',
  exmaple: 'en-en | time',
  aliases: ['dict'],
  cooldown: 5,
  guildOnly: true,
  async task(bot, msg, suffix, config) {
    if (!suffix) return 'wrong usage';
    const args = suffix.split(/ ?\| ?/);
    const lang = args[0];
    const text = args[1];
    if (!lang) return 'wrong usage';
    if (lang === 'languages') {
      try {
        const res = await axios.get('https://dictionary.yandex.net/api/v1/dicservice.json/getLangs', {
          headers: {
            'User-Agent': USERAGENT,
            'Accept': 'application/json'
          },
          params: {
            key: config.yandex_dict_key
          }
        });
        await msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            description: `${res.data.join(', ')}`
          }
        });
      } catch (error) {
        this.handleError(bot, __filename, msg.channel, error);
      }
    } else {
      try {
        const res = await axios.get('https://dictionary.yandex.net/api/v1/dicservice.json/lookup', {
          headers: {
            'User-Agent': USERAGENT,
            'Accept': 'application/json'
          },
          params: {
            key: config.yandex_dict_key,
            lang: lang,
            text: text
          }
        });
        let desc = '';
        res.data.def[0].tr.forEach((d) => {
          if (res.data.def[0].tr.indexOf(d) === res.data.def[0].tr.length - 1) {
            desc += `${d.text}, ${d.pos}`;
          } else {
            desc += `${d.text}, ${d.pos}\n`;
          }
        });
        await msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: res.data.def[0].text,
            description: desc
          }
        });
      } catch (error) {
        this.handleError(bot, __filename, msg.channel, error);
      }
    }
  }
};