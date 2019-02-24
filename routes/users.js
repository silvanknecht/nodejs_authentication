const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const {
    validateBody,
    schemas
} = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local',{session: false});
const passportJWT = passport.authenticate('jwt', { session: false });

// if the validation fails the controller doesn't get called
router.post('/signup', validateBody(schemas.authSchema), UsersController.signUp);
router.post('/signin', validateBody(schemas.authSchema), passportSignIn , UsersController.signIn);
router.get('/secret', passportJWT , UsersController.secret);

module.exports = router;