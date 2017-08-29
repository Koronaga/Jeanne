const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    ytSearch = require('youtube-search');

module.exports = {
    desc: "Search for a youtube video.",
    usage: "<query>",
    aliases: ['ytsearch', 'ytsrch'],
    cooldown: 5,
    guildOnly: true,
    async: (bot, msg, args) => {
        youtubesearchTimesUsed++
        const opts = {
            maxResults: 50,
            key: config.ytsearch_key
        };
        ytSearch(args, opts, (err, res, pageInfo) => {
            if (err) {
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: 0xff0000,
                            description: '<:No:348047201152532480> **Error when searching for a video, please try again.**\n',
                            fields: [{
                                name: `Support Guild`,
                                value: `https://discord.gg/Vf4ne5b`
                            }]
                        }
                    })
                    .catch(err => {
                        handleError(bot, __filename, msg.channel, err);
                    });
                handleError(bot, __filename, msg.channel, err);
                return;
            }
            const videoInfo = res[Math.floor(Math.random() * res.length)]; // returns 1 result from the first 50 results it can find
            if (!videoInfo) return msg.channel.createMessage({
                content: ``,
                embed: {
                    color: config.defaultColor,
                    title: `ERROR`,
                    description: `No video's were found for **${args}**`
                }
            })
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
            let publishedAt = videoInfo.publishedAt;
            publishedAt = publishedAt.slice(0, 10);
            let infoKind = videoInfo.kind;
            infoKind = infoKind.slice(8);
            msg.channel.createMessage({
                    content: ``,
                    embed: {
                        color: config.defaultColor,
                        author: {
                            name: `${videoInfo.title}`,
                            url: `${videoInfo.link}`
                        },
                        thumbnail: {
                            url: `${videoInfo.thumbnails.default.url}`
                        },
                        description: `${videoInfo.description}`,
                        fields: [{
                                name: `Channel Title`,
                                value: `${videoInfo.channelTitle}`,
                                inline: true
                            },
                            {
                                name: `Kind`,
                                value: `${infoKind}`,
                                inline: true
                            },
                            {
                                name: `Channel Link`,
                                value: `https://www.youtube.com/channel/${videoInfo.channelId}`,
                                inline: false
                            },
                            {
                                name: `Published At`,
                                value: `${publishedAt}`,
                                inline: false
                            }
                        ]
                    }
                })
                .catch(err => {
                    handleError(bot, __filename, msg.channel, err);
                });
        });
    }
};