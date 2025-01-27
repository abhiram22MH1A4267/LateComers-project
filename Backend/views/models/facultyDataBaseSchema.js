const mongoose = require('mongoose')

const facultyDataBase = new mongoose.Schema({
    facultyName: {
        type: String,
        required: true
    },
    facultyId: {
        type: String,
        required: true
    },
    facultyMobile: {
        type: String,
    },
    facultyCollege: {
        type: String,
        required: true
    },
    facultyBranch :{
        type : String,
    },
    facultyCollegeCode: {
        type : String,
        required : true,
    },
    facultyMail: {
        type: String,
        required: true
    },
    facultyGender: {
        type: String,
        require: true
    },
})

module.exports = mongoose.model("facultyDataBase",facultyDataBase);