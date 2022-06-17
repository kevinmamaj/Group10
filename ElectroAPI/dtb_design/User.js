const mongoose = require("mongoose");
//User collection schema
const userschema = new mongoose.Schema({
    username:{type: String, required:true, unique:true},
    email:{type: String, required:true, unique:true},
    password:{type: String, required:true},
    name:{type: String, required:true},
    surname:{type: String, required:true},
    phone:{type: String, required:true},
    role:{type: Number, default:0},
    status:{type: String,default:"active"}
},
    {timestamps: true}
);

module.exports = mongoose.model("User", userschema);