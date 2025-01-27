const visitordata = require("../models/visitorSchema")
const moment = require('moment')

// function to add the Visitor data into the database
const addVisitor = async (req, res) => {
  console.log(req.body)
  try {
    const newItem = new visitordata(req.body);
    await newItem.save();
    console.log("Adding the Visitor is Successfully Done")
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error while adding visitor:", error);
    res.status(400).json({ error: "Failed to add visitor", details: error.message });
  }
};

//get the data based on the id
const getVisitorById = async (req, res) => {
  const place = req.params.place
  console.log(typeof (iid))
  try {
    var data = await visitordata.aggregate([
      {
        $match: {
          placeToGo: `${place}`
        }
      }
    ])
    console.log(data);
    res.send(data);
  }
  catch (err) {
    res.status(400).send({ err })
  }
};

// get the data of all Visitors for the Data Base
const getAllVisitors = async (req, res) => {
  await visitordata.find()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      res.send(err)
    })
};

// get the data based on the date and place
const getVisitorsBtDates = async (req, res) => {
  console.log(req.params)
  const toDate = req.params.toDate
  const fromDate = req.params.fromDate
  const place = req.params.place
  const selectedOthers = req.params.selectedOthers

  try {
    if (place == "ALL COLLEGES") {
      const data = await visitordata.aggregate([
        {
          $match: {
            inDate: {
              $gte: fromDate,
              $lte: toDate
            }
          }
        }
      ]);

      console.log(data);
      return res.status(200).send(data);
    }
    else {
      if (selectedOthers == "true") {
        const data = await visitordata.aggregate([
          {
            $match: {
              otherPlace: place,
              inDate: {
                $gte: fromDate,
                $lte: toDate
              }
            }
          }
        ]);
        console.log(data)
        res.status(200).send(data);

      }
      else {
        const data = await visitordata.aggregate([
          {
            $match: {
              placeToGo: place,
              inDate: {
                $gte: fromDate,
                $lte: toDate
              }
            }
          }
        ]);
        console.log(data)
        res.status(200).send(data);
      }
    }
  }
  catch (err) {
    return res.status(400).send({ error: "Data not fetched", details: err.message });
  }
};

// get the receipt number
const getSNo = async (req, res) => {
  try {
    const count = await visitordata.aggregate([
      {
        $group: {
          _id: null,
          sum: { $sum: 1 },
        },
      },
    ]);

    console.log(count);
    res.status(200).send(count);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Not able to get the Data", details: err.message });
  }
};


// to get the visitor places for Drop Down
const getPlaces = async (req, res) => {
  try {
    const data = await visitordata.aggregate([
      {
        $group: {
          _id: null,
          place: { $addToSet: "$placeToGo" },
        },
      },
    ]);

    const places = data[0]?.place || [];
    res.status(200).send(places); 
  } catch (err) {
    console.error(err); 
    res.status(500).send({ Error: err.message }); 
  }
};

const updateOutDate = async(req , res) => {
  try {
    const date = moment(new Date()).format("DD-MM-YYYY")
    const time = new Date().toLocaleTimeString('en-GB',{hour : '2-digit', minute : '2-digit', second : "2-digit"})
    const passId = req.body.passId;
    console.log(date);
    console.log(time);
    console.log(passId);

    const dataObj = await visitordata.aggregate([
      {
        $match: {
          passNumber :passId
        }
      }
    ])
    console.log(dataObj)

  if(dataObj.length === 0){
    return res.status(404).json("visitor not found");
  } 

    await visitordata.findByIdAndUpdate(dataObj[0]._id, { "outTime": time , "outDate" : date }, {"new" : true})
      .then((result) => {
        console.log(result)
        return res.status(202).send(result)
      }).catch((err) => {
        console.log(err)
        return res.send({ "err": err.message })
      })
  }
  catch (err){
    console.log(err)
    res.status(404).send(err)
  }
}

module.exports = { addVisitor, getAllVisitors, getVisitorsBtDates, getVisitorById, getSNo, getPlaces , updateOutDate };