const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Database
mongoose.connect('mongodb://localhost/APIAuthentication', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true); // Without it Deprication Warning

const app = express();


// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});