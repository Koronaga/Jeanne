const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError;
moment = require('../../node_modules/moment');

module.exports = {
    desc: "Shows info, roles or emotes of the guild it's used in.",
    usage: "<info/roles/emotes>",
    aliases: ['server'],
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
        args = args.toString();
        args = args.toLowerCase();
        if (args === 'info') {
            guildinfoTimesUsed++
            const afkTimer = msg.channel.guild.afkTimeout / 60,
                owner = msg.channel.guild.members.get(msg.channel.guild.ownerID),
                roles = msg.channel.guild.roles.map(c => c).length,
                emotes = msg.channel.guild.emojis.length,
                guildRegion = msg.channel.guild.region,
                afkChanID = msg.channel.guild.afkChannelID,
                createdOn = moment(msg.channel.guild.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss') + ' UTC ' + '(' + moment(msg.channel.guild.createdAt).fromNow() + ')',
                verificationLevel = msg.channel.guild.verificationLevel,
                defChan = msg.channel.guild.defaultChannel,
                total = msg.channel.guild.memberCount,
                bots = msg.channel.guild.members.filter(user => user.user.bot).length,
                humans = total - bots,
                humanper = humans / total * 100,
                botper = bots / total * 100;
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    type: 'rich',
                    author: {
                        name: `Guild info of ${msg.channel.guild.name === null ? `` : ''}${msg.channel.guild.name !== null ? msg.channel.guild.name : ''}`,
                        icon_url: `${msg.channel.guild.iconURL === null ? `` : ''}${msg.channel.guild.iconURL !== null ? msg.channel.guild.iconURL : ''}`
                    },
                    description: ``,
                    thumbnail: {
                        url: `${msg.channel.guild.iconURL === null ? `` : ''}${msg.channel.guild.iconURL !== null ? msg.channel.guild.iconURL : ''}`
                    },
                    fields: [{
                            name: `Total Members:`,
                            value: `${total === null ? `n/a` : ''}${total !== null ? total : ''}`,
                            inline: false
                        },
                        {
                            name: `Bots:`,
                            value: `${bots === null ? `n/a` : ''}${bots !== null ? bots : ''}, ${botper === null ? `` : ''}${botper !== null ? this.round(botper, 2)+'%' : ''}`,
                            inline: true
                        },
                        {
                            name: `Humans:`,
                            value: `${humans === null ? `n/a` : ''}${humans !== null ? humans : ''}, ${humanper === null ? `` : ''}${humanper !== null ? this.round(humanper, 2)+'%' : ''}`,
                            inline: true
                        },
                        {
                            name: `Default Channel:`,
                            value: `${defChan === null ? `n/a` : ''}${defChan !== null ? defChan.mention : ''}`,
                            inline: true
                        },
                        {
                            name: `Guild Region:`,
                            value: `${guildRegion === null ? `n/a` : ''}${guildRegion !== null ? guildRegion : ''}`,
                            inline: true
                        },
                        {
                            name: `Guild ID:`,
                            value: `${msg.channel.guild.id}`,
                            inline: true
                        },
                        {
                            name: `Verification Level:`,
                            value: `${verificationLevel === null ? `n/a` : ''}${verificationLevel !== null ? verificationLevel : ''}`,
                            inline: true
                        },
                        {
                            name: `AFK Timeout:`,
                            value: `${afkTimer === null ? `n/a` : ''}${afkTimer !== null ? afkTimer+'min' : ''}`,
                            inline: true
                        },
                        {
                            name: `AFK Channel:`,
                            value: `${afkChanID === null ? `n/a` : ''}${afkChanID !== null ? '<#'+afkChanID+'>' : ''}`,
                            inline: true
                        },
                        {
                            name: `Created On:`,
                            value: `${createdOn === null ? `n/a` : ''}${createdOn !== null ? createdOn : ''}`
                        },
                        {
                            name: `Guild Owner:`,
                            value: `${owner.username}#${owner.discriminator} (${msg.channel.guild.ownerID})`
                        },
                        {
                            name: `Roles:`,
                            value: `${roles === null ? `n/a` : ''}${roles !== null ? roles : ''}`,
                            inline: true
                        },
                        {
                            name: `Emotes:`,
                            value: `${emotes === null ? `n/a` : ''}${emotes !== null ? emotes : ''}`,
                            inline: true
                        }
                    ]
                }
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else if (args === 'roles') {
            guildrolesTimesUsed++
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: `All guild roles:`,
                        url: ``,
                        icon_url: ``
                    },
                    description: `${msg.channel.guild.roles.map(c => c.name).join(', ')}`
                }
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else if (args === 'emotes') {
            guildemotesTimesUsed++
            bot.createMessage(msg.channel.id, {
                content: ``,
                embed: {
                    color: config.defaultColor,
                    author: {
                        name: `All guild emotes:`,
                        url: ``,
                        icon_url: ``
                    },
                    description: `<:${msg.channel.guild.emojis.map(c => c.name + ":" + c.id).join('> <:')}>`
                }
            }).catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
        } else {
            return 'wrong usage';
        }
    }
};