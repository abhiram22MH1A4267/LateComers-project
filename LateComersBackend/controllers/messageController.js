const studentData = require("../models/studentsSchema");
const axios = require("axios");
const cron = require("node-cron");
const testingSchema = require("../models/Testing")

// const StudentWeeklyMessageSender = async (req, res) => {
//     const toDate = moment(new Date()).format('DD-MM-YYYY');
//     const specificDate = moment(new Date(), "DD-MM-YYYY");
//     const prevDate = specificDate.subtract(6, 'days');
//     const fromDate = moment(prevDate).format('DD-MM-YYYY');
//     console.log(fromDate, toDate, req.body.roll);

//     const Filtered_Data = await studentData.aggregate([
//         {
//             $match: {
//                 date: {
//                     $gte: fromDate,
//                     $lte: toDate
//                 },
//                 studentRoll: req.body.roll
//             }
//         },
//         {
//             $group: {
//                 _id: "$studentRoll",
//                 studentName: { $first: "$studentName" },
//                 studentMobile: { $first: "$studentMobile" },
//                 dates: {
//                     $push: "$date"
//                 },
//             }
//         }
//     ]
//     )
//     let studentRecord ;
//     if(Filtered_Data.length != 0 ){
//     // Filtered_Data[0].dates.push(toDate);
//     const dates = Filtered_Data[0].dates.map((date) => {
//         return new Date(date);
//     });

//     let maxConsecutiveDays = 0;
//     let currentStreak = 1;
//     let currentStreakDates = [moment(dates[0]).format("DD-MM-YYYY")];
//     currentStreakDates.push(" , ");
//     let MaxStreakDates = [];

//     for (let i = 1; i < dates.length; i++) {
//         const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

//         if (diff === 1 || (diff === 2 && dates[i - 1].getDay() === 6 && dates[i].getDay() === 1)) {
//             currentStreak++;
//             currentStreakDates.push(moment(dates[i]).format("DD-MM-YYYY"));
//             currentStreakDates.push(" , ");
//         } else {
//             if (currentStreak > maxConsecutiveDays) {
//                 maxConsecutiveDays = currentStreak;
//                 MaxStreakDates = [...currentStreakDates];
//             }
//             currentStreak = 1;
//             currentStreakDates = [moment(dates[i]).format("DD-MM-YYYY")];
//             currentStreakDates.push(" , ");
//         }
//     }

//     if (currentStreak > maxConsecutiveDays) {
//         maxConsecutiveDays = currentStreak;
//         MaxStreakDates = [...currentStreakDates];
//     }

//      studentRecord = { ...Filtered_Data[0], weekCount: maxConsecutiveDays, consecutiveDates: MaxStreakDates }

// }
// else{
//      studentRecord = { ...Filtered_Data[0], weekCount: 1, consecutiveDates: 1}
// }
// console.log(studentRecord)
// if(studentRecord.weekCount >= 3){
//     // axios.get(`https://pgapi.visp.in/fe/api/v1/multiSend?username=aditrpg1.trans&password=9x7Dy&unicode=false&from=ADIUNI&to=${studentRecord.studentMobile}&text=Dear+Parent,+${studentRecord.studentName}+arrived+late+to+the+college+${studentRecord.weekCount}+days+in+this+week.+Please+advice+your+ward+to+attend+the+college+with+out+delay.+PRINCIPAL-ADITYA`)
//     // .then((result) => {
//     //         console.log("success Week" + result)
//     //     })
//     //     .catch((error) => {
//     //         console.log("error" + error);
//     //     })

//     return res.status(200).json("Successfully sended the week SMS");
// }

// }

// const WeeklyReport = async (req, res) => {
//     try {
//         console.log(req.body)
//         const  rollNumber  = req.body.roll;
//         console.log(rollNumber)
//         if (!rollNumber) {
//             return res.status(400).send({ message: "Roll number is required" });
//         }

//         const toDate = new Date();
//         const fromDate = new Date();
//         fromDate.setDate(fromDate.getDate() - 6);
//         fromDate.setHours(0, 0, 0, 0);
//         toDate.setHours(23, 59, 59, 999);

