const JWT = require('jsonwebtoken');
const User = require('../models/user');
const {
    JWT_SECRET
} = require('../conf'); // the index file gets fetched automatically as the first option!

// debug
const debug = require('debug')('auth:userscontroller');

signToken = user => {
    // create token
    // payload, Secret => encode the token: only here that the server knows that the token has been issued by us and has not been manipulated
    return JWT.sign({
        iss: 'SilvanKnecht',
        sub: user.id, // connects the token to the user -> e.g UserID
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1) // current date + 1 day
    }, JWT_SECRET);
};


module.exports = {

    signUp: async function (req, res, next) {
        debug('signUp called');
        const {
            email,
            password
        } = req.value.body;

        // check if there is a user with the same email
        const foundUser = await User.findOne({
            "local.email": email
        }); //ES6 same as email:email

        if (foundUser) {
            debug('Email already in use');
            return res.status(409).json({
                error: 'Email is already in use'
            });
        }

        // create a new User
        const newUser = new User({
            methode: 'local',
            local: {
                email: email,
                password: password
            }
        }); //ES6 same as email:email, password: password

        await newUser.save();

        // generate token
        const token = signToken(newUser);


        // respond with token
        res.status(200).json({
            token
        });

        debug('SignUP successful');
    },


    signIn: async function (req, res, next) {

        // generate token
        const token = signToken(req.user);
        res.status(200).json({
            token
        });
        debug(`SignIn successful`);

    },

    // TODO: bring googleOAUTH and facebookOAuth together since they are the same function

    googleOAuth: async function(req, res, next) {
        // generate token
        const token = signToken(req.user);
        res.status(200).json({
            token
        });
        debug(`GoogleOAuth successful`);
    },

    facebookOAuth: async function(req, res, next) {
        // generate token

        const token = signToken(req.user);
        res.status(200).json({
            token
        });
        debug(`FacebookOAuth successful`);
    },


    githubOAuth: async function(req, res, next) {
        // generate token
        const token = signToken(req.user);
        res.status(200).json({
            token
        });
        debug(`GitHubOAuth successful`);
    },

    secret: async function (req, res, next) {

        res.json({
            secret: req.user
        });
        debug('Access to the secret granted');
    }

};