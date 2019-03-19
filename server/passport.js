const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {
   ExtractJwt
} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePLusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const GithubTokenStrategy = require('passport-github-token');
const config = require('./conf');
const User = require('./models/user');
const Joi = require('joi');

// debug
const debugPassportJWT = require('debug')('auth:passportJWT');
const debugPassportGooglePLus = require('debug')('auth:passportGooglePLus');
const debugPassportFacebook = require('debug')('auth:passportFacebook');
const debugPassportGithub = require('debug')('auth:passportGithub');
const debugPassportLocal = require('debug')('auth:passportLocal');

const {
   validateBody,
   schemas
} = require('./helpers/routeHelpers');

// JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
   secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
   try {
      // find the user specified in token
      debugPassportJWT('payload', payload);
      const user = await User.findById(payload.sub);

      // if user doesn't exist
      if (!user) {
         debugPassportJWT(`User doesn't exit`);
         return done(null, false);
      }
      // otherwise, return the user
      done(null, user);
   } catch (error) {
      debugPassportJWT(`JWT authentication failed`, error);
      done(error, false);
   }
}));

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePLusTokenStrategy({
   clientID: config.oauth.google.clientID,
   clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
   try {
      debugPassportGooglePLus('accessToken', accessToken);
      debugPassportGooglePLus('refreshToken', refreshToken);
      debugPassportGooglePLus('profile', profile);

      // check if the userId is valid
      const result = Joi.validate({
         id: profile.id
      }, schemas.oAuthSchema);
      if (result.error) {
         debugPassportGooglePLus(`UserId validation failed`, result.error);
         return done(null, false, result.error);
      }

      // check whether current user exists in DB
      // TODO: maybe only let the user create one account with every E-Mail address!
      const existingUser = await User.findOne({
         "google.id": profile.id
      });
      if (existingUser) {
         debugPassportGooglePLus('User already exists!');
         return done(null, existingUser);
      }
      debugPassportGooglePLus(`User doesn't exitst --> creating a new one!!`);

      // if new user
      const newUser = new User({
         methode: 'google',
         google: {
            id: profile.id,
            email: profile.emails[0].value
         }
      });
      await newUser.save();
      done(null, newUser);

   } catch (error) {
      debugPassportGooglePLus('GooglePlus authentication failed', error);
      done(null, false, error.message);
   }
}));

// FACEBOOK OAUTH STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
   clientID: config.oauth.facebook.clientID,
   clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
   try {
      debugPassportFacebook("profile", profile);
      debugPassportFacebook("accessToken", accessToken);
      debugPassportFacebook("refreshToken", refreshToken);
      // check if the userId is valid
      const result = Joi.validate({
         id: profile.id
      }, schemas.oAuthSchema);
      if (result.error) {
         debugPassportFacebook('UserID validation failed', result.error);
         return done(null, false, result.error);
      }

      // check whether current user exits in DB
      const existingUser = await User.findOne({
         "facebook.id": profile.id
      });
      if (existingUser) {
         return done(null, existingUser);
      }

      debugPassportFacebook(`User doesn't exitst --> creating a new one!!`);
      const newUser = new User({
         methode: 'facebook',
         facebook: {
            id: profile.id,
            email: profile.emails[0].value
         }
      });

      await newUser.save();
      done(null, newUser);

   } catch (error) {
      debugPassportFacebook('Facebook authentication failed', error);
      done(error, false, error.message);
   }
}));

// Github OAUTH STRATEGY
passport.use('githubToken', new GithubTokenStrategy({
   clientID: config.oauth.github.clientID,
   clientSecret: config.oauth.github.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
   try {
      debugPassportGithub("profile", profile);
      debugPassportGithub("accessToken", accessToken);
      debugPassportGithub("refreshToken", refreshToken);

      let profileID = profile.id;
      let profileIDString = profileID.toString();
      // check if the userId is valid
      const result = Joi.validate({
         id: profileIDString
      }, schemas.oAuthSchema);
      if (result.error) {
         debugPassportGithub('UserID validation failed', result.error);
         return done(null, false, result.error);
      }



      // check whether current user exits in DB
      const existingUser = await User.findOne({
         "github.id": profileIDString
      });
      if (existingUser) {
         return done(null, existingUser);
      }

      debugPassportGithub(`User doesn't exitst --> creating a new one!!`);
      const newUser = new User({
         methode: 'github',
         github: {
            id: profileIDString,
            email: profile.emails[0].value
         }
      });

      await newUser.save();
      done(null, newUser);

   } catch (error) {
      debugPassportGithub('Github authentication failed', error);
      done(error, false, error.message);
   }
}));



// LOCAL STRATEGY
passport.use('local', new LocalStrategy({
   usernameField: 'email',
}, async (email, password, done) => {
   try {
      // find the user given the email
      const user = await User.findOne({
         "local.email": email
      });

      // if not, handle it
      if (!user) {
         return done(null, false);
      }

      // check if the password is correct
      const isMatch = await user.isValidPassword(password);


      if (!isMatch) {
         // if don't send the user back
         debugPassportLocal('wrong password');
         return done(null, false);
      } else {
         // if yes send the user back
         done(null, user);
      }

   } catch (error) {
      debugPassportLocal('Local authentication failed', error);
      done(error, false); // send back the error and no user object!
   }

}))