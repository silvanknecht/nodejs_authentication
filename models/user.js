const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;




// Create a schema
// TODO: Add other fields: lastname, firstname, birthday, etc.
const userSchema = new Schema({
    // Additional validation, it's also done serverside!
    methode: {
        type: String,
        enum: ['local', 'google', 'facebook', 'github'],
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

// Before the new use is saved in the database
userSchema.pre('save', async function (next) {
//console.log('this.logal.password', this.local.password);
    try {
        if(this.methode !== 'local'){
            next();
        }

        // generate a salt
        const salt = await bcrypt.genSalt(10);
        // generate  password has (salt +hash)
        const passowrdHas = await bcrypt.hash(this.local.password, salt) //userpassoword, salt => contains hash and hashedPassword, with that hash can the entered password while login be comapred
        // assign hashed Password
        this.local.password = passowrdHas;
        next();
    } catch (error) {
        next(error);
    }
}); // before user gets saved this is executed, ES6 arrow functions don't work when referencing out of this object

// before logged in we need to check whether or not the password is correct
userSchema.methods.isValidPassword = async function (passwordToCheck) {
    try {
        return await bcrypt.compare(passwordToCheck, this.local.password);

    } catch (error) {
        throw new Error(error);

    }

}

// Create a model
const User = mongoose.model('user', userSchema); // name will be pluralized automatically for DB

// Export the model
module.exports = User;