const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;




// Create a schema
// TODO: Add other fields: lastname, firstname, birthday, etc.
const userSchema = new Schema({
    // Additional validation, it's also done serverside!
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(next){
try {
        //Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate  password has (salt +hash)
        const passowrdHas = await bcrypt.hash(this.password,salt) //userpassowrd, salt => contains hash and hashedPassword, with that hash can the entered password while login be comapred
        // Assign hashed Password
        this.password = passowrdHas;
        next();
    } catch (error) {
        next(error);
    }
}); // before user gets saved this is executed, ES6 arrow functions don't work when referencing out of this object

userSchema.methods.isValidPassword = async function(passwordToCheck) {
    try {
        return await bcrypt.compare(passwordToCheck, this.password);

    } catch (error) {
        throw new Error(error);

    }

}

// Create a model
const User = mongoose.model('user', userSchema); // name will be pluralized automatically for DB

// Export the model
module.exports = User;