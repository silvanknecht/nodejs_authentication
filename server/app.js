const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const debugAuthServer = require("debug")("auth:server");

// database
mongoose.connect("mongodb://localhost/APIAuthentication", {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true); // Without it Deprication Warning

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());

// routes
// users
app.use("/api/v1/users", require("./routes/users"));

// start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  debugAuthServer(`listening on port ${port}...`);
});
