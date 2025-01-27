const studentData = require('../models/studentsSchema')
const VisitorData = require('../models/visitorSchema')
const moment = require('moment')


const getBranchWise = async (req, res) => {
    const data = req.body;
    console.log(data);
    const wantedCollege = data.selectedOption;
    const fromDate = data.startDate;
    const toDate = data.endDate;

    try {
        if (wantedCollege === 'ALL') {
            const groupedData = await studentData.aggregate([
                {
                    $match: {
                        date: {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                },
                {
                    $group: {
                        _id: "$collegeCode",
                        totalStudents: { $sum: 1 }
                    }
                }
            ]);
            return res.status(200).json(groupedData);

        } else {
            // If a specific college is selected, group by branch and count documents
            const groupedData = await studentData.aggregate([
                {
                    $match: {
                        college: wantedCollege,
                        date: {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                },
                {
                    $group: {
                        _id: "$branch", // Group by branch
                        totalStudents: { $sum: 1 } // Count total students in each branch
                    }
                }
            ]);
            return res.status(200).json(groupedData);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'internal server error' });
    }
};

const getBranchWiseWithFullName = async (req, res) => {
    const data = req.body;
    console.log(data);
    const wantedCollege = data.college;
    const datee = data.datee;

    try {
        if (wantedCollege === 'ALL') {
            const groupedData = await studentData.aggregate([
                {
                    "$match": {
                        date: datee
                    }
                },
                {
                    "$group": {
                        "_id": "$college",
                        "totalStudents": { "$sum": 1 }
                    }
                }
            ]);
            return res.status(200).json(groupedData);

        } else {
            const groupedData = await studentData.aggregate([
                {
                    "$match": {
                        college: wantedCollege,
                        date: datee
                    }
                },
                {
                    "$group": {
                        "_id": "$branch",
                        "totalStudents": { "$sum": 1 }
                    }
                }
            ]);
            return res.status(200).json(groupedData);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'internal server error' });
    }
};


const getGender = async (req, res) => {
    const data = req.body;
    const wantedCollege = data.selectedOption;
    const fromDate = data.startDate;
    const toDate = data.endDate;
    try {
        if (wantedCollege === 'ALL') {
            const groupedData = await studentData.aggregate([
                {
                    $match: {
                        date: {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        Male: {
                            $sum: {
                                "$cond": [{ "$eq": [{ "$toLower": "$gender" }, "male"] }, 1, 0]
                            }
                        },
                        Female: {
                            $sum: {
                                "$cond": [{ "$eq": [{ "$toLower": "$gender" }, "female"] }, 1, 0]
                            }
                        }
                    }
                }
            ]);
            console.log(groupedData)
            return res.status(200).json(groupedData);

        } else {
            const groupedData = await studentData.aggregate([
                {
                    $match: {
                        college: wantedCollege,
                        date: {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        Male: {
                            $sum: {
                                "$cond": [{ "$eq": [{ "$toLower": "$gender" }, "male"] }, 1, 0]
                            }
                        },
                        Female: {
                            $sum: {
                                "$cond": [{ "$eq": [{ "$toLower": "$gender" }, "female"] }, 1, 0]
                            }
                        }
                    }
                }
            ]);
            return res.status(200).json(groupedData);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'internal server error' });
    }
};



const getVisitiors7days = async (req, res) => {
    // Helper function to get past 7 days in 'yyyy-mm-dd' format
    const toDate = moment(new Date()).format("DD-MM-YYYY");
    const specificDate = moment(new Date(), "DD-MM-YYYY");
    const prevDate = specificDate.subtract(6, 'days');
    const fromDate = moment(prevDate).format('DD-MM-YYYY');
    console.log(fromDate, toDate);
    try {
        const visitorData = await VisitorData.aggregate([
            {
                $match: {
                    inDate: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                // Group by 'inDate' and count the number of visitors per day
                $group: {
                    _id: "$inDate",
                    count: { $sum: 1 }
                }
            },
            {
                // Project the results in the desired format
                $project: {
                    _id: 0,
                    inDate: "$_id",
                    count: "$count"
                }
            }
        ]);

        // Fill in missing days with count 0

        res.status(201).json(visitorData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




const getCollegenames = async (req, res) => {
    try {
        const uniqueCollegeNames = await studentData.aggregate([
            {
                $group: {
                    _id: "$college"
                }
            },
            {
                $project: {
                    _id: 0,
                    collegeName: "$_id"
                }
            }
        ]);
        return res.status(200).json(uniqueCollegeNames);
    } catch (err) {
        console.error(err)
        return res.status(500).json({ 'message': 'internal server error' })
    }
}


module.exports = { getBranchWise, getGender, getVisitiors7days, getCollegenames,getBranchWiseWithFullName };