//         const result = await studentData.aggregate([
//             {
//                 $match: {
//                     studentRoll: rollNumber,
//                     date: { $gte: fromDate, $lte: toDate },
//                 },
//             },
//             {
//                 $sort: { date: -1 }, // Sort dates in descending order
//             },
//             {
//                 $group: {
//                     _id: "$studentRoll",
//                     studentName: { $first: "$studentName" },
//                     studentMobile: { $first: "$studentMobile" },
//                     date: { $push: "$date" }, // Array of attendance dates
//                 },
//             },
//         ]);

//         console.log(result)

//         if (result.length === 0) {
//             return res.status(404).send({ message: "No records found for the given roll number" });
//         }

//         const student = result[0];
//         const dates = student.date.map((d) => new Date(d)).sort((a, b) => b - a);

//         let consecutiveCount = 1;

//         for (let i = 1; i < dates.length; i++) {
//             const currDate = dates[i - 1];
//             const prevDate = dates[i];
//             const diffInDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

//             if (
//                 diffInDays === 1 || // Consecutive days
//                 (diffInDays === 2 && currDate.getDay() === 1 && prevDate.getDay() === 6) // Skip Sunday
//             ) {
//                 consecutiveCount++;
//             } else {
//                 break; // Stop counting if the sequence breaks
//             }
//         }

//         if (consecutiveCount >= 3) {
//             return res.status(200).send({
//                 studentName: student.studentName,
//                 studentMobile: student.studentMobile,
//                 consecutiveCount,
//             });
//         } else {
//             return res.status(200).send({ message: "Consecutive attendance days are less than 3" });
//         }
//     } catch (error) {
//         console.error("Error in WeeklyReport:", error);
//         res.status(500).send({ message: "Internal server error" });
//     }
// };

// const WeeklyReport = async (req, res) => {
//     try {
//         console.log(req.body);
//         const rollNumber = req.body.roll;
//         console.log(rollNumber);

//         if (!rollNumber) {
//             return res.status(400).send({ message: "Roll number is required" });
//         }

//         const toDate = new Date();
//         const fromDate = new Date();
//         fromDate.setDate(fromDate.getDate() - 6);
//         fromDate.setHours(0, 0, 0, 0);
//         toDate.setHours(23, 59, 59, 999);

//         const result = await studentData.aggregate([
//             {
//                 $match: {
//                     studentRoll: rollNumber,
//                     date: { $gte: fromDate, $lte: toDate },
//                 },
//             },
//             {
//                 $sort: { date: -1 }, // Sort dates in descending order
//             },
//             {
//                 $group: {
//                     _id: "$studentRoll",
//                     studentName: { $first: "$studentName" },
//                     studentMobile: { $first: "$studentMobile" },
//                     date: { $push: "$date" }, // Array of attendance dates
//                 },
//             },
//         ]);

//         console.log(result)

//         if (result.length === 0) {
//             return res.status(404).send({ message: "No records found for the given roll number" });
//         }

//         const student = result[0];
//         const dates = student.date.map((d) => new Date(d)).sort((a, b) => b - a);

//         let consecutiveCount = 1;

//         for (let i = 1; i < dates.length; i++) {
//             const currDate = dates[i - 1];
//             const prevDate = dates[i];
//             const diffInDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

//             // Check for consecutive days including skipping Sunday
//             if (
//                 diffInDays === 1 || // Consecutive days
//                 (diffInDays === 2 && currDate.getDay() === 1 && prevDate.getDay() === 0) // Skip from Saturday to Monday
//             ) {
//                 consecutiveCount++;
//             } else {
//                 break; // Stop counting if the sequence breaks
//             }
//         }

//         if (consecutiveCount >= 3) {
//             return res.status(200).send({
//                 studentName: student.studentName,
//                 studentMobile: student.studentMobile,
//                 consecutiveCount,
//             });
//         } else {
//             return res.status(200).send({ message: "Consecutive attendance days are less than 3" });
//         }
//     } catch (error) {
//         console.error("Error in WeeklyReport:", error);
//         res.status(500).send({ message: "Internal server error" });
//     }
// };

