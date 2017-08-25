const handleError = require('../../utils/utils.js').handleError,
    moment = require('../../node_modules/moment');

module.exports = {
    desc: "Use a webhook to send an announcement to a channel.",
    usage: "<channel_id> | <announcement>",
    guildOnly: true,
    hidden: true,
    ownerOnly: true,
    task(bot, msg, args) {
        const array = args.split(/ ?\| ?/),
            channel_id = array[0],
            announcement = array[1];
        bot.getChannelWebhooks(channel_id)
            .then(res => {
                /* Stringify our result to check if it exists */
                let data = JSON.stringify(res[0]);
                if (!data) {
                    /* Check if the guild and member object exists */
                    const channelGuild = bot.guilds.get(bot.channelGuildMap[channel_id]);
                    if (!channelGuild) return console.log('No guild found.');
                    const botMember = channelGuild.members.get(bot.user.id);
                    if (!botMember) return console.log('No member found.');
                    /* Check for the required permissions */
                    const manageWebhooks = botMember.permission.has('manageWebhooks');
                    const sendMessages = botMember.permission.has('sendMessages');
                    const embedLinks = botMember.permission.has('embedLinks');
                    if (sendMessages === false) return msg.channel.createMessage('I did not have the `Send Messages` permission')
                        .catch(err => {
                            handleError(bot, err);
                        });
                    if (embedLinks === false) return msg.channel.createMessage('I did not have the `Embed Links` permission')
                        .catch(err => {
                            handleError(bot, err);
                        });
                    if (manageWebhooks === false) return msg.channel.createMessage('I did not have the `Manage Webhooks` permission')
                        .catch(err => {
                            handleError(bot, err);
                        });
                    /* Create new channel webhook because there are none */
                    bot.createChannelWebhook(channel_id, { name: 'Announcements' }, 'announce')
                        .then(res => {
                            /* Use the newly created webhook to send the annoucement */
                            bot.executeWebhook(res.id, res.token, {
                                    embeds: [{
                                        color: 6784158,
                                        title: `📣 Announcement [ ${moment().utc().format('dddd - DD/MM/YYYY | kk:mm:ss')} UTC ]`,
                                        description: `${announcement}`,
                                    }],
                                    username: `${bot.user.username}`,
                                    avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`,

                                })
                                .catch(err => {
                                    handleError(bot, err);
                                });
                        })
                        .catch(err => {
                            handleError(bot, err);
                        });
                } else {
                    /* Parse our data again so we can use it */
                    data = JSON.parse(data);
                    /* Send the announcement with the first webhook we find in the specified channel */
                    bot.executeWebhook(data.id, data.token, {
                            embeds: [{
                                color: 6784158,
                                title: `📣 Announcement [ ${moment().utc().format('dddd - DD/MM/YYYY | kk:mm:ss')} UTC ]`,
                                description: `${announcement}`,
                            }],
                            username: `${bot.user.username}`,
                            avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`,

                        })
                        .catch(err => {
                            handleError(bot, err);
                        });
                }
            })
            .catch(err => {
                handleError(bot, err);
            });
    }
};