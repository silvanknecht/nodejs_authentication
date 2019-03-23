const JWT = require("jsonwebtoken");

const User = require("../models/user");
const config = require("config");
const logger = require('../middleware/logger');

signToken = user => {
  // create token
  // payload, Secret => encode the token: only here that the server knows that the token has been issued by us and has not been manipulated
  return JWT.sign(
    {
      iss: "NodeJs_Authentification",
      sub: user.id, // connects the token to the user -> e.g UserID
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1) // current date + 1 day
    },
    config.get("jwtSecret")
  );
};

module.exports = {
  signUp: async function(req, res, next) {
    logger.debug("signUp called");

    const { email, password } = req.body;

    // check if there is a user with the same email
    const foundUser = await User.findOne({
      "local.email": email
    }); //ES6 same as email:email

    if (foundUser) {
      logger.debug("Email already in use");
      return res.status(409).json({
        message: "Email is already in use!"
      });
    }

    // create a new User
    const newUser = new User({
      methode: "local",
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

    logger.debug("SignUP successful");
  },

  signIn: async function(req, res, next) {
    logger.debug("signIn called");
       // generate token
    const token = signToken(req.user);
    res.status(200).json({
      token
    });
    logger.debug(`SignIn successful`);
  },

  // TODO: bring googleOAUTH and facebookOAuth together since they are the same function

  googleOAuth: async function(req, res, next) {
    // generate token
    const token = signToken(req.user);
    res.status(200).json({
      token
    });
    logger.debug(`GoogleOAuth successful`);
  },

  facebookOAuth: async function(req, res, next) {
    // generate token

    const token = signToken(req.user);
    res.status(200).json({
      token
    });
    logger.debug(`FacebookOAuth successful`);
  },

  githubOAuth: async function(req, res, next) {
    // generate token
    const token = signToken(req.user);
    res.status(200).json({
      token
    });
    logger.debug(`GitHubOAuth successful`);
  },

  secret: async function(req, res, next) {
    res.json({
      secret: req.user
    });
    logger.debug("Access to the secret granted");
  }
};
