const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// database
mongoose.connect('mongodb://localhost/APIAuthentication', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true); // Without it Deprication Warning

const app = express();


// middleware
app.use(morgan('dev'));
app.use(express.json());

// routes
// users
app.use('/users', require('./routes/users'));

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});