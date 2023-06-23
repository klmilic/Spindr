const User = require("../models/UserModel");

const playlistController = {};

// create empty playlist to hold swiped-right songs
playlistController.createPlaylist = (req, res, next) => {
  const spotifyAuthState = req.cookies.spotify_auth_state;
  User.findOne({spotifyAuthState: spotifyAuthState})
    .then(user => {
      if (user) {
        // console.log('user: ', user);
        // console.log('user exists');
        res.locals.wholePlaylist = user;
        return next();
      }
      else {
        // console.log('user does not exist');
        User.create({ favList: [], spotifyAuthState:  spotifyAuthState})
          .then((docs) => {
            // console.log('created new user in database');
            res.locals.wholePlaylist = docs;
            return next();
          })
          .catch((err) => console.log("Error in createPlaylist"));
      }
    })
};

playlistController.getPlaylist = (req, res, next) => {
  const spotifyAuthState = req.cookies.spotify_auth_state;
  // console.log("AUTH STATE: ", spotifyAuthState);
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
  // console.log(trackName, artistName, albumImg, traukUri, previewUrl);
  //console.log("song", song);
  User.updateOne(
    {spotifyAuthState: req.cookies.spotify_auth_state},
    {
      $push: {
        favList: { trackName, artistName, albumImg, trackUri, previewUrl },
      },
    }
  )
    .then((result) => {
      // console.log(result);
      res.locals.addedData = result;
      // console.log('result: ', result);
      return next();
    })
    .catch((err) => console.log("Error in createPlaylist"));
};

playlistController.deleteToPlaylist = (req, res, next) => {
  // const { song } = req.body;
  // User.delete({artistName, songName})
  //   .then(result => {
  //     res.locals.deleteData = result;
  //     return next();
  //   })
  //   .catch(console.log("Error in deletePlaylist"));
  // console.log("req.body", song);
  User.updateOne({spotifyAuthState: req.cookies.spotify_auth_state}, { $set: { favList: [] } })
    .then((result) => {
      res.locals.deleteData = result;
      return next();
    })  
    .catch(console.log("Error in deletePlaylist"));
};


playlistController.deleteAll = (req,res,next) => {
  User.deleteMany({}).then(result => {
    return next();
  }).catch(console.log("Error in deletePlaylist"));
}

module.exports = playlistController;
