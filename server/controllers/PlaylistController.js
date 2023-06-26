const User = require("../models/UserModel");

const playlistController = {};

// create empty playlist to hold swiped-right songs
playlistController.createPlaylist = (req, res, next) => {
  const spotifyAuthState = req.cookies.spotify_auth_state;
  User.findOne({spotifyAuthState: spotifyAuthState})
    .then(user => {
      if (user) {
        res.locals.wholePlaylist = user;
        return next();
      }
      else {
        User.create({ favList: [], spotifyAuthState:  spotifyAuthState})
          .then((docs) => {
            res.locals.wholePlaylist = docs;
            return next();
          })
          .catch((err) => console.log("Error in createPlaylist: ", err));
      }
    })
};

playlistController.getPlaylist = (req, res, next) => {
  const spotifyAuthState = req.cookies.spotify_auth_state;
  User.find({})
    .then((result) => {
      if (result.length === 0) {
        User.create({ favList: [], spotifyAuthState: spotifyAuthState })
          .then((newList) => {
            res.locals.wholePlaylist = newList;
            return next();
          })
          .catch((err) => console.log("Error in creating an empty list"));
      } else {
        res.locals.wholePlaylist = result;
        return next();
      }
    })
    .catch((err) => console.log("Error in getPlaylist"));
};

playlistController.addToPlaylist = (req, res, next) => {
  const { song } = req.body;
  const { trackName, artistName, albumImg, trackUri, previewUrl } = song;

  User.updateOne(
    {spotifyAuthState: req.cookies.spotify_auth_state},
    {
      $push: {
        favList: { trackName, artistName, albumImg, trackUri, previewUrl },
      },
    }
  )
    .then((result) => {
      res.locals.addedData = result;
      return next();
    })
    .catch((err) => console.log("Error in createPlaylist"));
};

playlistController.deleteToPlaylist = (req, res, next) => {
  User.updateOne({spotifyAuthState: req.cookies.spotify_auth_state}, { $set: { favList: [] } })
    .then((result) => {
      res.locals.deleteData = result;
      return next();
    })  
    .catch(console.log("Error in deleteToPlaylist"));
};


playlistController.deleteAll = (req,res,next) => {
  User.deleteMany({}).then(result => {
    return next();
  }).catch(err => {
    console.log("Error in deleteAll: ", err)
  });
}

playlistController.getRecommendations = (req, res, next) => {
  // res.set('Access-Control-Allow-Origin', '*');
  const { genres } = req.body;
  //if access token exists in req cookie then assign it, otherwise set it to null
  const access_token = req.cookies ? req.cookies['access_token'] : null;

  //check to see if token exists
  if (!access_token) {
    return res.send('NO TOKENS HERE, TRY AGAIN.');
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(access_token);

  spotifyApi
    .getRecommendations({
      seed_genres: 'pop,chill', // <-- hard coded, change to replace with user preference through frontend
      max_popularity: 60,
    })
    .then((data) => {
      const recs = data.body;

      let trackDetails = []; //array to store all 20 found uris of tracks from api call

      recs.tracks.forEach((track) => {
        //only store tracks that have preview URLs
        if (track.preview_url !== null) {
          trackDetails.push({
            trackName: track.name,
            artistName: track.artists[0].name,
            albumImg: track.album.images[0], //get the largest size of album img for track, obj contains url and height/width
            trackUri: track.uri,
            previewUrl: track.preview_url,
          });
        }
      });

      const recTracks = {
        tracks: recs.tracks, //full object just in case react app needs it
        trackDetails, //obj containing most necessary details for react app
      };
      res.json(recTracks);
    })
    .catch((error) => {
      console.error('THIS IS THE ERROR: ', error);
    });
}

module.exports = playlistController;
