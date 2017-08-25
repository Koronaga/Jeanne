const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    youtubeVideoId = require('youtube-video-id'),
    fetchVideoInfo = require('youtube-info'),
    formatYTSeconds = require("../../utils/utils.js").formatYTSeconds;

module.exports = {
    desc: "Get info about a youtube video.",
    usage: "<youtube_url/video_id>",
    aliases: ['ytinfo'],
    cooldown: 5,
    guildOnly: true,
    task(bot, msg, args) {
        youtubeinfoTimesUsed++
        const youtubeID = youtubeVideoId(args);
        fetchVideoInfo(youtubeID)
            .then(videoInfo => {
                if (!videoInfo) return msg.channel.createMessage('\\❌ Could not get info on this video.')
                    .catch(err => {
                        handleError(bot, err);
                    });
                let desc = videoInfo.description;
                desc = desc.replace(/ ?\<br\> ?/g, '\n');
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            author: {
                                name: `${videoInfo.title}`,
                                url: `${videoInfo.url}`
                            },
                            thumbnail: {
                                url: `${videoInfo.thumbnailUrl}`
                            },
                            description: `${desc}`,
                            fields: [{
                                    name: `Owner`,
                                    value: `${videoInfo.owner}`,
                                    inline: true
                                },
                                {
                                    name: `Views`,
                                    value: `${videoInfo.views}`,
                                    inline: true
                                },
                                {
                                    name: `Paid`,
                                    value: `${videoInfo.paid}`,
                                    inline: true
                                },
                                {
                                    name: `Publish Date`,
                                    value: `${videoInfo.datePublished}`,
                                    inline: true
                                },
                                {
                                    name: `Genre`,
                                    value: `${videoInfo.genre}`,
                                    inline: true
                                },
                                {
                                    name: `Family Friendly`,
                                    value: `${videoInfo.isFamilyFriendly}`,
                                    inline: true
                                },
                                {
                                    name: `Duration`,
                                    value: `${formatYTSeconds(videoInfo.duration)}`,
                                    inline: false
                                },
                                {
                                    name: `Channel`,
                                    value: `https://www.youtube.com/channel/${videoInfo.channelId}`,
                                    inline: false
                                }
                            ]
                        }
                    })
                    .catch(err => {
                        handleError(bot, err);
                    });
            })
            .catch(err => {
                handleErrorLocal(err);
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.errorColor,
                            author: {
                                name: ``,
                                url: ``,
                                icon_url: ``
                            },
                            description: `\\❌ Could not get info on this video.\nMake sure you use the correct youtube url/video id!`,
                            fields: [{
                                name: `For support join:`,
                                value: `https://discord.gg/Vf4ne5b`,
                                inline: true
                            }]
                        }
                    })
                    .catch(err => {
                        handleErrorLocal(err);
                    });
            });
    }
};