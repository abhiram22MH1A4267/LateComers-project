const moment = require('moment')
const facultyData = require("../models/facultySchema")
const facultyDataBase = require('../models/facultyDataBaseSchema')

// to Add the faculty Data to the DB
const addFacultyInData = async (req, res) => {
    console.log("ihwegfs")
    const now = new Date();
    const empId = req.body.facultyId.toUpperCase();
    const date = moment(new Date()).format('DD-MM-YYYY');
    
    const istDateTime = now.toLocaleString('en-GB', {hour : "2-digit", minute : "2-digit", second :"2-digit"});

    console.log("This is Roll Number -->  ", empId)
    console.log("This is Date -->  ", date)
    console.log("This is Time -->  ", istDateTime)
    const check = await facultyData.aggregate([
        {
            $match: {
                facultyId: empId,
                date: date,
            }
        }
    ]);

    if (check.length !== 0) {
        return res.status(201).send("The data is already added");
    }

    try {
        
        var Data = await facultyDataBase.aggregate([
            {
                $match: {
                    facultyId: empId,
                }
            }
        ]);
        delete Data[0]._id;
        // console.log(Data)
        Data[0].date = date
        Data[0].inTime = istDateTime
        Data[0].outTime = "_"
        console.log(Data)
        const finalFacultyData = new facultyData(Data[0]);
        finalFacultyData.save();
        console.log("Faculty is Added Successfully")
        res.status(200).send(finalFacultyData)

    } catch (err) {
        console.error(err);
        res.status(400).send({ error: "Not able to add the data", details: err.message });
    }
};

// to search a faculty
const searchFaculty = async (req, res) => {
    const empId = req.params.facultyId
    const fromDate = req.params.fromDate
    const toDate = req.params.toDate
    console.log(empId)
    console.log(fromDate)
    console.log(toDate)
    console.log("This is faculty search")
    try {
        var data = await facultyData.aggregate([
            {
                $match: {
                    facultyId: empId,
                    date: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            }
        ])
        res.status(200).send(data)
        console.log(data);
        console.log("Data Getted Successfully")
    }
    catch (err) {
        res.status(400).send({ error: "Not able to get the data", details: err })
    }
}

// to get the today faculty data
const todayFacultyData = async (req, res) => {
    const { facultyCollege } = req.params;
    console.log(facultyCollege)
    const dateString = moment(new Date()).format('DD-MM-YYYY');
    try {
        if (facultyCollege !== "ALL COLLEGES") {
            const data = await facultyData.aggregate([
                {
                    $match: {
                        date: dateString,
                        facultyCollege: facultyCollege
                    }
                }
            ]);
            console.log(data);
            res.status(200).send(data);
        }
        else {
            const data = await facultyData.aggregate([
                {
                    $match: {
                        date: dateString,
                    }
                }
            ]);
            console.log(data);
            res.status(200).send(data);
        }
    }
    catch (err) {
        console.log("Error fetching data:", err);
        res.status(400).send({ error: "Not able to get the data", details: err.message });
    }
};

// to get the data based on college and the time intervel
const collegeDateData = async (req, res) => {
    console.log(req.params);
    const clg = req.params.facultyCollege;
    const start = req.params.fromDate;
    const end = req.params.toDate;

    try {
        console.log(`${clg} --> ${start} --> ${end}`);

        let matchdata = {
            date: {
                $gte: start,
                $lte: end
            }
        };

        if (clg != "ALL COLLEGES") {
            matchdata.facultyCollege = clg;
        }

        const excelData = await facultyData.aggregate([
            {
                $match: matchdata
            }
        ]);
        const tableData = await facultyData.aggregate([
            {
                  $match: matchdata
            },
            {
                $group: {
                  _id: "$facultyId",
                  facultyId: { $first: "$facultyId" },
                  facultyName: { $first: "$facultyName" },
                  facultyCollege: { $first: "$facultyCollege" },
                  facultyMobile: { $first: "$facultyMobile" },
                  facultyMail: { $first: "$facultyMail" },
                  facultyGender: { $first: "$facultyGender" },
                  facultyCollegeCode: { $first: "$facultyCollegeCode" },
                  Count : {$sum : 1},
                  date: {
                    $addToSet: "$date"
                  }
                }
              }
          ]
        );

        console.log({excelData : excelData , tableData : tableData});
        res.status(200).send({excelData : excelData , tableData : tableData});
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: "Not able to get the Data", details: err });
    }
};