// const StudentWeeklyMessageSender = async (req, res) => {
//   const toDate = new Date();
//   const fromDate = new Date();
//   fromDate.setDate(fromDate.getDate() - 6);

//   const Filtered_Data = await studentData.aggregate([
//     {
//       $match: {
//         date: {
//           $gte: fromDate,
//           $lte: toDate,
//         },
//         studentRoll: req.body.roll,
//       },
//     },
//     {
//       $group: {
//         _id: "$studentRoll",
//         studentName: { $first: "$studentName" },
//         studentMobile: { $first: "$studentMobile" },
//         dates: {
//           $push: "$date",
//         },
//       },
//     },
//   ]);

//   let studentRecord;
//   if (Filtered_Data.length !== 0) {
//     const dates = Filtered_Data[0].dates.map((date) => {
//       const d = new Date(date);
//       d.setUTCHours(0, 0, 0, 0);
//       return d.toISOString();
//     });

//     let maxConsecutiveDays = 0;
//     let currentStreak = 1;
//     let currentStreakDates = [dates[0]];
//     currentStreakDates.push(" , ");
//     let MaxStreakDates = [];

//     for (let i = 1; i < dates.length; i++) {
//       const diff =
//         (new Date(dates[i]) - new Date(dates[i - 1])) / (1000 * 60 * 60 * 24);

//       if (diff === 1 ||(diff === 2 && new Date(dates[i - 1]).getDay() === 6 && new Date(dates[i]).getDay() === 0)) {
//         currentStreak++;
//         currentStreakDates.push(dates[i]);
//         currentStreakDates.push(" , ");
//       }
//       else {
//         if (currentStreak > maxConsecutiveDays) {
//           maxConsecutiveDays = currentStreak;
//           MaxStreakDates = [...currentStreakDates];
//         }
//         currentStreak = 1;
//         currentStreakDates = [dates[i]];
//         currentStreakDates.push(" , ");
//       }
//     }

//     if (currentStreak > maxConsecutiveDays) {
//       maxConsecutiveDays = currentStreak;
//       MaxStreakDates = [...currentStreakDates];
//     }

//     studentRecord = {
//       ...Filtered_Data[0],
//       weekCount: maxConsecutiveDays,
//       consecutiveDates: MaxStreakDates,
//     };
//   } else {
//     studentRecord = {
//       ...Filtered_Data[0],
//       weekCount: 1,
//       consecutiveDates: ["No data"],
//     };
//   }

//   console.log("Student Record:", studentRecord);

//   if (studentRecord.weekCount >= 3) {
//     // Uncomment and replace with your messaging API code (e.g., using axios for SMS)
//     // axios.get(https://pgapi.visp.in/fe/api/v1/multiSend?username=aditrpg1.trans&password=9x7Dy&unicode=false&from=ADIUNI&to=${studentRecord.studentMobile}&text=Dear+Parent,+${studentRecord.studentName}+arrived+late+to+the+college+${studentRecord.weekCount}+days+in+this+week.+Please+advise+your+ward+to+attend+the+college+without+delay.+PRINCIPAL-ADITYA)
//     //     .then((result) => {
//     //         console.log("Success Week", result);
//     //     })
//     //     .catch((error) => {
//     //         console.log("Error", error);
//     //     });

//     return res.status(200).json("Successfully sent the week SMS.");
//   } else {
//     return res
//       .status(200)
//       .json(
//         "Student's weekly record does not meet the criteria for sending SMS."
//       );
//   }
// };

