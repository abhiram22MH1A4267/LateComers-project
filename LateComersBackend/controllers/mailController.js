const nodemailer = require("nodemailer");
const cron = require("node-cron");
require("dotenv").config();
const XLSX = require("xlsx");
const fs = require("fs");
const moment = require("moment");
const axios = require("axios");

// Create the transporter
let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "latecomers@adityauniversity.in",
    pass: "Thub@Aditya",
  },
});


const getApiData = async (college, todayDate) => {
  try {
    const branch = "ALL BRANCHES";
    const result = await axios.get(
      `http://localhost:5000/api/college-Branch-Date-Data/${college}/${branch}/${todayDate}/${todayDate}`
    );
    console.log("Data is retrieved successfully from the API...");
    return result.data.excelData;
  } catch (err) {
    console.log("Error fetching data:", err);
    throw err;
  }
};

const getCollegeDatawithnames = async (college) => {
  try {
    const bbbb = new Date();
    const fulldata = await axios.post(
      `http://localhost:5000/api/get-brachwise-fullname`,
      { datee: bbbb, college: college }
    );
    return fulldata.data;
  } catch (err) {
    console.error(err);
  }
};

// Create a new workbook and convert data to an Excel file
const createExcel = (data) => {
  const wb = XLSX.utils.book_new();

  const cleanData =
    data &&
    data.map((item) => ({
      studentName: item.studentName,
      studentRoll: item.studentRoll,
      college: item.college,
      branch: item.branch,
      gender: item.gender,
      fatherName: item.fatherName,
      fatherMobile: item.fatherMobile,
      date: item.date.split("T")[0].split("-").reverse().join("-"),
      inTime: item.inTime,
    }));

  // Convert the clean data (array of objects) to a worksheet
  const ws = XLSX.utils.json_to_sheet(cleanData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Write the workbook to a buffer
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
  console.log("Excel file created successfully.");
  return excelBuffer;
};

// create tableMail
const createTable = async (data, clgname) => {
  const today = new Date();
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  var allColleges = [
    {
      _id: "ADITYA UNIVERSITY",
      totalStudents: 0,
    },
    {
      _id: "ADITYA COLLEGE OF ENGINEERING AND TECHNOLOGY",
      totalStudents: 0,
    },
    {
      _id: "ADITYA COLLEGE OF PHARMACY",
      totalStudents: 0,
    },
    {
      _id: "ADITYA GLOBAL BUSINESS SCHOOL",
      totalStudents: 0,
    },
    {
      _id: "ADITYA DEGREE AND PG COLLEGE",
      totalStudents: 0,
    },
    {
      _id: "ADITYA ENGINEERING COLLEGE (POLYTECHNIC-255)",
      totalStudents: 0,
    },
    {
      _id: "ADITYA COLLEGE OF ENGINEERING & TECHNOLOGY (POLYTECHNIC-249)",
      totalStudents: 0,
    },
    {
      _id: "ADITYA PHARMACY COLLEGE",
      totalStudents: 0,
    },
    {
      _id: "ADITYA GLOBAL BUSINESS SCHOOL (ACET)",
      totalStudents: 0,
    },
  ];

  var dataaaa = await getCollegeDatawithnames(data);
  if (data == "ALL") {
    allColleges.map((item) => {
      const matchedCollege = dataaaa.find(
        (dataItem) => dataItem._id === item._id
      );
      if (matchedCollege) {
        item.totalStudents = Math.max(
          item.totalStudents,
          matchedCollege.totalStudents
        );
      }
    });
    allColleges.sort((a, b) => b.totalStudents - a.totalStudents);
    console.log(allColleges);
  } else {
    allColleges = dataaaa;
    allColleges.sort((a, b) => b.totalStudents - a.totalStudents);
    console.log(allColleges);
  }

  const dataTable = `
  <html >
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              height: 100vh; 
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f4f4f4; 
          }
          .container {
              text-align: center;
              width: 93%;
              max-width: 700px;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .email-header img {
              width: 250px;
              height: auto;
              margin-bottom: 0px;
          }
          h3 {
              font-size: 1.2em;
          }
          table {
              margin-top: 10px;
              width: 100%;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
          }
          th, td {
              border: 1px solid #333;
              padding: 10px;
              text-align: center;
          }
          th {
              background-color: #4d648f;
              color: white;
              font-weight : 600;
              font-size : 1rem
          }
          .email-footer {
              display: flex;
              margin-left : 15px;
              justify-content: center !important;
              align-items: center !important;
              gap: 10px !important;

          }
          .email-footer img {
              width: 100px;
              height: auto;
              max-height: 55px;
          }
      </style>
  </head>
  <body>
    <center>
      <div class="container">
          <div class="email-header">
              <img src="https://adityauniversity.in/static/media/AU-logo.d4c9addb1494f8538d6a.jpg" alt="Aditya University Logo">
          </div>
            <div class="email-message">
              <h3>Dear Sir/Madam,</h3>
              <h3>Please find the following details of Late Comers on <span style="color:#fb8500;">${formattedDate}</span>, Institution wise.</h3>
          </div>
            <table>
              <thead>
                  <tr>
                      <th>S.No</th>
                      <th>${clgname}</th>
                      <th>Count</th>
                  </tr>
              </thead>
              <tbody>
                  ${allColleges
                    .map(
                      (item, index) =>
                        `<tr style="background-color: ${
                          index % 2 === 0 ? "#f9c564" : "#e3f2fd"
                        };">
                                  <td>${index + 1}</td>
                                  <td>${item._id}</td>
                                  <td>${item.totalStudents}</td>
                              </tr>`
                    )
                    .join("")}
                  <tr>
                      <td colspan="2" style="text-align: center; font-weight: bold; background-color: #4d648f; color: white; font-size : 1rem ">
                          Total Late Comers:
                      </td>
                      <td style="text-align: center; font-weight: bold; background-color: #4d648f; color: white; font-size : 1rem ">
                          ${allColleges.reduce(
                            (acc, curr) => acc + curr.totalStudents,
                            0
                          )}
                      </td>
                  </tr>
              </tbody>
          </table>
            <div class="email-footer">
              <h3>Regards, P.B.S.J.Chakravarthi, Campus Incharge, 7731886664</h3>
              <img src="https://play-lh.googleusercontent.com/neiEWqiRv8h5B56f1ss5EdsjgC1ofOMoyFt_KqfdWrUMoepxwRXhGmWpBERTr3w7jtA=w600-h300-pc0xffffff-pd" alt="Logo">
          </div>
      </div>
      </center>
  </body>
  </html>`;

  return dataTable;
};

