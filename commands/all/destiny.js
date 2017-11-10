const reload = require('require-reload');
const config = reload('../../config.json');
const DestinyApi = require('../../custom_modules/destiny-api-client');
const destiny = new DestinyApi(config.destiny_key);

module.exports = {
  desc: 'Get your destiny account stats.',
  usage: '<xbox/psn> | <username> | <pve/pvp>',
  example: 'psn | kurozero | pve',
  cooldown: 10,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args) {
    if (!args) return 'wrong usage';
    const str = args + '';
    let array = str.split(/ ?\| ?/),
      system = array[0],
      username = array[1],
      gameType = array[2];
    if (!system) return 'wrong usage';
    if (!username) return 'wrong usage';
    if (!gameType) return 'wrong usage';
    gameType = gameType.toLowerCase();
    let sysType;
    const psnTest = new RegExp(/psn/i);
    const xboxTest = new RegExp(/xbox/i);
    if (psnTest.test(system)) {
      sysType = DestinyApi.psn;
    } else if (xboxTest.test(system)) {
      sysType = DestinyApi.xbox;
    } else return 'wrong usage';
    let sentMsgID = '';
    msg.channel.createMessage('🔶 | Getting account stats please wait a few seconds.')
      .then((sentMsg) => {
        sentMsgID = sentMsg.id;
        return sentMsgID;
      }).catch((err) => this.catchMessage(err, msg));
    destiny.searchPlayer({
      membershipType: sysType,
      displayName: username
    }).then((res) => {
      if (!res[0]) return msg.channel.editMessage(sentMsgID, '<:RedCross:373596012755025920> | Could not find player!')
        .catch((err) => this.catchMessage(err, msg));
      const memID = res[0].membershipId;
      destiny.accountStats({
        membershipType: sysType,
        destinyMembershipId: memID
      }).then((res) => {
        /* PVE */
        if (gameType === 'pve') {
          let pve = JSON.stringify(res.mergedAllCharacters.results.allPvE.allTime);
          pve = JSON.parse(pve);
          msg.channel.editMessage(sentMsgID, {
            content: '',
            embed: {
              color: config.defaultColor,
              author: {
                name: `PvE stats from ${username}`
              },
              thumbnail: {
                url: 'https://b.catgirlsare.sexy/ZjZ5.png'
              },
              fields: [{
                name: 'Kills',
                value: `${pve.kills.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Deaths',
                value: `${pve.deaths.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Grenade Kills',
                value: `${pve.weaponKillsGrenade.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Ability Kills',
                value: `${pve.abilityKills.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Super Kills',
                value: `${pve.weaponKillsSuper.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Melee Kills',
                value: `${pve.weaponKillsMelee.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Precision Kills',
                value: `${pve.precisionKills.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Assists',
                value: `${pve.assists.basic.displayValue}`,
                inline: true
              },
              {
                name: 'K/D Ratio',
                value: `${pve.killsDeathsRatio.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Resurrections',
                value: `${pve.resurrectionsPerformed.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Suicides',
                value: `${pve.suicides.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Longest Single Life',
                value: `${pve.longestSingleLife.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Best Weapon Type',
                value: `${pve.weaponBestType.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Longest Kill Spree',
                value: `${pve.longestKillSpree.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Highest Character Level',
                value: `${pve.highestCharacterLevel.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Highest Light Level',
                value: `${pve.highestLightLevel.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Time Played',
                value: `${pve.secondsPlayed.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Average Lifespan',
                value: `${pve.averageLifespan.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Activities Cleared',
                value: `${pve.activitiesCleared.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Activities Entered',
                value: `${pve.activitiesEntered.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Orbs Dropped',
                value: `${pve.orbsDropped.basic.displayValue}`,
                inline: true
              }
              ],
              footer: {
                text: 'All data is from bungie.net',
                icon_url: 'https://b.catgirlsare.sexy/fTEL.png'
              }
            }
          }).catch((err) => this.catchMessage(err, msg));
        }
        /* PVP */
        else if (gameType === 'pvp') {
          let pvp = JSON.stringify(res.mergedAllCharacters.results.allPvP.allTime);
          pvp = JSON.parse(pvp);
          msg.channel.editMessage(sentMsgID, {
            content: '',
            embed: {
              color: config.defaultColor,
              author: {
                name: `PvP stats from ${username}`
              },
              thumbnail: {
                url: 'https://b.catgirlsare.sexy/7VOW.png'
              },
              fields: [{
                name: 'Kills',
                value: `${pvp.kills.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Deaths',
                value: `${pvp.deaths.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Grenade Kills',
                value: `${pvp.weaponKillsGrenade.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Ability Kills',
                value: `${pvp.abilityKills.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Super Kills',
                value: `${pvp.weaponKillsSuper.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Melee Kills',
                value: `${pvp.weaponKillsMelee.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Precision Kills',
                value: `${pvp.precisionKills.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Assists',
                value: `${pvp.assists.basic.displayValue}`,
                inline: true
              },
              {
                name: 'K/D Ratio',
                value: `${pvp.killsDeathsRatio.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Resurrections',
                value: `${pvp.resurrectionsPerformed.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Suicides',
                value: `${pvp.suicides.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Longest Single Life',
                value: `${pvp.longestSingleLife.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Best Weapon Type',
                value: `${pvp.weaponBestType.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Longest Kill Spree',
                value: `${pvp.longestKillSpree.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Highest Character Level',
                value: `${pvp.highestCharacterLevel.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Highest Light Level',
                value: `${pvp.highestLightLevel.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Time Played',
                value: `${pvp.secondsPlayed.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Average Lifespan',
                value: `${pvp.averageLifespan.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Total Activities Won',
                value: `${pvp.activitiesWon.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Activities Entered',
                value: `${pvp.activitiesEntered.basic.displayValue}`,
                inline: true
              },
              {
                name: 'Orbs Dropped',
                value: `${pvp.orbsDropped.basic.displayValue}`,
                inline: true
              }
              ],
              footer: {
                text: 'All data is from bungie.net',
                icon_url: 'https://b.catgirlsare.sexy/fTEL.png'
              }
            }
          }).catch((err) => this.catchMessage(err, msg));
        }
      }).catch(() =>
        msg.channel.createMessage(`<:RedCross:373596012755025920> | Could not find user stats with the name **${username}**`)
          .catch((err) => this.catchMessage(err, msg))
        );
    }).catch(() =>
      msg.channel.createMessage(`<:RedCross:373596012755025920> | Could not find a user with the name **${username}**`)
        .catch((err) => this.catchMessage(err, msg))
      );
  }
};