// to get the college wise Count
const collegeWiseFacultyCount = async (req, res) => {
    try {
        const overallData = await facultyData.aggregate([
            {
                $group: {
                    _id: "$facultyCollege",
                    Count: { $sum: 1 }
                }
            }
        ]);

        const date = new Date();
        const todayString = moment(new Date()).format('DD-MM-YYYY');
        const todayData = await facultyData.aggregate([
            {
                $match: {
                    date: todayString
                }
            },
            {
                $group: {
                    _id: "$facultyCollege",
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
            const upperData = ele._id.toUpperCase()
            if (!result[upperData]) {
                result[upperData] = { today: 0, overall: 0 };
            }
            result[upperData].overall = ele.Count;
            result["ALL COLLEGES"].overall += ele.Count;
        });

        console.log(result);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: "Not able to fetch the data", details: err.message });
    }
};

//to add faculty out data
const addFacultyOutData = async (req, res) => {
    console.log(req.body);
    const now = new Date();
    const empId = req.body.facultyId.toUpperCase();
    const date = moment(new Date()).format('DD-MM-YYYY');
    
    const istDateTime = now.toLocaleString('en-GB', {hour : "2-digit", minute : "2-digit", second : "2-digit"});

    console.log("This is Roll Number -->  ", empId)
    console.log("This is Date -->  ", date)
    console.log("This is Time -->  ", istDateTime)
    const check = await facultyData.aggregate([
        {
            $match: {
                facultyId: empId,
                date: date,
            }
        }
    ]);
    console.log(check);
    if (check.length !== 0 && check[0].outTime != "_") {
        return res.status(201).send("The data is already added");
    }
    else if(check.length !== 0 && check[0].outTime == "_"){
        const idemp = check[0]._id;
        await  facultyData.findByIdAndUpdate(idemp, {"outTime": istDateTime})
        .then((result) => {
            return res.status(202).send(result)
        }).catch((er) => {
            return res.send({"err" : err.message})
        })
    }
    else{
        try {
            
            var Data = await facultyDataBase.aggregate([
                {
                    $match: {
                        facultyId: empId,
                    }
                }
            ]);
            delete Data[0]._id;
            Data[0].date = date
            Data[0].inTime = "_"
            Data[0].outTime = istDateTime
            console.log(Data)
            const finalFacultyData = new facultyData(Data[0]);
            finalFacultyData.save();
            console.log("Faculty is Added Successfully")
            res.status(200).send(finalFacultyData)
    
        } catch (err) {
            console.error(err);
            res.status(400).send({ error: "Not able to add the data", details: err.message });
        }
    }

};

//to add today faculty out data
const todayFacultyOutData = async (req , res) =>{
    const date = moment(new Date()).format('DD-MM-YYYY');
    try{
        const data = await facultyData.aggregate([
            {
              $match: {
                date : date,
                outTime : {$ne : "_"}
              }
            }
          ])

          console.log("Today Faculty Out Data is Getting Successfully")
          console.log(data)
          res.status(200).send(data)
    }
    catch(err){
        res.send({msg : "Not able to get The data " , error : err})
    }
}

//to add today faculty in data
const todayFacultyInData = async (req , res) =>{
    const date = moment(new Date()).format('DD-MM-YYYY');
    try{
        const data = await facultyData.aggregate([
            {
              $match: {
                date : date,
                inTime : {$ne : "_"}
              }
            }
          ])

          console.log("Today Faculty In Data is Getting Successfully")
          console.log(data)
          res.status(200).send(data)
    }
    catch(err){
        res.send({msg : "Not able to get The data " , error : err})
    }
}

module.exports = { addFacultyInData, searchFaculty, todayFacultyData, collegeDateData, collegeWiseFacultyCount, addFacultyOutData , todayFacultyInData , todayFacultyOutData}