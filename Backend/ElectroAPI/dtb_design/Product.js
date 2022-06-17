const mongoose = require("mongoose");
//Product collection schema
const productschema = new mongoose.Schema({
    name:{type: String, required:true},
    desc:{type: String, required:true},
    photo:{type: String, required:true},
    isAvailable:{type: Boolean, default:true},
    price:{type: Number, required:true},
    discount_price:{type: Number},
    brand:{type: String, required:true},
    guarantee:{type: String, required:true},
    category:{type: Array, required:true}
},
    {timestamps: true}
);

module.exports = mongoose.model("Product", productschema);