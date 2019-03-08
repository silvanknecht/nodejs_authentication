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

const {
   validateBody,
   schemas
} = require('./helpers/routeHelpers');

// JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
   jwtFromRequest: ExtractJwt.fromHeader('authorization'),
   secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
   try {
      // find the user specified in token
      console.log(payload);
      const user = await User.findById(payload.sub);

      // if user doesn't exist
      if (!user) {
         return done(null, false);
      }
      // otherwise, return the user
      done(null, user);
   } catch (error) {
      done(error, false);
   }
}));

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePLusTokenStrategy({
   clientID: config.oauth.google.clientID,
   clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
   try {
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
      console.log("profile ID", typeof profile.id);

      // check if the userId is valid
      const result = Joi.validate({id:profile.id}, schemas.oAuthSchema);
      if(result.error){
         console.log(result.error);
         done(null, false, result.error);
      }

      // check whether current user exists in DB
      // TODO: maybe only let the user create one account with every E-Mail address!
      const existingUser = await User.findOne({
         "google.id": profile.id
      });
      if (existingUser) {
         console.log("User already exists!")
         return done(null, existingUser);
      }
      console.log("User doesn't exitst --> creating a new one!");

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
      console.log("error");
      done(null, false, error.message);
   }
}));

// FACEBOOK OAUTH STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
   clientID: config.oauth.facebook.clientID,
   clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
   try {
      console.log("profile", profile);
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
        // check if the userId is valid
        const result = Joi.validate({id:profile.id}, schemas.oAuthSchema);
        if(result.error){
           console.log(result.error);
           done(null, false, result.error);
        }

      // check whether current user exits in DB
      const existingUser = await User.findOne({
         "facebook.id": profile.id
      });
      if (existingUser) {
         return done(null, existingUser);
      }
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
      done(error, false, error.message);
   }
}));

// Github OAUTH STRATEGY
passport.use('githubToken', new GithubTokenStrategy({
   clientID: config.oauth.github.clientID,
   clientSecret: config.oauth.github.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
   try {
      console.log("profile", profile);
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
        // check if the userId is valid
        const result = Joi.validate({id:profile.id}, schemas.oAuthSchema);
        if(result.error){
           console.log(result.error);
           done(null, false, result.error);
        }

      // check whether current user exits in DB
      const existingUser = await User.findOne({
         "github.id": profile.id
      });
      if (existingUser) {
         return done(null, existingUser);
      }
      const newUser = new User({
         methode: 'github',
         github: {
            id: profile.id,
            email: profile.emails[0].value
         }
      });

      await newUser.save();
      done(null, newUser);

   } catch (error) {
      done(error, false, error.message);
   }
}));



// LOCAL STRATEGY
passport.use(new LocalStrategy({
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
         return done(null, false);
      } else {
         // if yes send the user back
         done(null, user);
      }

   } catch (error) {
      done(error, false); // send back the error and no user object!
   }

}))