const StudentWeeklyMessageSender = async (req, res) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 6);
  console.log("getingggg");
  console.log(fromDate, toDate);

  const Filtered_Data = await studentData.aggregate([
    {
      $match: {
        date: {
          $gte: fromDate,
          $lte: toDate,
        },
        studentRoll: req.body.roll,
      },
    },
    {
      $group: {
        _id: "$studentRoll",
        studentName: { $first: "$studentName" },
        studentMobile: { $first: "$studentMobile" },
        dates: { $push: "$date" },
      },
    },
  ]);

  console.log(Filtered_Data);

  let studentRecord;

  if (Filtered_Data.length !== 0) {
    const dates = Filtered_Data[0].dates
      .sort((a, b) => b - a)
      .map((date) => {
        const d = new Date(date);
        d.setUTCHours(0, 0, 0, 0);
        return d.toISOString();
      });

    let maxConsecutiveDays = 0;
    let currentStreak = 1;
    let currentStreakDates = [dates[0]];
    let MaxStreakDates = [];

    for (let i = 0; i < dates.length - 1; i++) {
      const diff =
        (new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24);

      if (
        diff === 1 ||
        (diff === 2 &&
          new Date(dates[i - 1]).getDay() === 6 &&
          new Date(dates[i]).getDay() === 0)
      ) {
        currentStreak++;
        currentStreakDates.push(dates[i + 1]);
      } else {
        studentRecord = {
          ...Filtered_Data[0],
          weekCount: currentStreak,
          consecutiveDates: currentStreakDates,
        };
        break;
      }
    }

    if (!studentRecord) {
      studentRecord = {
        ...Filtered_Data[0],
        weekCount: currentStreak,
        consecutiveDates: currentStreakDates,
      };
    }
    console.log("Student Record:", studentRecord);

    if (studentRecord.weekCount >= 3) {
        console.log("Student Record:", studentRecord);
      axios
        .get(`https://pgapi.vispl.in/fe/api/v1/username=aditrpg1.trans&password=9x7Dy&unicode=false&from=ADIUNI&to=${studentRecord.studentMobile}&text=Dear+Parent,+${studentRecord.studentName}+arrived+late+to+the+college+${studentRecord.weekCount}+days+in+this+week.+Please+advice+your+ward+to+attend+the+college+with+out+delay.+PRINCIPAL-ADITYA`)
        .then((result) => {
          console.log("success Week" + result);
        })
        .catch((error) => {
          console.log("error" + error);
        });

      console.log(`Successfully sent the week SMS to ${studentRecord._id}`);
      return res.status(200).json("Successfully sent the week SMS.");
    } else {
      console.log(
        `Student's weekly record does not meet the criteria for sending SMS to ${studentRecord._id}`
      );
      return res.status(200).json(
          "Student's weekly record does not meet the criteria for sending SMS."
        );
    }
  }
};

const studentInformMessage = async (fromDate, toDate) => {
  const day = toDate.getUTCDate();
  console.log(fromDate + "  " + toDate + " " + day);
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);
  const data = await studentData.aggregate([
    {
      $match: {
        date: {
          $gte: fromDate,
          $lte: toDate,
        },
      },
    },
    {
      $group: {
        _id: "$studentRoll",
        Count: { $sum: 1 },
        Name: { $first: "$studentName" },
        StudentMobile: { $first: "$studentMobile" },
      },
    },
  ]);
  console.log(data);

  console.log("This data is from studentInformMessage function");
  data.forEach((student) => {
    axios.get(
      `https://pgapi.vispl.in/fe/api/v1/username=aditrpg1=9x7Dy&unicode=false&from=ADIUNI&to=${
        student.studentMobile
      }&text=Dear+Parent,+${student.Name}+arrived+late+to+the+college+${
        student.Count
      }+days+in+this+${`last ${day} Days`}.+Please+advice+your+ward+to+attend+the+college+with+out+delay.+PRINCIPAL-ADITYA`
    );
    console.log(
      `Dear Parent, ${student.Name} has came to college late for ${student.Count} times from last ${day} Days. Please advice your word to attend the college befor 9:30AM.`
    );
  });
};

const sendDailyMessage = async() =>{

  const today = new Date();
  const fromTime = new Date(today.setUTCHours(0, 0, 0, 0));
  const toTime = new Date(today.setUTCHours(10, 59, 59, 999));

  console.log(fromTime , toTime)
  const overallTodayData = await testingSchema.aggregate([
    {
      $match: {
        date: {
          $gte: fromTime,
          $lte: toTime,
        },
      },
    },
    {
      $group: {
        _id: 0, 
        rollNumbers: { $push: "$studentRoll" }
      },
    },
  ]); 

  console.log(overallTodayData[0].rollNumbers);
  
}



module.exports = { StudentWeeklyMessageSender };
