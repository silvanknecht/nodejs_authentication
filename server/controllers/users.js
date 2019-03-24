const { User } = require("../models/user");
const logger = require("../middleware/logger");

module.exports = {
  signUp: async function(req, res, next) {
    try {
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
      const token = newUser.generateAuthToken();

      // respond with token
      res.status(200).json({
        token
      });

      logger.debug("SignUP successful");
    } catch (error) {
      logger.error(error);
      next(false);
    }
  },

  signIn: async function(req, res, next) {
    try {
      logger.debug("signIn called");
      // generate token
      const user = req.user;
      const token = user.generateAuthToken();
      res.status(200).json({
        token
      });
      logger.debug(`SignIn successful`);
    } catch (error) {
      logger.error(error);
      next(false);
    }
  },

  thirdPartyOAuth: async function(req, res, next) {
    try {
      // generate token
      const user = req.user;
      const token = user.generateAuthToken();
      res.status(200).json({
        token
      });
      logger.debug(`thirdPartyOAuth successfull`);
    } catch (error) {
      logger.error(error);
      next(false);
    }
  },

  secret: async function(req, res, next) {
    try {
      res.json({
        secret: req.user
      });
      logger.debug("Access to the secret granted");
    } catch (error) {
      logger.error(error);
      next(false);
    }
  }
};
