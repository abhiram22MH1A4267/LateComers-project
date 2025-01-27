// const nodemailer = require("nodemailer");
// const cron = require('node-cron');
// require('dotenv').config();
// const XLSX = require('xlsx');
// const fs = require('fs');
// const axios = require("axios");
// const moment = require('moment');

// // Create the transporter
// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: 'saichanduadapa951@gmail.com',
//         pass: 'cicd jklm fsmr plwr',
//     }
// });

// // const sendMail = (req, res) => {
// //     console.log("This is Comming for Mailing ....")
// //     console.log(req.body)
// //     const d1 = req.body.indata == "true" ? new Date(`2024-10-17T${req.body.inTime}`) : new Date(`2024-10-17T${req.body.outTime}`);
// //     const d2 = req.body.indata == "true" ? new Date(`2024-10-17T09:30:00`) : new Date(`2024-10-17T12:30:00`);

// //     const diffInMillis = Math.abs(d1 - d2);
// //     const mindiff = Math.floor(diffInMillis / (1000 * 60));
// //     const hours = Math.floor(mindiff / 60);
// //     const minutes = Math.floor(mindiff % 60);
// //     const seconds = Math.floor((diffInMillis % (1000 * 60)) / 1000);


// //     console.log(`${hours} Hours : ${minutes} Minutes : ${seconds}`)
// //     const setToday = req.body.indata == "true" ? "09:30:00" : "04:20:00"
// //     const textContent = req.body.indata == "true" ?
// //         `Dear Mr./Mrs. ${req.body.studentName},

// //     We would like to inform you that you entered the classroom at ${req.body.inTime} on ${req.body.inDate}, and you are currently ${hours} hours, ${minutes} minutes, and ${seconds} seconds late.

// //     This email serves as a notification regarding the latecomers project, which aims to promote punctuality and improve attendance.

// //     Thank you for your attention to this matter. If you have any questions, please feel free to reach out.`
// //         :
// //         `Dear Mr./Mrs. ${req.body.studentName},

// //      We would like to inform you that you exited the classroom at ${req.body.outTime} on ${req.body.outDate}, which was ${hours} hours, ${minutes} minutes, and ${seconds} seconds before the class officially ended.

// //     This email serves as a notification regarding the project focused on promoting attendance and discouraging early departures from class.

// //     Thank you for your attention to this matter. This mail is only on the Testing Purpose`

// //     let mailOptions = {
// //         from: 'saichanduadapa951@gmail.com',
// //         to: req.body.email,
// //         subject: 'Latecomers Project Testing',
// //         text: textContent
// //     };


// //     transporter.sendMail(mailOptions, function (error, info) {
// //         if (error) {
// //             console.log(error);
// //             return res.status(500).send('Error sending email');
// //         }
// //         console.log('Email sent: ' + info.response);
// //         res.status(200).send('Email sent successfully');
// //     });
// // }

// //Create a transporter object
// // const transporter = nodemailer.createTransport({
// //     host: 'smtp.office365.com',
// //     port: 587,
// //     secure: false,
// //     auth: {
// //         user: 'samuel@technicalhub.io',
// //         pass: 'qrpdqlbwfphgnpkd'
// //     }
// // });

// // const sendOutLookMail = () =>{
// //     console.log("Mail is Sending...." + process.env.OUTLOOK_USER);

// //     const mailOptions = {
// //         from: 'samuel@technicalhub.io',
// //         // to: 'durgasaiprasad@technicalhub.io',
// //         to : "hanumanth@technicalhub.io",
// //         subject: 'Hello This is for Late Comers project Testing purpose',
// //         text: 'Late Comers Project is Working Fine',
// //         // html: '<b>This is a test email sent using Nodemailer!</b>'
// //     };

// //     transporter.sendMail(mailOptions, (error, info) => {
// //         if (error) {
// //             return console.log('Error: ', error);
// //         }
// //         console.log('Message sent: %s', info.messageId);
// //     });
// // }

