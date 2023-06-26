const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// get request to spotify's authorization page
// no request to send because authorizeUser redirects
router.get('/login', userController.verifyUser)

router.get('/callback', userController.authorizeUser);

module.exports = router;