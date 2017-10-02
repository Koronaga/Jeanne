const reload = require('require-reload'),
  config = reload('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  mm = require('mario-maker');

module.exports = {
  desc: "Get info about a course.",
  usage: "<course_id> (e.g. AA64-0000-000F-7D4C)",
  aliases: ['mm'],
  cooldown: 5,
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
    mariomakerTimesUsed++
    /**
     * courseID check
     * @param {string} courseID - The course id
     * @param {RegExp} courseID_check - Regex for the course id
     * @param {RegExp} regex - Create new RegExp from courseID_check
     */
    const courseID = args,
      courseID_check = /^[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}$/,
      regex = new RegExp(courseID_check);
    if (!courseID.match(regex)) return bot.createMessage(msg.channel.id, `${msg.author.mention}, That is **not** a valid course id.`)
      .catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    mm.getCourse(courseID, function (error, response, json) {
      if (!error && response.statusCode == 200) {
        bot.createMessage(msg.channel.id, {
          content: ``,
          embed: {
            color: config.defaultColor,
            author: {
              name: `${json.course_title}`,
              url: ``,
              icon_url: ``
            },
            description: `\u200B`,
            fields: [{
                name: `Difficulty`,
                value: `${json.difficulty}`,
                inline: true
              },
              {
                name: `Clear rate`,
                value: `${json.clear_rate}%`,
                inline: true
              },
              {
                name: `Clears`,
                value: `${json.clears}`,
                inline: true
              },
              {
                name: `Attempts`,
                value: `${json.attempts}`,
                inline: true
              },
              {
                name: `Stars`,
                value: `${json.stars}`,
                inline: true
              },
              {
                name: `Tag`,
                value: `${json.tag}`,
                inline: true
              },
              {
                name: `Creator name`,
                value: `${json.creator_name}`,
                inline: true
              },
              {
                name: `Created at`,
                value: `${json.created_at}`,
                inline: true
              },
              {
                name: `\u200B`,
                value: `\u200B`,
                inline: true
              },
              {
                name: `World record name`,
                value: `${json.world_record.name}`,
                inline: true
              },
              {
                name: `World record time`,
                value: `${json.world_record.time}`,
                inline: true
              },
              {
                name: `\u200B`,
                value: `\u200B`,
                inline: true
              },
              {
                name: `First clear`,
                value: `${json.first_clear.name == null ? `n/a` : ''}${json.first_clear.name != null ? json.first_clear.name : ''}`,
                inline: true
              },
              {
                name: `Recent player`,
                value: `${json.recent_players.user_name == undefined ? `n/a` : ''}${json.recent_players.user_name != undefined ? json.recent_players.user_name : ''}`,
                inline: true
              },
              {
                name: `\u200B`,
                value: `\u200B`,
                inline: true
              }
            ],
            image: {
              url: `${json.course_img_full}`
            }
          }
        }).catch(err => {
          handleError(bot, __filename, msg.channel, err);
        });
      } else {
        const errMessage = 'ERROR' + response.statusCode;
        handleError(bot, __filename, msg.channel, err);
      }
    });
  }
};