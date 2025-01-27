const express = require('express')
const moment = require('moment')
const studentData = require("../models/studentsSchema")
const studentDataBase = require("../models/studentDataBaseSchema")
const axios = require("axios");
const cron = require('node-cron');



const StudentWeeklyMessageSender = async (req, res) => {
    const toDate = moment(new Date()).format('DD-MM-YYYY');
    const specificDate = moment(new Date(), "DD-MM-YYYY");
    const prevDate = specificDate.subtract(6, 'days');
    const fromDate = moment(prevDate).format('DD-MM-YYYY');
    console.log(fromDate, toDate, req.body.roll);

    const Filtered_Data = await studentData.aggregate([
        {
            $match: {
                date: {
                    $gte: fromDate,
                    $lte: toDate
                },
                studentRoll: req.body.roll
            }
        },
        {
            $group: {
                _id: "$studentRoll",
                studentName: { $first: "$studentName" },
                studentMobile: { $first: "$studentMobile" },
                dates: {
                    $push: "$date"
                },
            }
        }
    ]
    )
    let studentRecord ;
    if(Filtered_Data.length != 0 ){
    // Filtered_Data[0].dates.push(toDate);
    const dates = Filtered_Data[0].dates.map((date) => {
        return new Date(date);
    });

    let maxConsecutiveDays = 0;
    let currentStreak = 1;
    let currentStreakDates = [moment(dates[0]).format("DD-MM-YYYY")];
    currentStreakDates.push(" , ");
    let MaxStreakDates = [];

    for (let i = 1; i < dates.length; i++) {
        const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

        if (diff === 1 || (diff === 2 && dates[i - 1].getDay() === 6 && dates[i].getDay() === 1)) {
            currentStreak++;
            currentStreakDates.push(moment(dates[i]).format("DD-MM-YYYY"));
            currentStreakDates.push(" , ");
        } else {
            if (currentStreak > maxConsecutiveDays) {
                maxConsecutiveDays = currentStreak;
                MaxStreakDates = [...currentStreakDates];
            }
            currentStreak = 1;
            currentStreakDates = [moment(dates[i]).format("DD-MM-YYYY")];
            currentStreakDates.push(" , ");
        }
    }

    if (currentStreak > maxConsecutiveDays) {
        maxConsecutiveDays = currentStreak;
        MaxStreakDates = [...currentStreakDates];
    }


     studentRecord = { ...Filtered_Data[0], weekCount: maxConsecutiveDays, consecutiveDates: MaxStreakDates }

}
else{
     studentRecord = { ...Filtered_Data[0], weekCount: 1, consecutiveDates: 1}
}
console.log(studentRecord)
if(studentRecord.weekCount >= 3){
    axios.get(`https://pgapi.visp.in/fe/api/v1/multiSend?username=aditrpg1.trans&password=9x7Dy&unicode=false&from=ADIUNI&to=${studentRecord.studentMobile}&text=Dear+Parent,+${studentRecord.studentName}+arrived+late+to+the+college+${studentRecord.weekCount}+days+in+this+week.+Please+advice+your+ward+to+attend+the+college+with+out+delay.+PRINCIPAL-ADITYA`) 
    .then((result) => {
            console.log("success Week" + result)
        })
        .catch((error) => {
            console.log("error" + error);
        })

    return res.status(200).json("Successfully sended the week SMS");
}

}


const studentInformMessage = async (date, day) => {
    console.log(date + "  " + day)
    const data = await studentData.aggregate([
        {
            $match: {
                date: {
                    $gte: `${date}-01`,
                    $lte: `${date}-${day}`
                }
            }
        }
        , {
            $group: {
                _id: "$studentRoll",
                Count: { $sum: 1 },
                Name: { $first: "$studentName" },
                FatherMobile: { $first: "$fatherMobile" }, 
            }
        }
    ])

    console.log("This data is from studentInformMessage function")
    data.forEach(student => {
        console.log(`Dear Parent, ${student.Name} has came to college late for ${student.Count} times from last ${day} Days. Please advice your word to attend the college befor 9:30AM.`)
    });
    
}


//'30 10 15,28,30 * *'

// cron.schedule('30 10 15,28,30 * *', () => {
//     console.log("Message Scheduled job starting...");
//     const currentDate = new Date();
//     const day = currentDate.getDate();
//     const month = currentDate.getMonth();
//     const date = moment(currentDate).format('YYYY-MM');
//     studentInformMessage(date, 30);
//     if (month === 1) {
//         if (day === 28) {
//             studentInformMessage(date, 28);
//         }
//     }
//     else if (day === 15) {
//         studentInformMessage(date, 15);
//     }
//     else if (day === 30) {
//         studentInformMessage(date, 30);
//     }
//     console.log("Message Scheduled job executed successfully.");
// });



// cron.schedule('22 10 * * 1-6', () => {
//     console.log("Message Scheduled job starting...");
//     const date = moment(new Date()).format('YYYY-MM');
//     studentInformMessage(date)
//     console.log("Message Scheduled job executed successfully.");
// });


module.exports = { StudentWeeklyMessageSender } 