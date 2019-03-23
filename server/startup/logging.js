//require("express-async-errors");
/* Logging*/
const logger = require("../middleware/logger");

module.exports = function(){
    /* Handle Exceptions */
process.on("uncaughtException", ex => {
    logger.error(ex.message);
    process.exit(1);
  });

  process.on("unhandledRejection", ex => {
    logger.error(ex.message);
    process.exit(1);
  });
}