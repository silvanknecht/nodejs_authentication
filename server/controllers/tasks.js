const Task = require('../models/task');


module.exports = {
    getAll: async function (req, res, next) {
        const {
            id
        } = req.user;
        const allTasks = await Task.find({
            "creatorID": id
        }).catch(err => {
            return res.status(404).json({
                "success": false
            });
        });

        // responde with an array of all taks which belonge to the user asking for it
        return res.status(200).json({
            "success": true,
            allTasks
        });

    },

    create: async function (req, res, next) {
        const {
            id
        } = req.user;
        const {
            description
        } = req.body;
        // create a new User
        const newTask = new Task({
            creatorID: id,
            description: description

        });
        await newTask.save();

        // respond with the newly created task
        res.status(200).json({
            "success": true,
            "message": "task created",
            newTask
        });
    },

    update: async function (req, res, next) {

        const contentToUpdate = {
            "description": req.body.description
        };
        await Task.updateOne({
            "_id": req.taskID
        }, contentToUpdate);

        // TODO: how can i send the updated task back without looking into the collection again?
        // search for the updated task
        const taskUpdated = await Task.findOne({
            "_id": req.taskID
        });

        // if successful return the updated task
        return res.status(200).json({
            "success": true,
            "message": "task updated",
            taskUpdated

        });

    },

    delete: async function (req, res, next) {
        // check if the user is allowed to delete the task

        await Task.deleteMany({
            "_id": req.taskID
        });
        return res.status(200).json({
            "success": true,
            "message": "task deleted"
        });

    },

    // function check whether the user is allowed to edit the requested task
    isOwner: async function (req, res, next) {
        const {
            id
        } = req.user;
        var taskID = req.params.id.toString();
        const task = await Task.findOne({
            "_id": taskID
        }).catch(err => {
            // task not existing
            return res.status(404);
        });

        if (task.creatorID === id) {
            req.taskID = taskID;
            next();
        } else {
            return res.status(401).json({
                "success": false,
                "error": "unauthorized"
            });
        }
    }


};