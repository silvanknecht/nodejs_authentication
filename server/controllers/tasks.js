const Task = require('../models/task');


module.exports = {

    create: async function (req, res, next) {
        const { id } = req.user;
        const { description } = req.body;
        // create a new User
        const newTask = new Task({
            creatorID: id,
            description: description

        }); //ES6 same as email:email, password: password

        await newTask.save();

        // respond with token
        res.status(200).json({
            newTask
        });

    }
};