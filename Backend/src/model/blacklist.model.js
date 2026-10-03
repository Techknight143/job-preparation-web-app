const mongoose = require('mongoose');


const TokenBlacklistSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true,"token is required to be added in the blacklist"]
    }
}, {timestamps : true});

module.exports = mongoose.model("TokenBlacklistModel",TokenBlacklistSchema);