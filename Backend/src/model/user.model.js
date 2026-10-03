const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username : {
        type : String,
        unique : [true, "username is already taken"],
        required : true
    },
    email : {
        type : String,
        unique : [true, "Account already exist with this email"],
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("User",UserSchema);