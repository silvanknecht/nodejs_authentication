const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const {
    validateBody,
    schemas
} = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', {
    session: false
});
const passportJWT = passport.authenticate('jwt', {
    session: false
});
const passportGoogle = passport.authenticate('googleToken', {
    session: false
});
const passportFacebook = passport.authenticate('facebookToken', {
    session: false
});

// if the validation fails the controller doesn't get called
router.post('/signup', validateBody(schemas.authSchema), UsersController.signUp);
router.post('/signin', validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);
router.post('/oauth/google', passportGoogle, UsersController.googleOAuth);
router.post('/oauth/facebook', passportFacebook, UsersController.facebookOAuth);
router.get('/secret', passportJWT, UsersController.secret);


module.exports = router;