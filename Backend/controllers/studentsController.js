const moment = require('moment')
const studentData = require("../models/studentsSchema")
const studentDataBase = require("../models/studentDataBaseSchema")
const axios = require("axios");
const studentsSchema = require("../models/studentsSchema");

// to get the College Wise Count 
const collegeWiseStudentCount = async (req, res) => {
    const month = moment(new Date()).format('YYYY-MM')
    const todayString = moment(new Date()).format('DD-MM-YYYY');
    try {
        const overallData = await studentData.aggregate([
            {
                $match: {
                    date: {
                        $gte: `${month}-01`,
                        $lte: todayString
                    }
                }
            },
            {
                $group: {
                    _id: "$college",
                    Count: { $sum: 1 }
                }
            }
        ]);
        const todayData = await studentData.aggregate([
            {
                $match: {
                    date: todayString
                }
            },
            {
                $group: {
                    _id: "$college",
                    Count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            "ALL COLLEGES": {
                today: 0,
                overall: 0
            }
        };

        todayData.forEach(ele => {
            result[ele._id.toUpperCase()] = { today: ele.Count, overall: 0 };
            result["ALL COLLEGES"].today += ele.Count;
        });

        overallData.forEach(ele => {
            const college = ele._id.toUpperCase();
            if (!result[college]) {
                result[college] = { today: 0, overall: ele.Count };
            } else {
                result[college].overall = ele.Count;
            }
            result["ALL COLLEGES"].overall += ele.Count;
        });

        // console.log(result);
        res.status(200).send(result);
    } catch (err) {
        // console.error(err);
        res.status(400).send({ error: "Not able to fetch the data", details: err.message });
    }
};

// get the Branch wise Count 
const branchWiseStudentCount = async (req, res) => {
    const clg = req.params.college;
    // console.log(clg);
    const month = moment(new Date()).format('YYYY-MM')
    const todayString = moment(new Date()).format('DD-MM-YYYY');
    try {

        let matchStage = clg === "ALL COLLEGES" ? {} : { college: clg };

        const overallData = await studentData.aggregate([
            {
                $match: {
                    ...matchStage,
                    date: {
                        $gte: `${month}-01`,
                        $lte: `${todayString}`
                    }
                }
            },
            {
                $group: {
                    _id: "$branch",
                    Count: { $sum: 1 }
                }
            }
        ]);


        const todayData = await studentData.aggregate([
            { $match: { ...matchStage, date: todayString } },
            {
                $group: {
                    _id: "$branch",
                    Count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            "ALL BRANCHES": { today: 0, overall: 0 }
        };

        let todayCount = 0;
        let overallCount = 0;

        todayData.forEach(ele => {
            todayCount += ele.Count;
            result[ele._id.toUpperCase()] = { today: ele.Count, overall: 0 };
        });

        // Process overall data
        overallData.forEach(ele => {
            overallCount += ele.Count;
            if (!result[ele._id.toUpperCase()]) {
                // console.log(!result[ele._id.toUpperCase()])
                result[ele._id.toUpperCase()] = { today: 0, overall: ele.Count };
            } else {
                result[ele._id.toUpperCase()].overall = ele.Count;
            }
        });

        result["ALL BRANCHES"].today = todayCount;
        result["ALL BRANCHES"].overall = overallCount;

        // console.log("Data fetched successfully:", result);
        res.status(200).send(result);

    } catch (err) {
        console.error("Error while getting the branch data:", err);
        res.status(400).send({ error: "Error while fetching the branch data", details: err.message });
    }
};

// to get the data based on the college, branch and Time Intervel
const collegeBranchDateData = async (req, res) => {
    // console.log(req.params);
    const clg = req.params.college;
    const dept = req.params.branch;
    const start = req.params.fromDate;
    const end = req.params.toDate;

    try {
        console.log(`${clg} --> ${dept} --> ${start} --> ${end}`);

        let matchdata = {
            date: {
                $gte: start,
                $lte: end
            }
        };


        if (clg === "ALL COLLEGES" && dept !== "ALL BRANCHES") {
            matchdata.branch = dept;
        } else if (dept === "ALL BRANCHES" && clg !== "ALL COLLEGES") {
            matchdata.college = clg;
        } else if (dept !== "ALL BRANCHES" && clg !== "ALL COLLEGES") {
            matchdata.college = clg;
            matchdata.branch = dept;
        }

        const excelData = await studentData.aggregate([
            {
                $match: matchdata
          }
        ])
        const tableData = await studentData.aggregate([
            {
                  $match: matchdata
            },
            {
                $group: {
                  _id: "$studentRoll",
                  studentRoll: { $first: "$studentRoll" },
                  studentName: { $first: "$studentName" },
                  college: { $first: "$college" },
                  branch: { $first: "$branch" },
                  studentMobile: { $first: "$studentMobile" },
                  email: { $first: "$email" },
                  gender: { $first: "$gender" },
                  fatherName: { $first: "$fatherName" },
                  fatherMobile: { $first: "$fatherMobile" },
                  passedOutYear: { $first: "$passedOutYear" },
                  collegeCode: { $first: "$collegeCode" },
                  Count : {$sum : 1},
                  date: {
                    $addToSet: "$date"
                  }
                }
              }
          ]
        );

        console.log({tableDate : tableData , excelData : excelData});
        res.status(200).send({tableDate : tableData , excelData : excelData});
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: "Not able to get the Data", details: err });
    }
};

// to get todays student data
const todayStudentData = async (req, res) => {
    // console.log(req.body.data);
    const { college, branch } = req.params;
    const dateString = moment(new Date()).format('DD-MM-YYYY');

    try {
        // console.log(college, branch);
        const matchCriteria = { date: dateString };

        if (college !== "ALL COLLEGES" && branch !== "ALL BRANCHES") {
            matchCriteria.college = college;
            matchCriteria.branch = branch;
        } else if (college === "ALL COLLEGES" && branch !== "ALL BRANCHES") {
            matchCriteria.branch = branch;
        } else if (branch === "ALL BRANCHES" && college !== "ALL COLLEGES") {
            matchCriteria.college = college;
        }

        const data = await studentData.aggregate([
            { $match: matchCriteria }
        ]);

        // console.log(data);
        res.status(200).send(data);
    }
    catch (err) {
        console.error("Error fetching data:", err);
        res.status(400).send({ error: "Not able to get the data", details: err.message });
    }
};

//to add the studentin data
const addStudentInData = async (req, res) => {
    const now = new Date();

    const roll = req.body.roll.toUpperCase();
    const date = moment(new Date()).format('DD-MM-YYYY');
    // const date = moment("25-10-2024", "DD-MM-YYYY").format('DD-MM-YYYY');
    const istDateTime = now.toLocaleString('en-GB', { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    console.log("This is Roll Number -->  ", roll)
    console.log("This is Date -->  ", date)
    console.log("This is Time -->  ", istDateTime)
    const check = await studentData.aggregate([
        {
            $match: {
                studentRoll: roll,
                date: date,
            }
        }
    ]);
    // console.log(check)
    if (check.length != 0) {
        return res.status(201).send("The data is already added");
    }

    try {
        const data = await studentDataBase.aggregate([
            {
                $match: {
                    studentRoll: roll
                }
            }
        ]);
        // console.log(data);
        if (data.length != 0) {
            // console.log("comingggg")
            // console.log(date, istDateTime, data[0])
            if(data[0].suspended && data[0].suspended == "YES"){
                return res.status(203).send({Warning : "Student is in Suspend List" , data})
            }
            else{

                data[0].date = date
                data[0].inTime = istDateTime
                data[0].outTime = "_"
                const { _id, ...newResult } = data[0]
                // console.log(newResult)
                var finalStudentData = new studentData(newResult);
                finalStudentData.save();
                res.status(200).send(finalStudentData);
            }
        }
        else {
            // console.log("testinggggggg")c
            res.status(204).send("Data not found");
        }

    } catch (err) {
        console.error(err);
        res.status(400).send({ error: "Not able to get the data", details: err.message });
    }
};

const addStudentOutData = async (req, res) => {
    console.log(req.body);
    const now = new Date();
    const roll = req.body.roll.toUpperCase();
    const date = moment(new Date()).format('DD-MM-YYYY');
    
    const istDateTime = now.toLocaleString('en-GB', { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    console.log("This is Roll Number -->  ", roll)
    console.log("This is Date -->  ", date)
    console.log("This is Time -->  ", istDateTime)
    const check = await studentData.aggregate([
        {
            $match: {
                studentRoll: roll,
                date: date,
            }
        }
    ]);
    console.log(check);
    if (check.length !== 0 && check[0].outTime != "_") {
        return res.status(201).send("The data is already added");
    }
    else if (check.length !== 0 && check[0].outTime == "_") {
        const idemp = check[0]._id;
        await studentData.findByIdAndUpdate(idemp, { "outTime": istDateTime })
            .then((result) => {
                return res.status(202).send(result)
            }).catch((er) => {
                return res.send({ "err": err.message })
            })
    }
    else {
        try {

            var Data = await studentDataBase.aggregate([
                {
                    $match: {
                        studentRoll: roll,
                    }
                }
            ]);
            // console.log(Data)
            Data[0].date = date
            Data[0].inTime = "_"
            Data[0].outTime = istDateTime
            console.log(Data)
            const finalStudentData = new studentData(Data[0]);
            finalStudentData.save();
            console.log("Student is Added Successfully")
            res.status(200).send(finalStudentData)

        } catch (err) {
            console.error(err);
            res.status(400).send({ error: "Not able to add the data", details: err.message });
        }

    }

};

// to search the student using roll and time intervel
// const searchStudent = async (req, res) => {
//     const roll = req.params.rollNo
//     const fromDate = req.params.fromDate
//     const toDate = req.params.toDate
//     console.log(roll, " ---> ", fromDate, " ---> ", toDate)
//     try {
//         var result = await studentData.aggregate([
//             {
//                 $match: {
//                     studentRoll: roll,
//                     date: {
//                         $gte: fromDate,
//                         $lte: toDate
//                     }
//                 }
//             },
//             {
//                 $group: {
//                   _id: "$studentRoll",
//                   studentRoll : {$first : "$studentRoll"},
//                   studentName : {$first :"$studentName"},
//                   college : {$first :"$college"},
//                   branch : {$first :"$branch"},
//                   studentMobile : {$first : "$studentMobile"},
//                   email : {$first : "$email"},
//                   gender : {$first :"$gender"},
//                   fatherName : {$first :"$fatherName"},
//                   fatherMobile : {$first :"$fatherMobile"},
//                   passedOutYear : {$first : "$passedOutYear"},
//                   collegeCode : {$first : "$collegeCode"},
//                   Count : {$sum : 1},
//                   date : {
//                     $addToSet : "$date"
//                   },
//                 },
                
//               }
//         ])
//         console.log(result)
//         res.status(200).send(result)
//     }
//     catch (err) {
//         console.log(err)
//         res.status(400).send({ error: "Not able to get the data", details: err })
//     }
// }
const searchStudent = async (req, res) => {
    const roll = req.params.rollNo
    const fromDate = req.params.fromDate
    const toDate = req.params.toDate
    console.log(roll, " ---> ", fromDate, " ---> ", toDate)
    try {
        var result = await studentData.aggregate([
            {
                $match: {
                    studentRoll: roll,
                    date: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            }
        ])
        console.log(result)
        res.status(200).send(result)
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ error: "Not able to get the data", details: err })
    }
}

//to get the weekly report of the students
const WeeklyReport = async (req, res) => {
    const toDate = req.body.toDate;
    const specificDate = moment(req.body.toDate, "DD-MM-YYYY");
    const prevDate = specificDate.subtract(6, 'days');
    const fromDate = moment(prevDate).format('DD-MM-YYYY');
    console.log("Entering...")
    console.log(fromDate, toDate);

    try {
        // const data = await studentsSchema.find({}).lean();
        //   console.log(data)

        const Filtered_Data = await studentsSchema.aggregate([
            {
                $match: {
                    date: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            }
        ])

        console.log(Filtered_Data);
        const studentDataMap = new Map();

        Filtered_Data.forEach((item) => {
            const studentRoll = item.studentRoll;
            const date = moment(item.date, "DD-MM-YYYY").toDate();
            if (!studentDataMap.has(studentRoll)) {
                studentDataMap.set(studentRoll, []);
            }

            studentDataMap.get(studentRoll).push({ ...item, date });
        });

        const uniqueStudentData = [];

        studentDataMap.forEach((records, studentRoll) => {
            const date = records.map(record => record.date).sort((a, b) => a - b);

            let maxConsecutiveDays = 0;
            let currentStreak = 1;
            let currentStreakDates = [moment(date[0]).format("DD-MM-YYYY")];
            let MaxStreakDates = [];

            for (let i = 1; i < date.length; i++) {
                const diff = (date[i] - date[i - 1]) / (1000 * 60 * 60 * 24);

                if (diff === 1 || (diff === 2 && date[i - 1].getDay() === 6 && date[i].getDay() === 1)) {
                    currentStreak++;
                    currentStreakDates.push(moment(date[i]).format("DD-MM-YYYY"));
                } else {
                    if (currentStreak > maxConsecutiveDays) {
                        maxConsecutiveDays = currentStreak;
                        MaxStreakDates = [...currentStreakDates];
                    }
                    currentStreak = 1;
                    currentStreakDates = [moment(date[i]).format("DD-MM-YYYY")];
                }
            }

            if (currentStreak > maxConsecutiveDays) {
                maxConsecutiveDays = currentStreak;
                MaxStreakDates = [...currentStreakDates];
            }


            const studentRecord = { ...records, weekCount: maxConsecutiveDays, date: MaxStreakDates };
            if (studentRecord.weekCount >= 3) {
                uniqueStudentData.push(studentRecord);
            }


        });

        // console.log(uniqueStudentData)

        res.status(200).json(uniqueStudentData);
    } catch (err) {
        res.send(err);
    }
};

//to get student monthly report
const studentMonthlyReport = async (req, res) => {
    console.log("hittingggg....")
    const date = req.params.date;
    console.log(date)

    const data = await studentData.aggregate([
        {
            $match: {
                date: { $regex: date }
            }
        },
        {
            $group: {
                _id: "$studentRoll",
                studentRoll : {$first : "$studentRoll"},
                studentName: { $first: "$studentName" },
                college: { $first: "$college" },
                branch: { $first: "$branch" },
                studentMobile: { $first: "$studentMobile" },
                email: { $first: "$email" },
                gender: { $first: "$gender" },
                fatherName: { $first: "$fatherName" },
                fatherMobile: { $first: "$fatherMobile" },
                passedOutYear: { $first: "$passedOutYear" },
                collegeCode: { $first: "$collegeCode" },

                Count: { $sum: 1 },
                date: {
                    $addToSet: "$date"
                }
            }
        },
        {
            $match: {
                Count: {
                    $gte: 10
                },
            }
        }

    ])
    console.log(data)
    res.status(200).send(data)
}

//to get todays student out data
const todayStudentOutData = async (req, res) => {
    const date = moment(new Date()).format('DD-MM-YYYY');
    try {
        const data = await studentData.aggregate([
            {
                $match: {
                    date: date,
                    outTime: { $ne: "_" }
                }
            }
        ])

        // console.log("Today Faculty Out Data is Getting Successfully")
        // console.log(data)
        res.status(200).send(data)
    }
    catch (err) {
        res.send({ msg: "Not able to get The data ", error: err })
    }
}

//to get todays student in data
const todayStudentInData = async (req, res) => {
    const date = moment(new Date()).format('DD-MM-YYYY');
    try {
        const data = await studentData.aggregate([
            {
                $match: {
                    date: date,
                    inTime: { $ne: "_" }
                }
            }
        ])

        // console.log("Today Faculty In Data is Getting Successfully")
        // console.log(data)
        res.status(200).send(data)
    }
    catch (err) {
        res.send({ msg: "Not able to get The data ", error: err })
    }
}



// to get the individual branches from the student data base
const getBranches = async (req, res) => {
    try {

        var branches = await studentData.aggregate([
            {
                $group: {
                    _id: "$branch",
                    Count: { $sum: 1 }
                }
            }
        ])
        res.send(branches)
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { collegeWiseStudentCount, collegeBranchDateData, branchWiseStudentCount, searchStudent, todayStudentData, addStudentInData, studentMonthlyReport, WeeklyReport, addStudentOutData, todayStudentInData, todayStudentOutData, getBranches }
