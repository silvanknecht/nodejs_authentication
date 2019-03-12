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
        })

        // responde with an array of all taks which belonge to the user asking for it
        return res.status(200).json({
            "success": true,
            allTasks
        })

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
        const {
            id
        } = req.user;
        var taskToUpdateID = req.params.id.toString();
        const taskToUpdate = await Task.findOne({
            "_id": taskToUpdateID
        }).catch(err => {
            return res.status(404);
        });

        // check if the user is allowed to update the task
        if (taskToUpdate.creatorID === id) {
            const contentToUpdate = {
                "description": req.body.description
            }
            await Task.updateOne({
                "_id": taskToUpdateID
            }, contentToUpdate)

            // TODO: how can i send the updated task back without looking into the collection again?
            // search for the updated task
            const taskUpdated = await Task.findOne({
                "_id": taskToUpdateID
            });

            // if successful return the updated task
            return res.status(200).json({
                "success": true,
                "message": "task updated",
                taskUpdated

            })
        } else {
            return res.status(401).json({
                "success": false,
                "error": "unauthorized"
            });
        }
    },

    delete: async function (req, res, next) {
        const {
            id
        } = req.user;
        var taskToDeleteID = req.params.id.toString();
        const taskToUpdate = await Task.findOne({
            "_id": taskToDeleteID
        }).catch(err => {
            return res.status(404);
        });

        // check if the user is allowed to delete the task
        if (taskToUpdate.creatorID === id) {
            await Task.deleteMany({
                "_id": taskToDeleteID
            });
            return res.status(200).json({
                "success": false,
                "message": "task deleted"
            });
        } else {
            return res.status(401).json({
                "success": false,
                "error": "unauthorized"
            });
        }
    }
};