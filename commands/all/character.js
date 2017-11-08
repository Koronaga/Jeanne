const Kitsu = require('kawaii-kitsune');
const kitsu = new Kitsu();

module.exports = {
  desc: 'Search a manga or anime character.',
  usage: '<character_name>',
  example: 'Ruler',
  aliases: ['char'],
  cooldown: 10,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
    if (!args) return 'wrong usage';
    kitsu.searchCharacter(args)
      .then((res) => {
        const char = res[0];
        let desc = char.description.replace(/<br\/?>/gi, '\n');
        desc = desc.substring(0, desc.indexOf('<span class="spoiler">'));
        if (desc.length > 1000) desc = desc.slice(0, 1000);
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: char.name ? char.name : char.slug,
            thumbnail: {
              url: char.image.original ? char.image.original : ''
            },
            description: desc + `\nClick [here](https://myanimelist.net/character/${char.malId}) to read more`
          }
        }).catch((err) => this.catchMessage(err, msg));
      }).catch((err) => this.catchError(bot, msg, __filename, err));
  }
};