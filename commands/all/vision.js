const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    Vision = require('@google-cloud/vision'),
    jeanneVision = require('../../Jeanne-ca41da280a76.json');

const visionClient = new Vision({
    projectId: `${jeanneVision.project_id}`,
    keyFilename: `/home/kurozero/Desktop/Jeanne/Jeanne-ca41da280a76.json`
    // /home/kurozero/Desktop/Jeanne/Jeanne-ca41da280a76.json
    // D:/JeanneDev/Jeanne-ca41da280a76.json
});

module.exports = {
    desc: "Check an image.",
    usage: "<img_url>",
    cooldown: 5,
    guildOnly: true,
    hidden: true,
    task(bot, msg, args) {
        if (!args) return 'wrong usage';
        const image = {
            source: {
                imageUri: `${args}`
            }
        };
        visionClient.safeSearchDetection(image)
            .then(res => {
                const data = res[0].safeSearchAnnotation;
                msg.channel.createMessage({
                        content: ``,
                        embed: {
                            color: config.defaultColor,
                            title: `Google Cloud Vision API`,
                            description: `Adult: ${data.adult}\n` +
                                `Meme: ${data.spoof}\n` +
                                `Medical: ${data.medical}\n` +
                                `Violence: ${data.violence}`
                        }
                    })
                    .catch(err => {
                        handleError(bot, __filename, msg.channel, err);
                    });
            })
            .catch(err => {
                handleError(bot, __filename, msg.channel, err);
            });
    }
};