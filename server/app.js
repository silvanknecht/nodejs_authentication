const express = require("express");

const logger = require('./middleware/logger');

const app = express();

process.env.NODE_CONFIG_DIR = './server/config'
require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/database')();

// Routes
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/tasks', require('./routes/tasks'));


/* Server */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`listening on port ${port}...`);
});
