const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    creatorID: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }

});


// Create a model
const Task = mongoose.model('task', taskSchema); // name will be pluralized automatically for DB

// Export the model
module.exports = Task;