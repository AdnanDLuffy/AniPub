const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const List = new Schema({
    AniID:{
        type:String,
        required:true,
    },
    AniEP :{
        type:String,
        required:true,
    },
    Date:{
        type:String,
        required:true,
    },
},{timestamps:true}) 

const newList = mongoose.model("List",List);

module.exports = newList;