require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');

// spotify dev account details
const clientId = process.env.CLIENT_ID; 
const clientSecret = process.env.CLIENT_SECRET; 
const redirectUri = process.env.REDIRECT_URI;

// These define the parameters that the user will provide us access to.
// Additional scopes can be found here: https://developer.spotify.com/documentation/web-api/concepts/scopes
const scopes = [
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-playback-state',
    'user-modify-playback-state',
  ];

// generate random string to use in state property as recommended by Spotify authorization guidelines
const generateRandomString = (length) => {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  };

const userController = {
    // verify user
    verifyUser: (req, res, next) => {
        try {
            const state = generateRandomString(16); //need to generate random state string for security
            const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes.join(' ')}&redirect_uri=${redirectUri}&state=${state}`;
            // create authorization cookie set to randomly generated string
            res.cookie('spotify_auth_state', state);
            // redirect to spotify authorization url
            res.redirect(authorizationUrl); 
        }
        catch(err) {
            console.log('Error with userController (verifyUser function): ', err);
            next(err);
        }
    },

    // authorize user
    authorizeUser: async (req, res, next) => {
        try {
            const code = req.query.code || null; //pulling out the authorization code after OAuth
            const response = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                data: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                Authorization:
                    'Basic ' +
                    new Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
                },
            })
            if (response.status === 200) {
                const { access_token, token_type, refresh_token } = response.data;
                // create cookies to store spotify access data
                res.cookie('access_token', access_token, {
                  maxAge: 3600000, //cookie will expire in an hour
                });

                //this doesn't feel very DRY..
                res.cookie('token_type', token_type, {
                // httpOnly: true,
                // secure: true, //only transmit cookies over HTTPS
                maxAge: 3600000, //cookie will expire in an hour
                });

                res.cookie('refresh_token', refresh_token, {
                // httpOnly: true,
                // secure: true, //only transmit cookies over HTTPS
                maxAge: 3600000, //cookie will expire in an hour
                });

                const currentDomain = req.protocol + '://' + req.get('host');
                const redirectUrl = currentDomain + '/home';
                return res.redirect(redirectUrl);
                // next();
            } else {
                next(err);
              }
            }
        catch(err) {
            console.log('Error in userController (authorizeUser function): ', err);
            next(err);
        }
    }
}

module.exports = userController;