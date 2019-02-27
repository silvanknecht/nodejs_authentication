const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {
   ExtractJwt
} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePLusTokenStrategy = require('passport-google-plus-token');
const {
   JWT_SECRET
} = require('./configuration');
const User = require('./models/user');

// JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
   jwtFromRequest: ExtractJwt.fromHeader('authorization'),
   secretOrKey: JWT_SECRET
}, async (payload, done) => {
   try {
      // Find the user specified in token
      console.log(payload);
      const user = await User.findById(payload.sub);

      // If user doesn't exist
      if (!user) {
         return done(null, false);
      }
      // Otherwise, return the user
      done(null, user);
   } catch (error) {
      done(error, false);
   }
}));

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePLusTokenStrategy({
   clientID: '661681259398-moo3f08gcro4clb0s7jpn8uqgffregl9.apps.googleusercontent.com',
   clientSecret: '1KitIWwG2bmHxF9boAKoKtNr'
}, async (accessToken, refreshToken, profile, done) => {
   try {
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);

      // check wether current user exists in DB
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