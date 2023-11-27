const mongoose = require('mongoose');

const Posts = new mongoose.Schema({
    userId: {
        type:String,
        required:true
    },
    desc: {
        type:String,
        max:500
    },
    img : {
        type:String,
        Image:Buffer
    },
    likes: {
        type:Array,
        default:[]
    }
},{timestamps:true})

module.exports = mongoose.model('Posts',Posts);