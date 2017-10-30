const axios = require('axios'),
  config = require('../../config.json'),
  handleError = require('../../utils/utils.js').handleError,
  handleErrorNoMsg = require('../../utils/utils.js').handleErrorNoMsg,
  formatTimeForSpotify = require('../../utils/utils.js').formatTimeForSpotify;

module.exports = {
  desc: "Search for a spotify album, artist, playlist or track",
  usage: "<type> | <query>`\n`j:spotify typelist` to see all types",
  cooldown: 10,
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
        handleErrorNoMsg(bot, __filename, err);
      });
    if (!args) return 'wrong usage';

    const str = args + "";
    let array = str.split(/ ?\| ?/g),
      query = array[0],
      queryType = array[1];

    if (!query) return 'wrong usage';

    const lowerQuery = query.toLowerCase();
    if (lowerQuery !== 'typelist' && !queryType) return 'wrong usage';

    const queryTypePossibilities = 'album, artist, playlist, track';
    if (lowerQuery === 'typelist') return msg.channel.createMessage('**All the types that can be used:** \n' + queryTypePossibilities.split(', ').join('\n'))
      .catch(err => {
        handleErrorNoMsg(bot, __filename, err);
      });
    if (queryType) queryType = queryType.toLowerCase();
    if (!queryTypePossibilities.includes(queryType)) return msg.channel.createMessage('**Please use one of these types:** \n' + queryTypePossibilities.split(', ').join('\n'))
      .catch(err => {
        handleErrorNoMsg(bot, __filename, err);
      });

    axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      params: {
        grant_type: 'client_credentials'
      },
      headers: {
        'User-Agent': USERAGENT,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: config.spotify_clientID,
        password: config.spotify_clientSecret
      }
    }).then(res => {
      const token = res.data.access_token;
      const type = res.data.token_type;
      axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'User-Agent': USERAGENT,
          'Accept': 'application/json',
          'Authorization': type + ' ' + token
        },
        params: {
          q: query,
          type: queryType,
          limit: '1'
        }
      }).then(res => {
        if (queryType === 'album') {
          if (!res.data.albums.items[0]) return msg.channel.createMessage(`\\❌ No album was found for **${query}**`)
            .catch(err => {
              handleErrorNoMsg(bot, __filename, err);
            });
          const album = res.data.albums.items[0];
          let albumImage = '';
          if (album.images[0]) albumImage = album.images[0].url;
          msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              title: `${album.name}`,
              description: `\u200B`,
              thumbnail: {
                url: `${albumImage}`
              },
              fields: [{
                  name: `Artist`,
                  value: `[${album.artists[0].name}](${album.artists[0].external_urls.spotify})`,
                  inline: true
                },
                {
                  name: `Type`,
                  value: `${album.type}`,
                  inline: true
                },
                {
                  name: `Spotify Url`,
                  value: `${album.external_urls.spotify}`,
                  inline: false
                }
              ]
            }
          }).catch(err => {
            handleErrorNoMsg(bot, __filename, err);
          });
        } else if (queryType === 'artist') {
          if (!res.data.artists.items[0]) return msg.channel.createMessage(`\\❌ No artist was found for **${query}**`)
            .catch(err => {
              handleErrorNoMsg(bot, __filename, err);
            });
          const artist = res.data.artists.items[0];
          let genres = 'n/a';
          if (artist.genres) genres = artist.genres.join(', ');
          let artistImage = '';
          if (artist.images[0]) artistImage = artist.images[0].url;
          msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              title: `${artist.name}`,
              description: `\u200B`,
              thumbnail: {
                url: `${artistImage}`
              },
              fields: [{
                  name: `Popularity `,
                  value: `${artist.popularity}/100`,
                  inline: true
                },
                {
                  name: `Followers`,
                  value: `${artist.followers.total}`,
                  inline: true
                },
                {
                  name: `Type`,
                  value: `${artist.type}`,
                  inline: true
                },
                {
                  name: `Genres`,
                  value: `${genres}`,
                  inline: false
                },
                {
                  name: `Spotify Url`,
                  value: `${artist.external_urls.spotify}`,
                  inline: false
                }
              ]
            }
          }).catch(err => {
            handleErrorNoMsg(bot, __filename, err);
          });
        } else if (queryType === 'playlist') {
          if (!res.data.playlists.items[0]) return msg.channel.createMessage(`\\❌ No playlist was found for **${query}**`)
            .catch(err => {
              handleErrorNoMsg(bot, __filename, err);
            });
          const playlist = res.data.playlists.items[0];
          let playlistImage = '';
          if (playlist.images[0]) playlistImage = playlist.images[0].url;
          let ownerName = playlist.owner.id;
          if (playlist.owner.display_name) ownerName = playlist.owner.display_name;
          msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              title: `${playlist.name}`,
              description: `\u200B`,
              thumbnail: {
                url: `${playlistImage}`
              },
              fields: [{
                  name: `Owner`,
                  value: `[${ownerName}](${playlist.owner.external_urls.spotify})`,
                  inline: true
                },
                {
                  name: `Tracks`,
                  value: `${playlist.tracks.total}`,
                  inline: true
                },
                {
                  name: `isPublic`,
                  value: `${playlist.public}`,
                  inline: true
                },
                {
                  name: `Type`,
                  value: `${playlist.type}`,
                  inline: true
                },
                {
                  name: `Spotify Url`,
                  value: `${playlist.external_urls.spotify}`,
                  inline: false
                }
              ]
            }
          }).catch(err => {
            handleErrorNoMsg(bot, __filename, err);
          });
        } else if (queryType === 'track') {
          if (!res.data.tracks.items[0]) return msg.channel.createMessage(`\\❌ No track was found for **${query}**`)
            .catch(err => {
              handleErrorNoMsg(bot, __filename, err);
            });
          const track = res.data.tracks.items[0];
          let previewURL = 'n/a';
          if (track.preview_url) previewURL = `[click here](${track.preview_url})`;
          let trackImage = '';
          if (track.album.images[0]) trackImage = track.album.images[0].url;
          msg.channel.createMessage({
            content: ``,
            embed: {
              color: config.defaultColor,
              title: `${track.name}`,
              description: `Preview: ${previewURL}`,
              thumbnail: {
                url: `${trackImage}`
              },
              fields: [{
                  name: `Artist`,
                  value: `[${track.artists[0].name}](${track.artists[0].external_urls.spotify})`,
                  inline: true
                },
                {
                  name: `Duration`,
                  value: `${formatTimeForSpotify(track.duration_ms)}`,
                  inline: true
                },
                {
                  name: `Popularity `,
                  value: `${track.popularity}/100`,
                  inline: true
                },
                {
                  name: `Type`,
                  value: `${track.type}`,
                  inline: true
                },
                {
                  name: `Spotify Url`,
                  value: `${track.external_urls.spotify}`,
                  inline: false
                }
              ]
            }
          }).catch(err => {
            handleErrorNoMsg(bot, __filename, err);
          });
        } else {
          // something went wrong :thonk:
          return 'wrong usage';
        }
      }).catch(err => {
        handleError(bot, __filename, msg.channel, err);
      });
    }).catch(err => {
      handleErrorNoMsg(bot, __filename, err);
    });
  }
};