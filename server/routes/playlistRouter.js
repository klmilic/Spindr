const express = require('express');
const playlistController = require('../controllers/PlaylistController');

const router = express.Router();

// create empty playlist to hold swiped-right songs
router.get('/', playlistController.createPlaylist, (req, res) => {
    return res.status(200).json(res.locals.wholePlaylist);
});

// add song to playlist
router.post('/', playlistController.addToPlaylist, (req, res) => {
    return res.status(200).json({success: true});
});

// delete song from playlist
router.delete('/', playlistController.deleteToPlaylist, (req, res) => {
    return res.status(200).json({success: true});
});

// delete all songs from Spindr playlist once playlist has been added to Spotify
router.delete('/all', playlistController.deleteAll, (req, res) => {
    return res.status(200).json({success: true});
});

// get song recommendations
router.get('/recommendations', playlistController.getRecommendations, (req, res) => {
    return res.status(200).json({success: true});
});

module.exports = router;