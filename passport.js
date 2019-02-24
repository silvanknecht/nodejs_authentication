const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {
   ExtractJwt
} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
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


// LOCAL STRATEGY
passport.use(new LocalStrategy({
   usernameField: 'email',
}, async (email, password, done) => {
   try {
      // find the user given the email
      const user = await User.findOne({
         email
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