// // const transporter = nodemailer.createTransport({
// //     host: 'smtp.gmail.com',
// //     port: 587,
// //     secure: false, // Set to false for STARTTLS
// //     auth: {
// //         user: process.env.OUTLOOK_USER, // Use environment variables for security
// //         pass: process.env.OUTLOOK_PASS
// //     },
// //     // tls: {
// //     //     ciphers: 'SSLv3',
// //     //     rejectUnauthorized: false // Optional, can be omitted if you want to enforce strict security
// //     // }
// // });

// const sendOutLookMail = () => {
//     // Example of sending an email
//     const mailOptions = {
//         from: 'saichanduadapa951@gmail.com',
//         to: 'hanumanth@technicalhub.io',
//         subject: 'Test email',
//         text: 'This mail is for testing the mails which send from gmail to the OutLook mail'
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Email sent: ' + info.response);
//     });
// };

// // sendOutLookMail()


// // sent Auto Time Mails
// // const autoMails = (req, res) => {
// //     console.log("Mail is Sending ....");

// //     const mailOptions = {
// //         from: "saichanduadapa951@gmail.com",
// //         to: "sirigiriramanjanuyulu7@gmail.com",
// //         subject: "This is a Testing Mail",
// //         text: "Hello Mr. Ramanjanuyulu, this mail is for testing purposes."
// //     };

// //     transporter.sendMail(mailOptions, (error, info) => {
// //         if (error) {
// //             return console.log("Error: ", error);
// //         }
// //         console.log("Mail Sent Successfully: %s", info.messageId);
// //     });
// // };


// // sendOutLookMail();


// const getApiData = async (college, todayDate) => {
//     try {
//         const branch = "ALL BRANCHES";
//         const url = `http://localhost:5000/api/college-Branch-Date-Data/${college}/${branch}/${todayDate}/${todayDate}`;
//         const result = await axios.get(url);
//         console.log("Data is retrieved successfully from the API...");
//         return result.data.excelData;
//     } catch (err) {
//         console.log('Error fetching data:', err);
//         throw err;
//     }
// };



// const getCollegeDatawithnames = async (college) => {
//     try {
//         const bbbb = moment(new Date(),"YYYY-MM-DD").format("DD-MM-YYYY")
//         console.log(bbbb)
//         const url = `http://localhost:5000/api/get-brachwise-fullname`
//         const fulldata = await axios.post(url, { datee: bbbb, college: college })
//         // console.log(fulldata.data);
//         return fulldata.data;
//     } catch (err) {
//         console.error(err);
//     }
// }

// // Create a new workbook and convert data to an Excel file
// const createExcel = (data) => {
//     const wb = XLSX.utils.book_new();

//     const cleanData = data && data.map(item => ({
//         studentName: item.studentName,
//         studentRoll: item.studentRoll,
//         college: item.college,
//         branch: item.branch,
//         gender: item.gender,
//         fatherName: item.fatherName,
//         fatherMobile: item.fatherMobile,
//         date: item.date,
//         inTime: item.inTime,
//     }));

//     // Convert the clean data (array of objects) to a worksheet
//     const ws = XLSX.utils.json_to_sheet(cleanData);

//     // Append the worksheet to the workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

//     // Write the workbook to a buffer
//     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
//     console.log("Excel file created successfully.");
//     console.log(excelBuffer);
//     return excelBuffer;
// };

