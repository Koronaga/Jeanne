const reload = require('require-reload'),
    config = reload('../../config.json'),
    handleError = require('../../utils/utils.js').handleError,
    handleMsgError = require('../../utils/utils.js').handleMsgError;

module.exports = {
    desc: "Get all the stats ",
    usage: "<page_number> \` (total of 6 pages in alphabetical order)",
    aliases: ['cmdusage'],
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
                handleError(err);
            });
        if (!args) return 'wrong usage';
        cmdusageTimesUsed++
        if (args === '1') {
            msg.channel.createMessage(`\`\`\`
Total           -   ${commandsProcessed}

j:9gag          -   ${gagTimesUsed}
j:about         -   ${aboutTimesUsed}
j:aesthetic     -   ${aestheticTimesUsed}
j:anime         -   ${animeTimesUsed}
j:animelist     -   ${animelistTimesUsed}
j:asciicat      -   ${asciicatTimesUsed}
j:ass           -   ${assTimesUsed}
j:avatar        -   ${avatarTimesUsed}
j:ban           -   ${banTimesUsed}
j:boobs         -   ${boobsTimesUsed}
j:booru         -   ${booruTimesUsed}
j:bot           -   ${botTimesUsed}
j:bullshit      -   ${bullshitTimesUsed}
j:cat           -   ${catTimesUsed}
j:catfacts      -   ${catfactsTimesUsed}
j:catgirl sfw   -   ${catgirlSFWTimesUsed}
j:catgirl nsfw  -   ${catgirlNSFWTimesUsed}
j:changelog     -   ${changelogTimesUsed}
j:channelinfo   -   ${channelinfoTimesUsed}
j:character     -   ${characterTimesUsed}

page 1/6
\`\`\``).catch(err => {
                handleError(err);
            });
        } else if (args === '2') {
            msg.channel.createMessage(`\`\`\`
Total               -   ${commandsProcessed}

j:choose            -   ${chooseTimesUsed}
j:cleverbot         -   ${cleverbotTimesUsed} (includes @mention cleverbot)
j:coinflip          -   ${coinflipTimesUsed}
j:color             -   ${colorTimesUsed}
j:commandusage      -   ${cmdusageTimesUsed}
j:cry               -   ${cryTimesUsed}
j:cuddle            -   ${cuddleTimesUsed}
j:currency          -   ${currencyTimesUsed}
j:ddgsearch         -   ${ddgsearchTimesUsed}
j:destiny           -   ${destinyTimesUsed}
j:discriminator     -   ${discriminatorTimesUsed}
j:emote             -   ${emoteTimesUsed}
j:facerecognition   -   ${facerecognitionTimesUsed}
j:findinvite        -   ${findinviteTimesUsed}
j:funinsult         -   ${funinsultTimesUsed}
j:gif               -   ${gifTimesUsed}
j:google            -   ${googleTimesUsed}
j:guild info        -   ${guildinfoTimesUsed}
j:guild emotes      -   ${guildemotesTimesUsed}
j:guild roles       -   ${guildrolesTimesUsed}

page 2/6
\`\`\``).catch(err => {
                handleError(err);
            });
        } else if (args === '3') {
            msg.channel.createMessage(`\`\`\`
Total           -   ${commandsProcessed}

j:hackban       -   ${hackbanTimesUsed}
j:hearthstone   -   ${hearthstoneTimesUsed}
j:howto         -   ${howtoTimesUsed}
j:hug           -   ${hugTimesUsed}
j:ibsearch      -   ${ibsearchTimesUsed}
j:imdb          -   ${imdbTimesUsed}
j:insult        -   ${insultTimesUsed}
j:invite        -   ${inviteTimesUsed}
j:kick          -   ${kickTimesUsed}
j:kill          -   ${killTimesUsed}
j:kiss          -   ${kissTimesUsed}
j:league        -   ${leagueTimesUsed}
j:leave         -   ${leaveTimesUsed}
j:leetspeak     -   ${leetspeakTimesUsed}
j:lenny         -   ${lennyTimesUsed}
j:level         -   ${levelTimesUsed}
j:lewd          -   ${lewdTimesUsed}
j:lick          -   ${lickTimesUsed}
j:lmgtfy        -   ${lmgtfyTimesUsed}
j:lvlupmessage  -   ${lvlupmessageTimesUsed}
j:manga         -   ${mangaTimesUsed}

page 3/6
\`\`\``).catch(err => {
                handleError(err);
            });
        } else if (args === '4') {
            msg.channel.createMessage(`\`\`\`
Total           -   ${commandsProcessed}

j:mariomaker    -   ${mariomakerTimesUsed}
j:morse         -   ${morseTimesUsed}
j:nom           -   ${nomTimesUsed}
j:notkawaii     -   ${notkawaiiTimesUsed}
j:nyan          -   ${nyanTimesUsed}
j:oldinslut     -   ${oldinsultTimesUsed}
j:osu           -   ${osuTimesUsed}
j:overwatch     -   ${overwatchTimesUsed}
j:owo           -   ${owoTimesUsed}
j:pat           -   ${patTimesUsed}
j:permission    -   ${permissionsTimesUsed}
j:pin           -   ${pinTimesUsed}
j:ping          -   ${pingTimesUsed}
j:pokemon       -   ${pokemonTimesUsed}
j:porn          -   ${pornTimesUsed}
j:pout          -   ${poutTimesUsed}
j:prune         -   ${pruneTimesUsed}
j:pun           -   ${punTimesUsed}
j:pussy         -   ${pussyTimesUsed}
j:radio join    -   ${radioJoinTimesUsed}

page 4/6
\`\`\``).catch(err => {
                handleError(err);
            });
        } else if (args === '5') {
            msg.channel.createMessage(`\`\`\`
Total           -   ${commandsProcessed}

j:radio leave   -   ${radioLeaveTimesUsed}
j:raffle        -   ${raffleTimesUsed}
j:r6siege       -   ${rainbowsixsiegeTimesUsed}
j:randomtext    -   ${randomtextTimesUsed}
j:rate          -   ${rateTimesUsed}
j:reaction      -   ${reactionTimesUsed}
j:remind        -   ${remindTimesUsed}
j:respect       -   ${respectTimesUsed}
j:reverse       -   ${reverseTimesUsed}
j:roleinfo      -   ${roleinfoTimesUsed}
j:roll          -   ${rollTimesUsed}
j:rps           -   ${rpsTimesUsed}
j:say           -   ${sayTimesUsed}
j:sayd          -   ${saydTimesUsed}
j:settings      -   ${settingsTimesUsed}
j:sfwbooru      -   ${sfwbooruTimesUsed}
j:slap          -   ${slapTimesUsed}
j:smug          -   ${smugTimesUsed}
j:softban       -   ${softbanTimesUsed}
j:spin          -   ${spinTimesUsed}

page 5/6
\`\`\``).catch(err => {
                handleError(err);
            });
        } else if (args === '6') {
            msg.channel.createMessage(`\`\`\`
Total           -   ${commandsProcessed}

j:stare         -   ${stareTimesUsed}
j:stats         -   ${statsTimesUsed}
j:steam         -   ${steamTimesUsed}
j:suggest       -   ${suggestTimesUsed}
j:support       -   ${supportTimesUsed}
j:throw         -   ${throwTimesUsed}
j:tickle        -   ${tickleTimesUsed}
j:translate     -   ${translateTimesUsed}
j:triggered     -   ${triggeredTimesUsed}
j:twitch        -   ${twitchTimesUsed}
j:unban         -   ${unbanTimesUsed}
j:unicode       -   ${unicodeTimesUsed}
j:unpin         -   ${unpinTimesUsed}
j:unsplash      -   ${unsplashTimesUsed}
j:uptime        -   ${uptimeTimesUsed}
j:urban         -   ${urbanTimesUsed}
j:userinfo      -   ${userinfoTimesUsed}
j:votecheck     -   ${votecheckTimesUsed}
j:weather       -   ${weatherTimesUsed}
j:youtubeinfo   -   ${youtubeinfoTimesUsed}
j:youtubesearch -   ${youtubesearchTimesUsed}

page 6/6
\`\`\``).catch(err => {
                handleError(err);
            });
        }
    }
};