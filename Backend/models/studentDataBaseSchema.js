const mongoose = require("mongoose")

const studentDataBase = new mongoose.Schema({
    studentName :{
        type : String ,
        required : true
    },
    studentRoll :{
        type : String ,
        required : true
    },
    college :{
        type : String ,
        required : true
    },
    collegeCode : {
        type : String,
        required : true
    },
    branch :{
        type : String ,
        required : true
    },
    studentMobile :{
        type : Number ,
    },
    email : {
        type : String,
        required : true
    },
    passedOutYear :{
        type : Number,
        required : true
    },
    gender :{
        type : String ,
        required : true
    },
    fatherName : {
        type : String,
        required : true
    },
    fatherMobile : {
        type : Number,
    },
    suspended :{
        type : String,
    }
})

module.exports  = mongoose.model("studentDataBase" , studentDataBase);