// // create tableMail
// const createTable = async (data, clgname) => {
//     console.log("hiii");
//     console.log(data);
//     const today = new Date();
//     const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
//     const formattedDate = today.toLocaleDateString('en-US', options);
//     var allColleges = [
//         {
//             _id: "ADITYA UNIVERSITY",
//             totalStudents: 0
//         },
//         {
//             _id: "ADITYA COLLEGE OF ENGINEERING AND TECHNOLOGY",
//             totalStudents: 0
//         },
//         {
//             _id: "ADITYA COLLEGE OF PHARMACY",
//             totalStudents: 0
//         },
//         {
//             _id: "ADITYA GLOBAL BUSINESS SCHOOL",
//             totalStudents: 0
//         },
//         {
//             _id: "ADITYA DEGREE AND PG COLLEGE",
//             totalStudents: 0
//         },
//         {
//             _id: "ADITYA ENGINEERING COLLEGE (POLYTECHNIC-255)",
//             totalStudents: 0
//         },
//         {
//             _id: "ADITYA COLLEGE OF ENGINEERING & TECHNOLOGY (POLYTECHNIC-249)",
//             totalStudents: 0
//         },
//         {
//             _id: "ADITYA PHARMACY COLLEGE",
//             totalStudents: 0
//         },
//         {
//             _id: "ADITYA GLOBAL BUSINESS SCHOOL (ACET)",
//             totalStudents: 0
//         }
//     ];


//     var dataaaa = await getCollegeDatawithnames(data);
    
    
//     if(data == "ALL"){
//         allColleges.map(item => {
//             const matchedCollege = dataaaa.find(dataItem => dataItem._id === item._id);
//             if (matchedCollege) {
//                 item.totalStudents = Math.max(item.totalStudents, matchedCollege.totalStudents);
//             }
//         });
//     }
//     else {
//         allColleges = dataaaa;
//     }
//     // console.log(allColleges)


//     const dataTable = `<head><style>.farming{display:flex;flex-direction:column;justify-content:center;align-items:center;gap-20px;}</style></head>
//         <body><center><div class="farming">
//         <div style="width:300px;"><img src="https://adityauniversity.in/static/media/AU-logo.d4c9addb1494f8538d6a.jpg" alt="aditya logo"/></div>
//         <div><h3>Dear Sir/Madam,</h3></div>
//         <div><h3>Please find the following details of Late Comers on <span style="color:#fb8500;">${formattedDate}</span>, Institution wise.</h3></div>
//         <table style='border: 2px solid #333; border-collapse:collapse; width: 70%; font-family: Arial, sans-serif; font-size: 1.1em;'>
//                 <thead>
//                     <tr style='background:#364156;color:#f1faee;'>
//                         <th style='padding:10px;border: 2px solid black;'>S.No</th>
//                         <th style='padding:10px;border: 2px solid black;'>${clgname}</th>
//                         <th style='padding:10px;border: 2px solid black;'>Count</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${allColleges.map((item, index) =>
//         `<tr style="background-color: ${index % 2 === 0 ? '#9fffcb' : '#e3f2fd'};">
//                             <td style="padding:10px;border: 2px solid black;">${index + 1}</td>
//                             <td style="padding:10px;border: 2px solid black;">${item._id}</td>
//                             <td style="padding:10px;border: 2px solid black;">${item.totalStudents}</td>
//                         </tr>`).join('')}
//                         <tr>
//                             <td colspan="2" style="padding:10px; text-align: center; font-weight: bold;border: 2px solid black;">Total Late Comers:</td>
//                             <td style="padding:10px; text-align: center; font-weight: bold;border: 2px solid black;">
//                             ${allColleges.reduce((acc, curr) => acc + curr.totalStudents, 0)}</td>
//                     </tr>
//                 </tbody>
//             </table>
//             <div><h3>Regards, P.B.S.J.Chakravarthi, Campus Incharge, 7731886664</h3></div>
//             </div>
//             </center>
//             </body>`;
//     return dataTable;
// };

