const express = require("express")
const Router = express.Router()

const {addData , updateStudent , getSuspendList , getStudentData} = require("../controllers/studentDataBaseController")

Router.post("/add-Studentss" , addData)

Router.put("/update-Student" , updateStudent)

Router.get("/get-SuspendList" , getSuspendList)

Router.post("/get-Studentss" , getStudentData)

module.exports = Router