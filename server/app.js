const express = require("express");
const app = express();
const logger = require('./middleware/logger');

process.env.NODE_CONFIG_DIR = './server/config'
require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/database')();


/* Server */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`listening on port ${port}...`);
});