// // Send the email with the Excel file attached
// const sendingMails = (mail, attachment, clg, table) => {
//     try {
//         console.log("Sending email...");
//         const mailOptions = {
//             from: 'saichanduadapa951@gmail.com',
//             to: mail,
//             subject: `Today Late Comers Of ${clg}`,
//             // text: `This is the today Late Comers data Regarding the ${clg}. Please find the attached Excel file.`,
//             attachments: [
//                 {
//                     filename: `TodayLateComersOf${clg}.xlsx`,
//                     content: attachment,
//                     contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//                 }
//             ],
//             html: table
//         };
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return console.log('Error occurred: ' + error.message);
//             }
//             console.log('Email sent successfully: ' + info.response);
//         });
//     } catch (err) {
//         console.error('Error sending email:', err);
//     }
// };

// // Main function to fetch data, create Excel, and send emails
// const mainFun = async (check) => {
//     const overallMails = ['bhanumanthu450@gmail.com', 'durgasaiprasad@technicalhub.io', 'saigangadharsgk@gmail.com'];
//     const individualMails = [
//         { 'ADITYA UNIVERSITY': "kunchapuammoru@gmail.com" },
//         { "ADITYA COLLEGE OF ENGG. & TECH.": 'mahidhargudipudi19@gmail.com' },
//         { 'ADITYA PHARMACY COLLEGE': 'vajjalaabhiram@gmail.com' },
//         { "ADITYA COLLEGE OF PHARMACY": 'akondiathreya@gmail.com' },
//         { "ADITYA POLYTECHNICAL COLLEGE": 'sonaliflorence@gmail.com' },
//         { "ADITYA GLOBAL BUSINESS SCHOOL": 'JYOTHIMAMIDIPALLI22@gamil.com' },
//         { "ADITYA DEGREE AND PG COLLEGE": 'bhanumanthu450@gmail.com' },
//     ];

//     const date = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
//     if (check === "All Data") {
//         const todayData = await getApiData("ALL COLLEGES", date);
//         console.log(todayData);
//         const excel = createExcel(todayData);
        
//         const tableData = await createTable("ALL", "College");
//         sendingMails("akondiathreya@gmail.com", excel, "ALL COLLEGES", tableData);

//         sendingMails("akondiathreya@gmail.com", excel, "ALL COLLEGES", tableData);
//         // overallMails.forEach(mail => {
//         //     sendingMails(mail, excel, "ALL COLLEGES", tableData);
//         // });
//     } else {
//         for (const collegeMail of individualMails) {
//             const [college, mail] = Object.entries(collegeMail)[0];
//             const todayData = await getApiData(college, date);
//             const excel = createExcel(todayData);
//             const tableData = await createTable(college, "Branch");
//             console.log(college);

//             // sendingMails(mail, excel, college, tableData);
//             sendingMails("akondiathreya@gmail.com", excel, college, tableData);
//             break;
//         }
//     }
// };


// cron.schedule('09 23 * * 1-6', () => {
//     console.log("Scheduled job starting...");
//     mainFun("All Data");
//     mainFun("Individual Data");
//     console.log("Scheduled job executed successfully.");
// });



// module.exports = { sendingMails };




























const nodemailer = require("nodemailer");
const cron = require('node-cron');
require('dotenv').config();
const XLSX = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const axios = require("axios");

// Create the transporter
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'saichanduadapa951@gmail.com',
        pass: 'cicd jklm fsmr plwr',
    }
});

// const sendMail = (req, res) => {
//     console.log("This is Comming for Mailing ....")
//     console.log(req.body)
//     const d1 = req.body.indata == "true" ? new Date(`2024-10-17T${req.body.inTime}`) : new Date(`2024-10-17T${req.body.outTime}`);
//     const d2 = req.body.indata == "true" ? new Date(`2024-10-17T09:30:00`) : new Date(`2024-10-17T12:30:00`);

//     const diffInMillis = Math.abs(d1 - d2);
//     const mindiff = Math.floor(diffInMillis / (1000 * 60));
//     const hours = Math.floor(mindiff / 60);
//     const minutes = Math.floor(mindiff % 60);
//     const seconds = Math.floor((diffInMillis % (1000 * 60)) / 1000);


