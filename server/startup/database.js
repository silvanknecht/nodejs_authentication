const mongoose = require("mongoose");

const logger = require('../middleware/logger');

module.exports = function() {
  // database
  mongoose
    .connect("mongodb://localhost/APIAuthentication", {
      useNewUrlParser: true
    })
    .then(logger.info("Connected to Database"));
  mongoose.set("useCreateIndex", true); // Without it Deprication Warning
};