// Send the email with the Excel file and table attached
const sendingMails = (mail, attachment, clg, table, date) => {
  try {
    console.log("Sending email...");
    const mailOptions = {
      from: "latecomers@adityauniversity.in",
      // from: "saichanduadapa951@gmail.com",
      to: mail,
      subject: `Today (${moment(new Date(date)).format(
        "DD-MM-YYYY"
      )}) ${clg} Late Comers`,
      attachments: [
        {
          filename: `Today_(${moment(new Date(date)).format(
            "DD-MM-YYYY"
          )})_${clg}_LateComers.xlsx`,
          content: attachment,
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
      html: table,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error occurred: " + error.message);
      }
      console.log("Email sent successfully: " + info.response);
    });
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

const mainFun = async (check) => {
  const overallMails = [
    "bhanumanthu450@gmail.com",
    "saichanduadapa951@gmail.com",
  ];

  const individualMails = [
    { "ADITYA UNIVERSITY": "shaiknasuruddin914@gmail.com" },
    { "ADITYA COLLEGE OF ENGINEERING AND TECHNOLOGY":"bhanumanthu450@gmail.com",},
    { "ADITYA PHARMACY COLLEGE": "vajjalaabhiram@gmail.com" },
    { "ADITYA COLLEGE OF PHARMACY": "akondiathreya@gmail.com" },
    {"ADITYA COLLEGE OF ENGINEERING & TECHNOLOGY (POLYTECHNIC-249)":"sonaliflorence@gmail.com"},
    { "ADITYA GLOBAL BUSINESS SCHOOL (ACET)": "JYOTHIMAMIDIPALLI22@gamil.com" },
    { "ADITYA DEGREE AND PG COLLEGE": "bhanumanthu450@gmail.com" },
    {"ADITYA ENGINEERING COLLEGE (POLYTECHNIC-255)":"priyalaxmi1106@gmail.com",},
    { "ADITYA GLOBAL BUSINESS SCHOOL": "saichanduadapa951@gmail.com" },
  ];


  const date = new Date();
  if (check === "All Data") {
    const todayData = await getApiData("ALL COLLEGES", date);

    const excel = createExcel(todayData);

    const tableData = await createTable("ALL", "College");

    overallMails.forEach((mail) => {
      sendingMails(mail, excel, "ALL COLLEGES", tableData, date);
    });
  } else {
    for (const collegeMail of individualMails) {
      const [college, mail] = Object.entries(collegeMail)[0];

      const todayData = await getApiData(college, date);

      const excel = createExcel(todayData);

      const tableData = await createTable(college, "Branch");

      sendingMails(mail, excel, college, tableData, date);
    }
  }
};

// cron.schedule("08 12 * * 1-6", () => {
//   console.log("Scheduled job starting...");
//   mainFun("All Data");
//   console.log("Scheduled job executed successfully.");
// });

module.exports = { sendingMails };
