const randomColor = require('random-color');
const hexRgb = require('hex-rgb');
const converter = require('hex2dec');
const randomFloat = require('random-floating');
const rgbHex = require('rgb-hex');
const baseURI = 'https://api.lepeli.fr';

module.exports = {
  desc: 'Previews a random color or a color you give in the args.',
  usage: '<random/#hex_code/rgb(r, g, b,)>',
  example: 'rgb(255, 0, 43)',
  aliases: ['colour'],
  cooldown: 5,
  guildOnly: true,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args) {
    if (!args) return 'wrong usage';
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
      const hex2 = hex.replace('#', '0x');
      // convert to decimal
      const dec = converter.hexToDec(`${hex2}`);
      msg.channel.createMessage({
        embed: {
          color: dec,
          thumbnail: {
            url: baseURI + `/color/index.php?color=${hex.replace('#', '')}`
          },
          fields: [{
            name: 'Hex',
            value: `${hex.toUpperCase()}`,
            inline: false
          },
          {
            name: 'RGB',
            value: `(${rgb})`,
            inline: false
          },
          {
            name: 'Decimal',
            value: `${dec}`,
            inline: false
          }]
        }
      }).catch((err) => this.catchMessage(err, msg));
    } else if (type.startsWith('#')) {
      const hexRegex = /^#[0-9a-fA-F]{6}$/.test(type);
      if (hexRegex === false) return msg.channel.createMessage('<:RedCross:373596012755025920> | Invalid hex code. Use the following format \`#hex_code\`, e.g. \`#F4CE11\`');
      const hex = type,
        rgb = hexRgb(`${hex}`).join(', '),
        embedHex = hex.replace('#', '0x'),
        decimal = converter.hexToDec(`${embedHex}`);
      msg.channel.createMessage({
        embed: {
          color: decimal,
          thumbnail: {
            url: baseURI + `/color/index.php?color=${hex.replace('#', '')}`
          },
          fields: [{
            name: 'Hex',
            value: `${hex.toUpperCase()}`,
            inline: false
          },
          {
            name: 'RGB',
            value: `(${rgb})`,
            inline: false
          },
          {
            name: 'Decimal',
            value: `${decimal}`,
            inline: false
          }]
        }
      }).catch((err) => this.catchMessage(err, msg));
    } else if (type.startsWith('rgb')) {
      const rgbRegex = /^rgb\(\d{1,3}, ?\d{1,3}, ?\d{1,3}\)$/.test(type);
      if (rgbRegex === false) return msg.channel.createMessage('<:RedCross:373596012755025920> | Invalid rgb code. Use the following format \`rgb(r, g, b,)\`, e.g. \`rgb(244, 206, 17)\`');
      const rgb = type,
        hexcode = rgbHex(`${rgb}`),
        hex = '#' + hexcode,
        embedHex = '0x' + hexcode,
        decimal = converter.hexToDec(`${embedHex}`),
        embedRgb = rgb.replace('rgb', '').replace(/, ?/g, ', ');
      msg.channel.createMessage({
        embed: {
          color: decimal,
          thumbnail: {
            url: baseURI + `/color/index.php?color=${hexcode}`
          },
          fields: [{
            name: 'Hex',
            value: `${hex.toUpperCase()}`,
            inline: false
          },
          {
            name: 'RGB',
            value: `${embedRgb}`,
            inline: false
          },
          {
            name: 'Decimal',
            value: `${decimal}`,
            inline: false
          }]
        }
      }).catch((err) => this.catchMessage(err, msg));
    } else return 'wrong usage';
  }
};