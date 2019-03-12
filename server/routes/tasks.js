const express = require('express');
const router = require('express-promise-router')();
const TaskController  = require('../controllers/tasks.js');
const passport = require('passport');

// validation
const {
    validateBody,
    schemas
} = require('../helpers/routeHelpers');

// route protection
const passportJWT = passport.authenticate('jwt', {
    session: false
});

// create, edit, delete, update, tasks
router.post('/create',validateBody(schemas.taskSchema),passportJWT ,TaskController.create);
router.put('/update/:id',validateBody(schemas.taskSchema),passportJWT ,TaskController.update);
router.delete('/delete/:id',passportJWT ,TaskController.delete);


module.exports = router;