//     console.log(`${hours} Hours : ${minutes} Minutes : ${seconds}`)
//     const setToday = req.body.indata == "true" ? "09:30:00" : "04:20:00"
//     const textContent = req.body.indata == "true" ?
//         `Dear Mr./Mrs. ${req.body.studentName},

//     We would like to inform you that you entered the classroom at ${req.body.inTime} on ${req.body.inDate}, and you are currently ${hours} hours, ${minutes} minutes, and ${seconds} seconds late.

//     This email serves as a notification regarding the latecomers project, which aims to promote punctuality and improve attendance.

//     Thank you for your attention to this matter. If you have any questions, please feel free to reach out.`
//         :
//         `Dear Mr./Mrs. ${req.body.studentName},

//      We would like to inform you that you exited the classroom at ${req.body.outTime} on ${req.body.outDate}, which was ${hours} hours, ${minutes} minutes, and ${seconds} seconds before the class officially ended.

//     This email serves as a notification regarding the project focused on promoting attendance and discouraging early departures from class.

//     Thank you for your attention to this matter. This mail is only on the Testing Purpose`

//     let mailOptions = {
//         from: 'saichanduadapa951@gmail.com',
//         to: req.body.email,
//         subject: 'Latecomers Project Testing',
//         text: textContent
//     };


//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//             return res.status(500).send('Error sending email');
//         }
//         console.log('Email sent: ' + info.response);
//         res.status(200).send('Email sent successfully');
//     });
// }

//Create a transporter object
// const transporter = nodemailer.createTransport({
//     host: 'smtp.office365.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'samuel@technicalhub.io',
//         pass: 'qrpdqlbwfphgnpkd'
//     }
// });

// const sendOutLookMail = () =>{
//     console.log("Mail is Sending...." + process.env.OUTLOOK_USER);

//     const mailOptions = {
//         from: 'samuel@technicalhub.io',
//         // to: 'durgasaiprasad@technicalhub.io',
//         to : "hanumanth@technicalhub.io",
//         subject: 'Hello This is for Late Comers project Testing purpose',
//         text: 'Late Comers Project is Working Fine',
//         // html: '<b>This is a test email sent using Nodemailer!</b>'
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log('Error: ', error);
//         }
//         console.log('Message sent: %s', info.messageId);
//     });
// }

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // Set to false for STARTTLS
//     auth: {
//         user: process.env.OUTLOOK_USER, // Use environment variables for security
//         pass: process.env.OUTLOOK_PASS
//     },
//     // tls: {
//     //     ciphers: 'SSLv3',
//     //     rejectUnauthorized: false // Optional, can be omitted if you want to enforce strict security
//     // }
// });

