const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;
let connections = [];

module.exports = {
    desc: "Stream listen.moe to a voice channel.",
    usage: "<join/leave>",
    cooldown: 5,
    guildOnly: true,
    task(bot, msg, args, config, settingsManager) {
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
                handleError(bot, err);
            });
        if (!args) return 'wrong usage';
        const command = args.toLowerCase();
        if (command === 'join') {
            /* JOIN COMMAND */
            radioJoinTimesUsed++
            let member = msg.member;
            let channelID = member.voiceState ? member.voiceState.channelID : null;
            let channel = msg.channel.guild.channels.get(channelID);
            let guildID = msg.channel.guild ? msg.channel.guild.id : null;
            if (!channelID) {
                return msg.channel.createMessage('Join a voice channel first!');
            } else if (!guildID) {
                return;
            } else {
                let cc = bot.voiceConnections.get(guildID);
                if (cc) {
                    cc.switchChannel(channelID);
                } else {
                    bot.joinVoiceChannel(channelID)
                        .then(vc => {
                            connections.push(vc);
                            vc.updateVoiceState(false, false);
                            let realGuild = bot.guilds.get(guildID);
                            console.log(`Added voice connection for guild ${realGuild.name} (${guildID})`);
                            msg.channel.createMessage('Joined <#' + channelID + '> and started streaming listen.moe!')
                                .then(() => {
                                    vc.play(config.stream);
                                })
                                .catch(err => {
                                    handleError(bot, err);
                                });
                        })
                        .catch(error => {
                            console.log('Error connecting to channel ' + channel.name + ' | ' + error);
                        });
                }
            }
        } else if (command === 'leave') {
            /* LEAVE COMMAND */
            radioLeaveTimesUsed++
            let member = msg.member
            let channelID = member.voiceState ? member.voiceState.channelID : null
            let channel = msg.channel.guild.channels.get(channelID);
            let guildID = msg.channel.guild ? msg.channel.guild.id : null;
            if (!channelID) {
                msg.channel.createMessage('You are not in a voice channel.')
                    .catch(err => {
                        handleError(bot, err);
                    });
            } else {
                let vc = bot.voiceConnections.find((vc) => vc.id === msg.channel.guild.id);
                if (vc) {
                    bot.leaveVoiceChannel(channelID);
                    bot.voiceConnections.remove(vc);
                    msg.channel.createMessage('Left <#' + channelID + '>')
                        .catch(err => {
                            handleError(bot, err);
                        });
                }
            }
        } else if (command === 'np') {

        } else {
            return 'wrong usage';
        }
    }
};