module.exports = {
  desc: 'Sends someone\'s avatar url. (The file size can be 128, 256, 512, 1024, or 2048. Defaults to 2048.)',
  usage: '<-s/--size> <size> OR <username/ID/@username> | <size>',
  example: '--size 512',
  aliases: ['ava', 'pfp', 'avi'],
  guildOnly: true,
  cooldown: 5,
  botPermissions: ['sendMessages', 'embedLinks'],
  task(bot, msg, args, config) {
    let format = '';
    let size = 2048;
    if (!args) {
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: 'Your Avatar:',
          url: `${msg.author.avatarURL ? msg.author.dynamicAvatarURL(format, size) : msg.author.defaultAvatarURL}`,
          description: `**[Click here for direct image link](${msg.author.avatarURL ? msg.author.dynamicAvatarURL(format, size) : msg.author.defaultAvatarURL})**`,
          image: {
            url: `${msg.author.avatarURL ? msg.author.dynamicAvatarURL(format, size) : msg.author.defaultAvatarURL}`
          }
        }
      }).catch((err) => this.catchMessage(err, msg));
    } else if ((args.startsWith('--size')) || (args.startsWith('-s'))) {
      const str = args + '';
      const array = str.split(' ');
      let int = array[1];
      size = parseInt(int);
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: 'Your Avatar:',
          url: `${msg.author.avatarURL ? msg.author.dynamicAvatarURL(format, size) : msg.author.defaultAvatarURL}`,
          description: `**[Click here for direct image link](${msg.author.avatarURL ? msg.author.dynamicAvatarURL(format, size) : msg.author.defaultAvatarURL})**`,
          image: {
            url: `${msg.author.avatarURL ? msg.author.dynamicAvatarURL(format, size) : msg.author.defaultAvatarURL}`
          }
        }
      }).catch((err) => this.catchMessage(err, msg));
    } else {
      const str = args + '';
      const array = str.split(/ ?\| ?/);
      let member = array[0];
      let int = array[1];
      size = parseInt(int);
      if (!int)
        size = 2048;
      const user = this.findMember(msg, member);
      if (!user) return msg.channel.createMessage({
        embed: {
          color: config.errorColor,
          description: 'That is not a valid guild member. Need to specify a name, ID or mention the user.'
        }
      }).catch((err) => this.catchMessage(err, msg));
      const id = msg.channel.guild.members.get(user.id);
      msg.channel.createMessage({
        embed: {
          color: config.defaultColor,
          title: `${id.username}'s Avatar:`,
          url: `${user.avatarURL ? user.dynamicAvatarURL(format, size) : user.defaultAvatarURL}`,
          description: `**[Click here for direct image link](${user.avatarURL ? user.dynamicAvatarURL(format, size) : user.defaultAvatarURL})**`,
          image: {
            url: `${user.avatarURL ? user.dynamicAvatarURL(format, size) : user.defaultAvatarURL}`
          }
        }
      }).catch((err) => this.catchMessage(err, msg));
    }
  }
};