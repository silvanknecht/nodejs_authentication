const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const JWT = require("jsonwebtoken");
const config = require("config");

const Schema = mongoose.Schema;

// Create a schema
// TODO: Add other fields: lastname, firstname, birthday, etc.
const userSchema = new Schema({
  // Additional validation, it's also done serverside!
  methode: {
    type: String,
    enum: ["local", "google", "facebook", "github"],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  github: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  }
});

userSchema.pre("save", async function(next) {
  if (this.methode !== "local") {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  // generate  password has (salt +hash)
  const passowrdHas = await bcrypt.hash(this.local.password, salt); //userpassoword, salt => contains hash and hashedPassword, with that hash can the entered password while login be comapred
  // assign hashed Password
  this.local.password = passowrdHas;
  next();
}); // before user gets saved this is executed, ES6 arrow functions don't work when referencing out of this object

userSchema.methods.isValidPassword = async function(passwordToCheck) {
  return await bcrypt.compare(passwordToCheck, this.local.password);
};

userSchema.methods.generateAuthToken = function() {
  const token = JWT.sign(
    {
      iss: "NodeJs_Authentification",
      sub: this,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1) // current date + 1 day
    },
    config.get("jwtSecret")
  );
  return token;
};
// Create a model
const User = mongoose.model("User", userSchema); // name will be pluralized automatically for DB

function validateCredentials(req, res, next) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  };
  return Joi.validate(req, schema);
}

// Export the model
module.exports = User;
module.exports.validateCredentials = validateCredentials;
