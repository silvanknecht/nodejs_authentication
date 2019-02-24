const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration'); // the index file gets fetched automatically as the first option!

signToken = user => {
    // Create token
    // Payload, Secret => encode the token: only here that the server knows that the token has been issued by us and has not been manipulated
    return JWT.sign({
        iss: 'SilvanKnecht',
        sub: user.id, // Connects the token to the user -> e.g UserID
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1) // current date + 1 day
    }, JWT_SECRET);
};


module.exports = {

    signUp: async function (req, res, next) {
        console.log(`UserController.signUp() called`);
        const {
            email,
            password
        } = req.value.body;
        // Check if there is a user with the same email
        // function should be await

        const foundUser = await User.findOne({
            email
        }); //ES6 same as email:email
        if (foundUser) {
            return res.status(409).json({
                error: 'Email is already in use'
            });
        }
        // Create a new User
        const newUser = new User({
            email,
            password
        }); //ES6 same as email:email, password: password

        // should be await
        await newUser.save();

        // Generate token
        const token = signToken(newUser);


        // Respond with token
        res.status(200).json({
            token
        });
    },


    signIn: async function (req, res, next) {
        //req.user gives access to the user object
        console.log(`Successful login!`);
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({token});

    },

    secret: async function (req, res, next) {
        console.log('I got the secret');
        res.json({ secret: req.user});
    }

};