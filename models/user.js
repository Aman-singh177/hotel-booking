const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type : String,
        required: true
    }
});

userSchema.plugin(PassportLocalMongoose); 
// kyuki yeh hamare liye username, hashing, salting and hash password inh sbko 
// automatically implement kar deta hai woh chize humhe scratch se build karne ki jarutat nhi hai 

module.exports = mongoose.model('User',userSchema);

