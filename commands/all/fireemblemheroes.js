const feh = require('fire-emblem-heroes-stats');
const config = require('../../config.json');

module.exports = {
  desc: 'Get stats about a hero or skill',
  usage: '<hero/skill> | <hero_name/skill_name>',
  example: 'hero | Anna',
  aliases: ['feh', 'fireemblem'],
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, suffix) {
    if (!suffix) return 'wrong usage';
    const args = suffix.split(/ ?\| ?/);
    const option = args[0];
    const thing = args[1];
    if (!option) return 'wrong usage';
    if (!thing) return 'wrong usage';
    if (option === 'hero') {
      const hero = feh.getHero(thing);
      let skillNames = '';
      hero.skills.forEach((s) => {
        skillNames += s.name + ', ';
      });
      skillNames = skillNames.slice(0, -2);
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: hero.name,
          description: '**Skills:**\n' + skillNames,
          thumbnail: {
            url: hero.assets.portrait['113px']
          },
          fields: [
            {
              name: 'Title',
              value: hero.title,
              inline: true
            },
            {
              name: 'Origin',
              value: hero.origin,
              inline: true
            },
            {
              name: 'Weapon Type',
              value: hero.weaponType,
              inline: true
            },
            {
              name: 'Move Type',
              value: hero.moveType,
              inline: true
            },
            {
              name: 'Rarities',
              value: hero.rarities,
              inline: true
            },
            {
              name: 'Release Date',
              value: hero.releaseDate,
              inline: true
            }
          ]
        }
      });
    } else if (option === 'skill') {
      const type = feh.getSkillType(thing);
      const skill = feh.getSkillObject(type, thing);
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: skill.name,
          description: '\u200b',
          fields: [
            {
              name: 'SP Cost',
              value: skill.spCost,
              inline: true
            },
            {
              name: 'Damage(mt)',
              value: skill['damage(mt)'],
              inline: true
            },
            {
              name: 'Range(rng)',
              value: skill['range(rng)'],
              inline: true
            },
            {
              name: 'Effect',
              value: skill.effect,
              inline: true
            },
            {
              name: 'Exclusive?',
              value: skill['exclusive?'],
              inline: true
            },
            {
              name: 'Type',
              value: skill.type,
              inline: true
            },
            {
              name: 'Weapon Type',
              value: skill.weaponType,
              inline: true
            }
          ]
        }
      });
    } else {
      return 'wrong usage';
    }
  }
};