const sendOutLookMail = () => {
    // Example of sending an email
    const mailOptions = {
        from: 'saichanduadapa951@gmail.com',
        to: 'hanumanth@technicalhub.io',
        subject: 'Test email',
        text: 'This mail is for testing the mails which send from gmail to the OutLook mail'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

// sendOutLookMail()


// sent Auto Time Mails
// const autoMails = (req, res) => {
//     console.log("Mail is Sending ....");

//     const mailOptions = {
//         from: "saichanduadapa951@gmail.com",
//         to: "sirigiriramanjanuyulu7@gmail.com",
//         subject: "This is a Testing Mail",
//         text: "Hello Mr. Ramanjanuyulu, this mail is for testing purposes."
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log("Error: ", error);
//         }
//         console.log("Mail Sent Successfully: %s", info.messageId);
//     });
// };


// sendOutLookMail();


const getApiData = async (college, todayDate) => {
    try {
        const branch = "ALL BRANCHES";
        const url = `http://localhost:5000/api/college-Branch-Date-Data/${college}/${branch}/${todayDate}/${todayDate}`;
        const result = await axios.get(url);
        console.log("Data is retrieved successfully from the API...");
        return result.data.excelData;
    } catch (err) {
        console.log('Error fetching data:', err);
        throw err;
    }
};

const getCollegeDatawithnames = async (college) => {
    try {
        const bbbb = moment(new Date(),"YYYY-MM-DD").format("DD-MM-YYYY")
        console.log(bbbb)
        const url = `http://localhost:5000/api/get-brachwise-fullname`
        const fulldata = await axios.post(url, { datee: bbbb, college: college })
        // console.log(fulldata.data);
        return fulldata.data;
    } catch (err) {
        console.error(err);
    }
}


// Create a new workbook and convert data to an Excel file
const createExcel = (data) => {
    const wb = XLSX.utils.book_new();

    const cleanData =data && data.map(item => ({
        studentName: item.studentName,
        studentRoll: item.studentRoll,
        college: item.college,
        branch: item.branch,
        gender: item.gender,
        fatherName: item.fatherName,
        fatherMobile: item.fatherMobile,
        date: item.date,
        inTime: item.inTime,
    }));

    // Convert the clean data (array of objects) to a worksheet
    const ws = XLSX.utils.json_to_sheet(cleanData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write the workbook to a buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    console.log("Excel file created successfully.");
    return excelBuffer;
};

// create tableMail
const createTable = async (data, clgname) => {
    console.log("hiii");
    console.log(data);
    const today = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    var allColleges = [
        {
            _id: "ADITYA UNIVERSITY",
            totalStudents: 0
        },
        {
            _id: "ADITYA COLLEGE OF ENGINEERING AND TECHNOLOGY",
            totalStudents: 0
        },
        {
            _id: "ADITYA COLLEGE OF PHARMACY",
            totalStudents: 0
        },
        {
            _id: "ADITYA GLOBAL BUSINESS SCHOOL",
            totalStudents: 0
        },
        {
            _id: "ADITYA DEGREE AND PG COLLEGE",
            totalStudents: 0
        },
        {
            _id: "ADITYA ENGINEERING COLLEGE (POLYTECHNIC-255)",
            totalStudents: 0
        },
        {
            _id: "ADITYA COLLEGE OF ENGINEERING & TECHNOLOGY (POLYTECHNIC-249)",
            totalStudents: 0
        },
        {
            _id: "ADITYA PHARMACY COLLEGE",
            totalStudents: 0
        },
        {
            _id: "ADITYA GLOBAL BUSINESS SCHOOL (ACET)",
            totalStudents: 0
        }
    ];

    var dataaaa = await getCollegeDatawithnames(data);
    
    
    if(data == "ALL"){
        allColleges.map(item => {
            const matchedCollege = dataaaa.find(dataItem => dataItem._id === item._id);
            if (matchedCollege) {
                item.totalStudents = Math.max(item.totalStudents, matchedCollege.totalStudents);
            }
        });
    }
    else {
        allColleges = dataaaa;
    }
    // console.log(allColleges)


    const dataTable = `<head><style>.farming{display:flex;flex-direction:column;justify-content:center;align-items:center;gap-20px;}</style></head>
        <body><center><div class="farming">
        <div style="width:300px;"><img src="https://adityauniversity.in/static/media/AU-logo.d4c9addb1494f8538d6a.jpg" alt="aditya logo"/></div>
        <div><h3>Dear Sir/Madam,</h3></div>
        <div><h3>Please find the following details of Late Comers on <span style="color:#fb8500;">${formattedDate}</span>, Institution wise.</h3></div>
        <table style='border: 2px solid #333; border-collapse:collapse; width: 70%; font-family: Arial, sans-serif; font-size: 1.1em;'>
                <thead>
                    <tr style='background:#364156;color:#f1faee;'>
                        <th style='padding:10px;border: 2px solid black;'>S.No</th>
                        <th style='padding:10px;border: 2px solid black;'>${clgname}</th>
                        <th style='padding:10px;border: 2px solid black;'>Count</th>
                    </tr>
                </thead>
                <tbody>
                    ${allColleges.map((item, index) =>
        `<tr style="background-color: ${index % 2 === 0 ? '#9fffcb' : '#e3f2fd'};">
                            <td style="padding:10px;border: 2px solid black;">${index + 1}</td>
                            <td style="padding:10px;border: 2px solid black;">${item._id}</td>
                            <td style="padding:10px;border: 2px solid black;">${item.totalStudents}</td>
                        </tr>`).join('')}
                        <tr>
                            <td colspan="2" style="padding:10px; text-align: center; font-weight: bold;border: 2px solid black;">Total Late Comers:</td>
                            <td style="padding:10px; text-align: center; font-weight: bold;border: 2px solid black;">
                            ${allColleges.reduce((acc, curr) => acc + curr.totalStudents, 0)}</td>
                    </tr>
                </tbody>
            </table>
            <div><h3>Regards, P.B.S.J.Chakravarthi, Campus Incharge, 7731886664</h3></div>
            </div>
            </center>
            </body>`;
    return dataTable;
};


// Send the email with the Excel file attached
const sendingMails = (mail, attachment, clg, table) => {
    try {
        console.log("Sending email...");
        const mailOptions = {
            from: 'saichanduadapa951@gmail.com',
            to: mail,
            subject: `Today Late Comers Of ${clg}`,
            // text: `This is the today Late Comers data Regarding the ${clg}. Please find the attached Excel file.`,
            attachments: [
                {
                    filename: `TodayLateComersOf${clg}.xlsx`,
                    content: attachment,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            ],
            html: table
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error occurred: ' + error.message);
            }
            console.log('Email sent successfully: ' + info.response);
        });
    } catch (err) {
        console.error('Error sending email:', err);
    }
};

// Main function to fetch data, create Excel, and send emails
const mainFun = async (check) => {
    const overallMails = ['bhanumanthu450@gmail.com', 'durgasaiprasad@technicalhub.io', 'saigangadharsgk@gmail.com'];
    const individualMails = [
        { 'ADITYA UNIVERSITY': "kunchapuammoru@gmail.com" },
        { "ADITYA COLLEGE OF ENGG. & TECH.": 'mahidhargudipudi19@gmail.com' },
        { 'ADITYA PHARMACY COLLEGE': 'vajjalaabhiram@gmail.com' },
        { "ADITYA COLLEGE OF PHARMACY": 'akondiathreya@gmail.com' },
        { "ADITYA POLYTECHNICAL COLLEGE": 'sonaliflorence@gmail.com' },
        { "ADITYA GLOBAL BUSINESS SCHOOL": 'JYOTHIMAMIDIPALLI22@gamil.com' },
        { "ADITYA DEGREE AND PG COLLEGE": 'bhanumanthu450@gmail.com' },
    ];


    const date = moment(new Date(),"YYYY-MM-DD").format("DD-MM-YYYY")
    if (check === "All Data") {
        const todayData = await getApiData("ALL COLLEGES", date);
        console.log(todayData);
        const excel = createExcel(todayData);
        
        const tableData = await createTable("ALL", "College");
        // sendingMails("akondiathreya@gmail.com", excel, "ALL COLLEGES", tableData);
        overallMails.forEach(mail => {
            sendingMails(mail, excel, "ALL COLLEGES", tableData);
        });
    } else {
        for (const collegeMail of individualMails) {
            const [college, mail] = Object.entries(collegeMail)[0];
            const todayData = await getApiData(college, date);
            const excel = createExcel(todayData);
            
            
            const tableData = await createTable(college, "Branch");

            sendingMails(mail, excel, college, tableData);
            // sendingMails("akondiathreya@gmail.com", excel, college, tableData);
            // break;
        }
    }
};


// cron.schedule('35 23 * * 1-6', () => {
//     console.log("Scheduled job starting...");
//     mainFun("All Data");
//     mainFun("Individual Data");
//     console.log("Scheduled job executed successfully.");
// });



module.exports = { sendingMails };

