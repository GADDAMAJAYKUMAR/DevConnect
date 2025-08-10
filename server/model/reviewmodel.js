const mongoose=require("mongoose");
const reviewSchema=new mongoose.Schema({

    taskprovider:{
        type : String,
        required : true
    },

    taskWorker:{
        type : String,
        required : true
    },

    rating:{
        type : String,
        required : true
    }
})
module.exports = mongoose.model("reviewmodel",reviewSchema);
