const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  Pokedex = require('oakdex-pokedex');

module.exports = {
  desc: "Search a pokemon by name or national pokedex id.",
  usage: "<name/national_pokedex_id>",
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
    const lower = args.toString().toLowerCase();
    const uppercaseFirstLetter = lower.charAt(0).toUpperCase();
    const stringWithoutFirstLetter = lower.slice(1);
    args = uppercaseFirstLetter + stringWithoutFirstLetter;
    try {
      Pokedex.findPokemon(args, (res, err) => {
        if (err) return handleMsgError(bot, msg.channel, err);
        if (!res) return bot.createMessage(msg.channel.id, 'Couldn\'t find any data.')
          .catch(err => {
            handleError(bot, __filename, msg.channel, err);
          });
        const types = res.types.toString();
        const egg_groups = res.egg_groups.toString();
        const hatch_time = res.hatch_time.toString();

        let genderMale = '';
        let genderFemale = '';
        if (!res.gender_ratios) {
          genderMale = 'n/a';
          genderFemale = 'n/a';
        } else {
          genderMale = res.gender_ratios.male + '%';
          genderFemale = res.gender_ratios.female + '%';
        }

        let evolveTo = '' + res.evolutions.map(e => e.to);
        if (!evolveTo)
          evolveTo = 'n/a';
        let evolveAt = 'lvl' + res.evolutions.map(e => e.level);
        if (evolveAt === 'lvl')
          evolveAt = 'n/a';
        /*
        let pokeID = '';
        if (res.national_id.toString().length === 1) pokeID = '00' + res.national_id;
        if (res.national_id.toString().length === 2) pokeID = '0' + res.national_id;
        if (res.national_id.toString().length === 3) pokeID = res.national_id;
        `https://raw.githubusercontent.com/jalyna/oakdex-pokedex-sprites/master/icons/${pokeID}.png`
        */
        const pokeImage = res.names.en.toLowerCase().replace(/ /g, '-');
        msg.channel.createMessage({
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `${res.names.en}`,
              url: ``,
              icon_url: ``
            },
            image: {
              url: `https://img.pokemondb.net/artwork/${pokeImage}.jpg`
            },
            fields: [{
                name: `Names`,
                value: `France: ${res.names.fr}\nGerman: ${res.names.de}\nItalian: ${res.names.it}\nEnglish: ${res.names.en}`,
                inline: true
              },
              {
                name: `Height/Weight`,
                value: `Height: ${res.height_eu}\nWeight: ${res.weight_eu}`,
                inline: true
              },
              {
                name: `Types`,
                value: `${types.split(/ ?, ?/).join('\n')}`,
                inline: true
              },
              {
                name: `Gender ratios`,
                value: `Male: ${genderMale}\nFemale: ${genderFemale}`,
                inline: true
              },
              {
                name: `Catch rate`,
                value: `${res.catch_rate}`,
                inline: true
              },
              {
                name: `Egg groups`,
                value: `${egg_groups.split(',').join('\n')}`,
                inline: true
              },
              {
                name: `Hatch time`,
                value: `${hatch_time.split(',').join('/')}steps`,
                inline: true
              },
              {
                name: `Leveling rate`,
                value: `${res.leveling_rate}`,
                inline: true
              },
              {
                name: `Evolutions`,
                value: `To: ${evolveTo}\nAt: ${evolveAt}`,
                inline: true
              },
              {
                name: `Categories`,
                value: `${res.categories.en}`,
                inline: true
              },
              {
                name: `National pokedex id`,
                value: `${res.national_id}`,
                inline: true
              }
            ]
          },
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      });
    } catch (error) {
      handleError(bot, __filename, msg.channel, error);
    }

  }
};