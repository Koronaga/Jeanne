const feh = require('fire-emblem-heroes-stats');
const config = require('../../config.json');

module.exports = {
  desc: 'Get stats about a hero or skill',
  usage: '<hero/skill> | [4/5*]<hero_name/skill_name>',
  example: 'hero | Anna',
  aliases: ['feh', 'fireemblem'],
  cooldown: 5,
  guildOnly: true,
  task(bot, msg, suffix) {
    /**
     * perm checks
     * @param {boolean} sendMessages - Checks if the bots permissions has sendMessages
     * @param {boolean} embedLinks - Checks if the bots permissions has embedLinks
     */
    const sendMessages = msg.channel.permissionsOf(bot.user.id).has('sendMessages');
    const embedLinks = msg.channel.permissionsOf(bot.user.id).has('embedLinks');
    if (sendMessages === false) return;
    if (embedLinks === false) return msg.channel.createMessage('\\❌ I\'m missing the \`embedLinks\` permission, which is required for this command to work.')
      .catch(() => { return; });
    if (!suffix) return 'wrong usage';
    const args = suffix.split(/ ?\| ?/);
    const option = args[0];
    const thing = args[1];
    if (!option) return 'wrong usage';
    if (!thing) return 'wrong usage';
    if (option === 'hero') {
      let stars = thing.slice(0, 2);
      let regex4 = new RegExp(/^[4]\*$/);
      let regex5 = new RegExp(/^[5]\*$/);
      if (regex4.test(stars)) {
        let hero = thing.slice(2, thing.length);
        hero = feh.getHero(hero);
        if (!hero.stats['1']['4']) return msg.channel.createMessage('Looks like this hero can\'t have 4 stars.')
          .catch(() => { return; });
        const oneLfourS = hero.stats['1']['4'];
        const fourthyLfourS = hero.stats['40']['4'];
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: hero.name,
            description: '<:SilverStar:375369363651559424> <:SilverStar:375369363651559424> <:SilverStar:375369363651559424> <:SilverStar:375369363651559424>',
            thumbnail: {
              url: hero.assets.portrait['113px']
            },
            fields: [
              {
                name: 'Level 1',
                value: `HP: ${oneLfourS.hp}\n` +
                `ATK: ${oneLfourS.atk}\n` +
                `SPD: ${oneLfourS.spd}\n` +
                `DEF: ${oneLfourS.def}\n` +
                `RES: ${oneLfourS.res}\n` +
                `Total: ${oneLfourS.total}`,
                inline: true
              },
              {
                name: 'Level 40',
                value: `HP: ${fourthyLfourS.hp[1] ? fourthyLfourS.hp[1] : fourthyLfourS.hp[0]}\n` +
                `ATK: ${fourthyLfourS.atk[1] ? fourthyLfourS.atk[1] : fourthyLfourS.atk[0]}\n` +
                `SPD: ${fourthyLfourS.spd[1] ? fourthyLfourS.spd[1] : fourthyLfourS.spd[0]}\n` +
                `DEF: ${fourthyLfourS.def[1] ? fourthyLfourS.def[1] : fourthyLfourS.def[0]}\n` +
                `RES: ${fourthyLfourS.res[1] ? fourthyLfourS.res[1] : fourthyLfourS.res[0]}\n` +
                `Total: ${fourthyLfourS.total[0]}`,
                inline: true
              }
            ]
          }
        });
      } else if (regex5.test(stars)) {
        let hero = thing.slice(2, thing.length);
        hero = feh.getHero(hero);
        if (!hero.stats['1']['5']) return msg.channel.createMessage('Looks like this hero can\'t have 5 stars.')
          .catch(() => { return; });
        const oneLfiveS = hero.stats['1']['5'];
        const fourthyLfiveS = hero.stats['40']['5'];
        msg.channel.createMessage({
          embed: {
            color: config.defaultColor,
            title: hero.name,
            description: ':star: :star: :star: :star: :star:',
            thumbnail: {
              url: hero.assets.portrait['113px']
            },
            fields: [
              {
                name: 'Level 1',
                value: `HP: ${oneLfiveS.hp}\n` +
                `ATK: ${oneLfiveS.atk}\n` +
                `SPD: ${oneLfiveS.spd}\n` +
                `DEF: ${oneLfiveS.def}\n` +
                `RES: ${oneLfiveS.res}\n` +
                `Total: ${oneLfiveS.total}`,
                inline: true
              },
              {
                name: 'Level 40',
                value: `HP: ${fourthyLfiveS.hp[1] ? fourthyLfiveS.hp[1] : fourthyLfiveS.hp[0]}\n` +
                `ATK: ${fourthyLfiveS.atk[1] ? fourthyLfiveS.atk[1] : fourthyLfiveS.atk[0]}\n` +
                `SPD: ${fourthyLfiveS.spd[1] ? fourthyLfiveS.spd[1] : fourthyLfiveS.spd[0]}\n` +
                `DEF: ${fourthyLfiveS.def[1] ? fourthyLfiveS.def[1] : fourthyLfiveS.def[0]}\n` +
                `RES: ${fourthyLfiveS.res[1] ? fourthyLfiveS.res[1] : fourthyLfiveS.res[0]}\n` +
                `Total: ${fourthyLfiveS.total[0]}`,
                inline: true
              }
            ]
          }
        });
      } else {
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
      }
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