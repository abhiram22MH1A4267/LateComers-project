const { model, default: mongoose } = require("mongoose");
const studentDataBase = require("../models/studentDataBaseSchema");
const facultyDataBase = require("../models/facultyDataBaseSchema")
const multer = require('multer');
const csv = require('csv-parser');
const express = require("express")
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

const addData = (req, res) => {
  const obj = req.body;
  var submitData = new studentDataBase(obj);
  try {
    submitData.save();
    console.log("Student Data Successfully");
    res.status(200).send(submitData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const updateStudent = async (req, res) => {
  console.log("this is for update student");
  const currentDate = new Date();
  const istOffsetInMilliseconds = (5 * 60 + 30) * 60 * 1000;
  const date = new Date(currentDate.getTime() + istOffsetInMilliseconds);

  const roll = req.body.roll;
  try {
    const result = await studentDataBase.updateOne(
      { studentRoll: roll },
      { $set: { suspended: req.body.isSuspended , updatedOn : date} },
    );
    console.log(`Student with roll ${roll} has been suspended.`);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error updating student record:", error);
    res.status(404).send(error);
  }
};

const getStudentData = async (req, res) => {
  const data = await studentDataBase.aggregate([
    {
      $match: {
        studentRoll: req.body.roll,
      },
    },
  ]);

  res.status(200).send(data);
};

const getSuspendList = async (req, res) => {
  console.log("This is to get the suspended list");
  try {
    const data = await studentDataBase.aggregate([
      {
        $match: {
          suspended: "YES",
        },
      },
    ]);

    console.log("Susccessfully getting the Suspended List");
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res
      .status(204)
      .send({
        err: "Error while getting the Suspended List Data ",
        details: err,
      });
  }
};



// Multer setup for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bulkUploadHandler = async (req, res) => {
  console.log("Starting bulk upload");

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { type } = req.body; 
  const errors = [];
  const validEntries = [];

  let immediateErrorSent = false; 

  const stream = Readable.from(req.file.buffer.toString());

  stream
    .pipe(csv())
    .on("data", (row) => {
      if (immediateErrorSent) return; 

      const S_NO = parseInt(row.S_NO, 10);

      if (type === "Student") {
        const {
          studentRoll,
          studentName,
          college,
          collegeCode,
          branch,
          studentMobile,
          email,
          passedOutYear,
          gender,
          fatherName,
          fatherMobile,
          facultyId,
        } = row;

        if (facultyId) {
          immediateErrorSent = true;
          return res.status(401).json({
            row: S_NO,
            message: "Invalid data: FacultyId should not be provided for Student type.",
          });
        }

        const missingFields = [];
        if (!studentName) missingFields.push("studentName");
        if (!studentRoll) missingFields.push("studentRoll");
        if (!college) missingFields.push("college");
        if (!collegeCode) missingFields.push("collegeCode");
        if (!branch) missingFields.push("branch");
        if (!passedOutYear) missingFields.push("passedOutYear");
        if (!gender) missingFields.push("gender");

        if (missingFields.length > 0) {
          errors.push({
            S_NO,
            row,
            message: `Missing required fields: ${missingFields.join(", ")}`,
          });
        } else {
          const updatedOnIST = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          });

          validEntries.push({
            studentName,
            studentRoll,
            college,
            collegeCode,
            branch,
            studentMobile,
            email,
            passedOutYear,
            gender,
            fatherName,
            fatherMobile,
            suspended: "NO",
            updatedOn: new Date(updatedOnIST),
          });
        }
      } else if (type === "Faculty") {
        const {
          facultyName,
          facultyId,
          facultyMobile,
          facultyCollege,
          facultyCollegeCode,
          facultyBranch,
          facultyMail,
          facultyGender,
          studentRoll,
        } = row;

        if (studentRoll) {
          immediateErrorSent = true;
          return res.status(402).json({
            row: S_NO,
            message: "Invalid data: studentRoll should not be provided for Faculty type.",
          });
        }

        const missingFields = [];
        if (!facultyName) missingFields.push("facultyName");
        if (!facultyId) missingFields.push("facultyId");
        if (!facultyCollege) missingFields.push("facultyCollege");
        if (!facultyCollegeCode) missingFields.push("facultyCollegeCode");
        if (!facultyBranch) missingFields.push("facultyBranch");
        if (!facultyGender) missingFields.push("facultyGender");

        if (missingFields.length > 0) {
          errors.push({
            S_NO,
            row,
            message: `Missing required fields: ${missingFields.join(", ")}`,
          });
        } else {
          validEntries.push({
            facultyName,
            facultyId,
            facultyMobile,
            facultyCollege,
            facultyCollegeCode,
            facultyBranch,
            facultyMail,
            facultyGender,
          });
        }
      }
    })
    .on("end", async () => {
      if (immediateErrorSent) return; // Skip further processing if an error was already sent

      if (errors.length > 0) {
        console.error("Errors found:", errors);
        return res.status(400).json({ message: "Errors in uploaded data", errors });
      }

      try {
        if (type === "Student") {
          await studentDataBase.insertMany(validEntries);
        } else if (type === "Faculty") {
          await facultyDataBase.insertMany(validEntries);
        }
        console.log({ message: "Bulk upload successful", validEntries });
        res.status(200).json({
          message: "Bulk upload successful",
          validEntries,
        });
      } catch (error) {
        console.error({ message: "Error uploading data", error });
        res.status(500).json({
          message: "Error uploading data",
          error: error.message || error,
        });
      }
    })
    .on("error", (error) => {
      console.error("Error processing file:", error);
      res.status(500).json({
        message: "Error processing file",
        error: error.message || error,
      });
    });
};






// Export multer middleware and handler function

module.exports = { addData, updateStudent, getSuspendList, getStudentData , upload: upload.single('file') , bulkUploadHandler,};
