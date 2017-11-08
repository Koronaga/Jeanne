const catFacts = require('cat-facts');
const axios = require('axios');

module.exports = {
  desc: 'Gives you a random catfact with a cute cat image.',
  cooldown: 5,
  guildOnly: true,
  aliases: ['catfact'],
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, _, config) {
    let randomFact = catFacts.random();
    axios.get('http://random.cat/meow', {
      headers: {
        'User-Agent': USERAGENT
      }
    }).then((res) => {
      const cat = res.data;
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: `${msg.author.username} requested a cat ;3`,
          url: `${cat.file}`,
          thumbnail: {
            url: `${cat.file}`
          },
          fields: [{
            name: '**Cat fact:**',
            value: `${randomFact}`
          }]
        }
      }).catch((err) => this.catchMessage(err, msg));
    }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};