const express = require("express");

const logger = require('./middleware/logger');

const app = express();

process.env.NODE_CONFIG_DIR = './server/config'
require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/database')();


/* Server */
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  logger.info(`listening on port ${port}...`);
});

module.exports = server;
