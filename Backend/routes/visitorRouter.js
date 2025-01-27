const express = require("express");
const Router = express.Router();
const {addVisitor , getAllVisitors , getVisitorsBtDates, getVisitorById , getSNo , getPlaces , updateOutDate} = require('../controllers/visitorController'); 

Router.post("/add-Visitor" , addVisitor)

Router.get("/get-All-Visitors" , getAllVisitors)

Router.get("/get-Visitors-Bt-Dates/:toDate/:fromDate/:place/:selectedOthers" , getVisitorsBtDates)

Router.get("/getVisitor/:place" , getVisitorById)

Router.get("/get-SNo" , getSNo)

Router.get("/getPlaces" , getPlaces)

Router.put("/update-Visitor-OutDate" , updateOutDate)



module.exports = Router;