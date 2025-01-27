const { model, default: mongoose } = require("mongoose")
const studentDataBase = require("../models/studentDataBaseSchema")

const addData = (req , res) =>{
   const obj = req.body
    var submitData = new studentDataBase(obj)
    try{
        submitData.save()
        console.log("Student Data Successfully")
        res.status(200).send(submitData)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
}


const updateStudent = async(req , res) =>{
    console.log("this is for update student")
    const roll = req.body.roll
    try {
        const result = await studentDataBase.updateOne(
          { studentRoll: roll },       
          { $set: { suspended: req.body.isSuspended } } 
        );
            console.log(`Student with roll ${roll} has been suspended.`);
            res.status(200).send(result)
       
      } catch (error) {
        console.error("Error updating student record:", error);
        res.status(404).send(error)
      }
}

const getStudentData = async(req , res) =>{
  const data = await studentDataBase.aggregate([
      {
        $match: {
          studentRoll: req.body.roll
        }
      }
  ])

  res.status(200).send(data)
}

const getSuspendList = async(req , res) =>{
    console.log("This is to get the suspended list")
    try{
    const data = await studentDataBase.aggregate([
        {
          $match: {
            suspended : "YES"
          }
        }
      ])

        console.log("Susccessfully getting the Suspended List")
        res.status(200).send(data)
    }
    catch(err){
        console.log(err);
        res.status(204).send({err : "Error while getting the Suspended List Data " , details :err})
    }

}


module.exports = {addData , updateStudent , getSuspendList , getStudentData}