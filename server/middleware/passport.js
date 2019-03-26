const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const GooglePLusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const GithubTokenStrategy = require("passport-github-token");
const config = require("config");
const Joi = require("joi");

const User = require("../models/user");
const logger = require("./logger");

// JSON WEB TOKEN STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: config.get("jwtSecret")
    },
    async (payload, next) => {
      // find the user specified in token
      logger.debug("payload", payload);
      const user = await User.findById(payload.sub);

      // if user doesn't exist
      if (!user) {
        logger.info(`User doesn't exit`);
        return next(null, false);
      }
      // otherwise, return the user
      next(null, user);
    }
  )
);

// GOOGLE OAUTH STRATEGY
passport.use(
  "googleToken",
  new GooglePLusTokenStrategy(
    {
      clientID: config.get("oauth.google.clientId"),
      clientSecret: config.get("oauth.google.clientSecret")
    },
    async (accessToken, refreshToken, profile, next) => {
      logger.debug("accessToken", accessToken);
      logger.debug("refreshToken", refreshToken);
      logger.debug("profile", profile);

      // check if the userId is valid
      const result = validateOauthId(profile.id);
      if (result.error) {
        logger.error(`UserId validation failed`, result.error);
        return next(null, false, result.error);
      }

      // check whether current user exists in DB
      // TODO: maybe only let the user create one account with every E-Mail address!
      const existingUser = await User.findOne({
        "google.id": profile.id
      });
      if (existingUser) {
        logger.info("User already exists!");
        return next(null, existingUser);
      }

      // if new user
      const newUser = new User({
        methode: "google",
        google: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });
      await newUser.save();
      next(null, newUser);
    }
  )
);

// FACEBOOK OAUTH STRATEGY
passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: config.get("oauth.facebook.clientId"),
      clientSecret: config.get("oauth.facebook.clientSecret"), //config.get("oauth.facebook.clientSecret")
      fbGraphVersion: "v3.2"
    },
    async (accessToken, refreshToken, profile, next) => {
      logger.debug("profile", profile);
      logger.debug("accessToken", accessToken);
      logger.debug("refreshToken", refreshToken);
      // check if the userId is valid
      const result = validateOauthId(profile.id);
      if (result.error) {
        logger.error("UserID validation failed", result.error);
        return next(null, false, result.error);
      }

      // check whether current user exits in DB
      const existingUser = await User.findOne({
        "facebook.id": profile.id
      });
      if (existingUser) {
        logger.info("User already exists!");
        return next(null, existingUser);
      }

      const newUser = new User({
        methode: "facebook",
        facebook: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });

      await newUser.save();
      next(null, newUser);
    }
  )
);

// Github OAUTH STRATEGY
passport.use(
  "githubToken",
  new GithubTokenStrategy(
    {
      clientID: config.get("oauth.github.clientId"),
      clientSecret: config.get("oauth.github.clientSecret")
    },
    async (accessToken, refreshToken, profile, next) => {
      try {
        logger.debug("profile", profile);
        logger.debug("accessToken", accessToken);
        logger.debug("refreshToken", refreshToken);

        let profileID = profile.id;
        let profileIDString = profileID.toString();
        // check if the userId is valid
        const result = validateOauthId(profileIDString);
        if (result.error) {
          logger.error("UserID validation failed", result.error);
          return next(null, result.error);
        }

        // check whether current user exits in DB
        const existingUser = await User.findOne({
          "github.id": profileIDString
        });

        if (existingUser) {
          logger.info("User already exists!");
          logger.debug(existingUser);
          return next(null, existingUser);
        }

        logger.info(`User doesn't exitst --> creating a new one!!`);
        const newUser = new User({
          methode: "github",
          github: {
            id: profileIDString,
            email: profile.emails[0].value
          }
        });

        await newUser.save();
        next(null, newUser);
      } catch (error) {
        logger.error(error);
        next(false);
      }
    }
  )
);

// LOCAL STRATEGY
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, next) => {

      // find the user given the email
      const user = await User.findOne({
        "local.email": email
      });


      // if not, handle it
      if (!user) {
        return next(null, false);
      }

      // check if the password is correct
      const isMatch = await user.isValidPassword(password);


      if (!isMatch) {
        // if don't send the user back
        logger.info("wrong password");
        return next(null, false);
      } else {
        // if yes send the user back
        next(null, user);
      }
    }
  )
);

function validateOauthId(id) {
  const schema = {
    id: Joi.string().required()
  };
  return Joi.validate({ id }, schema);
}
