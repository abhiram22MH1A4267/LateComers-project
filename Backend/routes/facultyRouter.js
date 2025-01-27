const express = require("express")

const Router = express.Router()

const {addFacultyInData , searchFaculty , todayFacultyData , collegeDateData , collegeWiseFacultyCount, addFacultyOutData , todayFacultyInData , todayFacultyOutData} = require("../controllers/facultyController")

Router.post("/add-Faculty-InData" , addFacultyInData)
Router.post("/add-Faculty-Outdata", addFacultyOutData);
Router.get("/search-Faculty/:facultyId/:fromDate/:toDate" , searchFaculty);
Router.get("/today-Faculty-Data/:facultyCollege" , todayFacultyData)
Router.get("/college-Date-Data/:facultyCollege/:fromDate/:toDate" , collegeDateData)
Router.get("/collegeWise-Faculty-Count" , collegeWiseFacultyCount)
Router.get("/today-Faculty-InData" , todayFacultyInData)
Router.get("/today-Faculty-OutData" , todayFacultyOutData)


module.exports = Router 