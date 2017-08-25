const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError,
    axios = require('axios');

module.exports = {
    desc: "",
    usage: "",
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
                handleError(bot, err);
            });
        msg.channel.createMessage(msg.author.mention + ', This command is not available at the time.')
            .catch(err => {
                handleError(bot, err);
            });
        /*
        axios.get(`https://kitsu.io/api/edge/anime?filter[text]="${args}"&page[offset]=0`)
            .then(res => {
                const main = res.data.data[0],
                    att = res.data.data[0].attributes,
                    rel = res.data.data[0].relationships;
            })
            .catch(err => {
                logger.error(`Couldn't fetch the api:\n${err}`, 'ERROR')
            });
            */
    }
};
/*
{
    id: '11',
    type: 'anime',
    links: { self: 'https://kitsu.io/api/edge/anime/11' },
    attributes: {
        slug: 'naruto',
        synopsis: 'Moments prior to Naruto Uzumaki\'s birth, a huge demon known as the Kyuubi, the Nine-Tailed Fox, attacked Konohagakure, the Hidden Leaf Village, and wreaked havoc. In order to put an end to the Kyuubi\'s rampage, the leader of the village, the Fourth Hokage, sacrificed his life and sealed the monstrous beast inside the newborn Naruto.\r\nNow, Naruto is a hyperactive and knuckle-headed ninja still living in Konohagakure. Shunned because of the Kyuubi inside him, Naruto struggles to find his place in the village, while his burning desire to become the Hokage of Konohagakure leads him not only to some great new friends, but also some deadly foes.\r\n[Written by MAL Rewrite]',
        coverImageTopOffset: 209,
        titles: { en: 'Naruto', en_jp: 'Naruto', ja_jp: 'ナルト' },
        canonicalTitle: 'Naruto',
        abbreviatedTitles: ['NARUTO'],
        averageRating: '75.02',
        ratingFrequencies: {
            '2': '197',
            '3': '0',
            '4': '317',
            '5': '0',
            '6': '276',
            '7': '1',
            '8': '715',
            '9': '3',
            '10': '1318',
            '11': '5',
            '12': '3298',
            '13': '12',
            '14': '3702',
            '15': '22',
            '16': '4042',
            '17': '15',
            '18': '1624',
            '19': '3',
            '20': '4768'
        },
        userCount: 31124,
        favoritesCount: 910,
        startDate: '2002-10-03',
        endDate: '2007-02-08',
        popularityRank: 28,
        ratingRank: 1299,
        ageRating: 'PG',
        ageRatingGuide: 'Teens 13 or older',
        subtype: 'TV',
        status: 'finished',
        posterImage: {
            tiny: 'https://media.kitsu.io/anime/poster_images/11/tiny.jpg?1417705323',
            small: 'https://media.kitsu.io/anime/poster_images/11/small.jpg?1417705323',
            medium: 'https://media.kitsu.io/anime/poster_images/11/medium.jpg?1417705323',
            large: 'https://media.kitsu.io/anime/poster_images/11/large.jpg?1417705323',
            original: 'https://media.kitsu.io/anime/poster_images/11/original.jpg?1417705323'
        },
        coverImage: {
            tiny: 'https://media.kitsu.io/anime/cover_images/11/tiny.jpg?1417993200',
            small: 'https://media.kitsu.io/anime/cover_images/11/small.jpg?1417993200',
            large: 'https://media.kitsu.io/anime/cover_images/11/large.jpg?1417993200',
            original: 'https://media.kitsu.io/anime/cover_images/11/original.jpg?1417993200'
        },
        episodeCount: 220,
        episodeLength: 23,
        youtubeVideoId: 'j2hiC9BmJlQ',
        showType: 'TV',
        nsfw: false
    },
    relationships: {
        genres: { links: [Object] },
        categories: { links: [Object] },
        castings: { links: [Object] },
        installments: { links: [Object] },
        mappings: { links: [Object] },
        reviews: { links: [Object] },
        mediaRelationships: { links: [Object] },
        episodes: { links: [Object] },
        streamingLinks: { links: [Object] },
        animeProductions: { links: [Object] },
        animeCharacters: { links: [Object] },
        animeStaff: { links: [Object] }
    }
}
*/