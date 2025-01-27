import React, { useEffect, useState, useRef } from "react"
import { AvForm, AvField } from "availity-reactstrap-validation"
import { Label, Button } from "reactstrap"
import StudentInOutTables from "./studentInOutTables"
import FacultyInOutTables from "./facultyInOutTables"
import viewSuspendStudent   from "./viewSuspendStudent"
import "./MomentStyles.css"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import StudentDataTable from "./StudentDataTable"
import Data from "pages/Maps/LightData"
import { setBreadcrumbItems } from "store/actions"
import { result } from "lodash"

const GetInfo = props => {
  const [studentInData, setStudentInData] = useState([])
  const [studentOutData, setStudentOutData] = useState([])
  const [facultyInData, setFacultyInData] = useState([])
  const [facultyOutData, setFacultyOutData] = useState([])
  const [inSearchParameter, setInSearchParameter] = useState("")
  const [outSearchParameter, setOutSearchParameter] = useState("")
  const [isInUpdated, setIsInUpdated] = useState(false)
  const [isOutUpdated, setIsOutUpdated] = useState(false)
  // const [open , setOpen] = useState(false)
  const baseUrl = process.env.REACT_APP_API
  const inputRef = useRef(null)

  // const breadcrumbItems = [
  //   { title: "Late Comers", link: "#" },
  //   { title: "Moment", link: "#" },
  // ];

  // useEffect(() => {
  //   props.setBreadcrumbItems('Moment', breadcrumbItems);
  // });

  useEffect(() => {
    //to get the today student in data
    axios
      .get(baseUrl + "/today-Student-InData")
      .then(result => {
        console.log("Today Student In data is getting Successfully")
        setStudentInData(result.data)
        // console.log(result.data)
      })
      .catch(err => {
        console.log("Error While getting the Today Student In data")
        console.log(err)
      })

    //to get the today student out data
    axios
      .get(baseUrl + "/today-Student-OutData")
      .then(result => {
        console.log("Today Student Out data is getting Successfully")
        console.log(result.data)
        setStudentOutData(result.data)
      })
      .catch(err => {
        console.log("Error While getting the Today Student Out data")
        console.log(err)
      })

    // to get the today faculty In data
    axios
      .get(baseUrl + "/today-Faculty-InData")
      .then(result => {
        console.log("Today Faculty In data is getting Successfully")
        console.log(result.data)
        setFacultyInData(result.data)
      })
      .catch(err => {
        console.log("Error While getting the Today Faculty In data")
        console.log(err)
      })

    // to get the today faculty Out data
    axios
      .get(baseUrl + "/today-Faculty-OutData")
      .then(result => {
        console.log("Today Faculty Out data is getting Successfully")
        console.log(result.data)
        setFacultyOutData(result.data)
      })
      .catch(err => {
        console.log("Error While getting the Today Faculty Out data")
        console.log(err)
      })
  }, [isInUpdated, isOutUpdated])

  // to send the mails to the
  // const sendMails = (result , indata) => {
  //   const roll = result.studentName
  //   console.log("This is comming for the Mailing")
  //   const date = new Date();

  //   const offsetIST = 5.5 * 60 * 60 * 1000;
  //   const istDate = new Date(date.getTime() + offsetIST);

  //   const inDate = istDate.toISOString().split('T')[0];
  //   const inTime = istDate.toISOString().split('T')[1].split('.')[0];

  //   console.log("Mail is sending")

  //   const data1 = {
  //     "studentName": result.studentName,
  //     "email": result.email,
  //     "indata"  :indata
  //   }
  //   if(indata == 'true'){
  //     data1.inDate = inDate
  //     data1.inTime = inTime
  //   }
  //   else{
  //     data1.outDate = inDate
  //     data1.outTime = inTime
  //   }
  //   console.log(data1)
  //   if (result && result.email) {
  //     axios.post(baseUrl + '/send-student-mail', data1)
  //       .then((result) => {
  //          if(localStorage.getItem("TodaySuccessMailData") == null){
  //           var num = []
  //           num.push(roll)
  //           localStorage.setItem("TodaySuccessMailData" , JSON.stringify(num))
  //           console.log("TodaySuccessMailData is created successfully")
  //         }
  //         else{
  //           var todayData = JSON.parse(localStorage.getItem("TodaySuccessMailData"));
  //           console.log(todayData)
  //           todayData.push(roll)
  //           localStorage.setItem("TodaySuccessMailData" , JSON.stringify(todayData))
  //           console.log(roll)
  //           console.log("TodaySuccessMailData is Updated successfully")
  //         }
  //         console.log(result);
  //         console.log("Mail is sent Successfully")
  //       })
  //       .catch((err) => {
  //         if(localStorage.getItem("TodayErrorMailData") == null){
  //               var num = []
  //               num.push(roll)
  //               localStorage.setItem("TodayErrorMailData" , JSON.stringify(num))
  //               console.log("TodayErrorMailData is created successfully")
  //             }
  //             else{
  //               var todayData = JSON.parse(localStorage.getItem("TodayErrorMailData"));
  //               console.log(todayData)
  //               todayData.push(roll)
  //               localStorage.setItem("TodayErrorMailData" , JSON.stringify(todayData))
  //               console.log("TodayErrorMailData is created successfully")
  //             }
  //         console.log(err.data)
  //         console.log("Error While sending the mail")
  //       })
  //   }
  //   else {
  //     console.log("Email not Found")
  //   }
  // }

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const handleInSubmit = e => {
    e.preventDefault()

    if (inputRef.current) {
      inputRef.current = null
    }

    if (inSearchParameter.trim() === "") {
      toast.warn("Enter the Valid Number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    }

    if (!isNaN(inSearchParameter) && inSearchParameter.length < 10) {
      const data = { facultyId: inSearchParameter.toUpperCase() }
      axios
        .post(baseUrl + "/add-Faculty-InData", data)
        .then(result => {
          if (result.status == 201) {
            toast.warn(
              `${inSearchParameter.toUpperCase()} is Alreday Exists !`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            setInSearchParameter("")
            console.log(`${inSearchParameter.toUpperCase()} is Alreday Exists`)
          } else if (result.status == 202) {
            toast.success(
              `${outSearchParameter.toUpperCase()} In Time is Updated Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            setIsInUpdated(!isInUpdated)
            setOutSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} In Time is Updated Successfully`,
            )
          } else if (result.data.length === 0) {
            toast.error(`${inSearchParameter.toUpperCase()} data not Found`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })

            console.log(`${inSearchParameter.toUpperCase()} data not Found`)
            setInSearchParameter("")
          } else {
            toast.success(
              `${inSearchParameter.toUpperCase()} is Added Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            console.log(
              `${inSearchParameter.toUpperCase()} is Added Successfully`,
            )
            console.log(result.data)
            setIsInUpdated(!isInUpdated)
            setInSearchParameter("")
          }
        })
        .catch(err => {
          toast.error(
            `Not able to add data for ${inSearchParameter.toUpperCase()}`,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            },
          )

          setInSearchParameter("")
          console.log(err)
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        })
    } else {
      const data = {
        roll: inSearchParameter.toUpperCase(),
      }
      axios
        .post(baseUrl + `/add-Student-InData`, data)
        .then(result => {
          console.log(result.data)
          if (result.status == 201) {
            toast.warn(
              `${inSearchParameter.toUpperCase()} is Alreday Exists !`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            setInSearchParameter("")
            console.log(`${inSearchParameter.toUpperCase()} is Alreday Exists`)
          } else if (result.status == 202) {
            toast.success(
              `${outSearchParameter.toUpperCase()} In Time is Updated Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            // axios.get(`https://pgapi.vispl.in/fe/api/v1/multiSend?username=aditrpg1.trans&password=9x7Dy&unicode=false&from=AEISUR&to=${result.data.studentMobile}&text=Dear+Parent,+${result.data.studentName}+arrived+late+to+the+college+at+${result.data.outTime}+AM.+Please+advice+your+ward+to+attend+the+college+before+9.30AM.+PRINCIPAL-ADITYA`)
            // sendMails(result.data , "true")// to send the mails to the student
            setIsInUpdated(!isInUpdated)
            setOutSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} InTime is Updated Successfully`,
            )
          } else if (result.status == 203) {
            console.log(result.data.data[0])
            toast.error(
              `${inSearchParameter.toUpperCase()} is in Suspend List.`,
              {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            setSelectedStudent(result.data.data[0])
            setModalOpen(true)
            console.log(`${inSearchParameter.toUpperCase()} is in Suspend List`)
            setInSearchParameter("")
          } else if (result.data.length === 0) {
            toast.error(`${inSearchParameter.toUpperCase()} data not Found`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })

            console.log(`${inSearchParameter.toUpperCase()} data not Found`)
            setInSearchParameter("")
          } else {
            console.log("today data is getting successfully")
            console.log(result.data)

            toast.success(
              `${inSearchParameter.toUpperCase()} is Added Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            // for daily messages
            // console.log(`${inSearchParameter.toUpperCase()} is Added Successfully`)
            // axios.get(`https://pgapi.visp.in/fe/api/v1/multiSend?username=aditrpg1.trans&password=9x7Dy&unicode=false&from=AEISUR&to=${result.data.studentMobile}&text=Dear+Parent,+${result.data.studentName}+arrived+late+to+the+college+at+${result.data.inTime}+AM.+Please+advice+your+ward+to+attend+the+college+before+9.30AM.+PRINCIPAL-ADITYA`)
            // .then((reult) => {
            //   console.log(result);
            // }).catch((er) => {
            //   console.log(er);
            // })

            // for weekly messages
            // axios.post("http://localhost:5000/api/Student-Weekly-Message-Sender", data)
            // .then((res) => {
            //   console.log("Weekly Message sent successfully");
            // })
            // .catch((error)=>{
            //   console.log("error");
            // })

            // sendMails(result.data , "true")// to send the mails to the student
            console.log(result.data)
            setIsInUpdated(!isInUpdated)
            setInSearchParameter("")
          }
        })
        .catch(err => {
          toast.error(
            `Not able to add data for ${inSearchParameter.toUpperCase()}`,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            },
          )
          setInSearchParameter("")
          console.log(err)
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        })
    }
  }

  const handleOutSubmit = e => {
    e.preventDefault()

    if (inputRef.current) {
      inputRef.current = null
    }

    if (outSearchParameter.trim() === "") {
      toast.warn("Enter the Valid Number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    }

    if (outSearchParameter.includes("VISITOR")) {
      console.log("This is for Visitor")
      const data = { passId: outSearchParameter }
      axios
        .put(baseUrl + "/update-Visitor-OutDate", data)
        .then(result => {
          console.log(result.data);
          toast.success("Visitor Outed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          })
          setOutSearchParameter("");
        })
        .catch(err => {
            toast.error("Visitor Not Found", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          })
          setOutSearchParameter("");
          console.log(err)
        })
    } else if (!isNaN(outSearchParameter) && outSearchParameter.length < 10) {
      const data = { facultyId: outSearchParameter.toUpperCase() }
      axios
        .post(baseUrl + "/add-Faculty-Outdata", data)
        .then(result => {
          if (result.status == 201) {
            toast.warn(
              `${outSearchParameter.toUpperCase()} is Alreday Exists !`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            setOutSearchParameter("")
            console.log(`${outSearchParameter.toUpperCase()} is Alreday Exists`)
          } else if (result.status == 202) {
            toast.success(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            // sendMails(result.data , "false")// to send the mails to the student
            setIsOutUpdated(!isOutUpdated)
            setOutSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully`,
            )
          } else if (result.data.length === 0) {
            toast.error(`${outSearchParameter.toUpperCase()} data not Found`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })

            console.log(`${outSearchParameter.toUpperCase()} data not Found`)

            setOutSearchParameter("")
          } else {
            toast.success(
              `${outSearchParameter.toUpperCase()} is Added Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            console.log(
              `${outSearchParameter.toUpperCase()} is Added Successfully`,
            )
            console.log(result.data)
            setIsOutUpdated(!isOutUpdated)
            setOutSearchParameter("")
          }
        })
        .catch(err => {
          toast.error(
            `Not able to add data for ${outSearchParameter.toUpperCase()}`,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            },
          )

          setOutSearchParameter("")
          console.log(err)
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        })
    } else {
      const data = {
        roll: outSearchParameter.toUpperCase(),
      }
      axios
        .post(baseUrl + `/add-Student-OutData`, data)
        .then(result => {
          console.log(result.data)
          if (result.status == 201) {
            toast.warn(
              `${outSearchParameter.toUpperCase()} is Alreday Exists !`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )

            setOutSearchParameter("")
            console.log(`${outSearchParameter.toUpperCase()} is Alreday Exists`)
          } else if (result.status == 202) {
            toast.success(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            // sendMails(result.data , "false")// to send the mails to the student
            setIsOutUpdated(!isOutUpdated)
            setOutSearchParameter("")
            console.log(
              `${outSearchParameter.toUpperCase()} Out Time is Updated Successfully`,
            )
          } else if (result.data.length === 0) {
            toast.error(`${outSearchParameter.toUpperCase()} data not Found`, {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            })

            console.log(`${outSearchParameter.toUpperCase()} data not Found`)
            setOutSearchParameter("")
          } else {
            console.log("today data is getting successfully")
            console.log(result.data)

            toast.success(
              `${outSearchParameter.toUpperCase()} is Added Successfully`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
              },
            )
            // sendMails(result.data , "false")// to send the mails to the student
            console.log(
              `${outSearchParameter.toUpperCase()} is Added Successfully`,
            )
            console.log(result.data)
            setIsOutUpdated(!isOutUpdated)
            setOutSearchParameter("")
          }
        })
        .catch(err => {
          toast.error(
            `Not able to add data for ${outSearchParameter.toUpperCase()}`,
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

              theme: "light",
            },
          )
          setOutSearchParameter("")
          console.log(err.response.data)
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus()
          }
        })
    }
  }
  const handleInInputChange = e => setInSearchParameter(e.target.value)
  const handleOutInputChange = e => setOutSearchParameter(e.target.value)

  return (
    <div className="get-info-container">
      {modalOpen && (
        <viewSuspendStudent
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          student={selectedStudent}
        />
      )}
      <div className="forms-container">
        <div className="form-section">
          <h1 className="label">In Moment</h1>
          <Label className="moment-form-label">
            Enter Student ID / Employee ID
          </Label>
          <AvForm onSubmit={handleInSubmit} className="form">
            <AvField
              name="inSearchParameter"
              type="text"
              errorMessage="Please enter search parameter"
              className="form-control input-field"
              value={inSearchParameter}
              onChange={handleInInputChange}
              placeholder="Scan code here"
              validate={{ required: { value: true } }}
              innerRef={inputRef}
              autoFocus
            />
            <Button type="submit" style={{ display: "none" }}>
              Submit
            </Button>
          </AvForm>
        </div>
        <div className="form-section">
          <h1 className="label">Out Moment</h1>
          <Label className="moment-form-label">
            Enter Student ID / Employee ID
          </Label>
          <AvForm onSubmit={handleOutSubmit} className="form">
            <AvField
              name="outSearchParameter"
              type="text"
              errorMessage="Please enter search parameter"
              className="form-control input-field"
              value={outSearchParameter}
              onChange={handleOutInputChange}
              placeholder="Scan code here"
              validate={{ required: { value: true } }}
              innerRef={inputRef}
              autoFocus
            />
            <Button type="submit" style={{ display: "none" }}>
              Submit
            </Button>
          </AvForm>
        </div>
      </div>

      <div className="tables-container">
        {/* <DataTablesSection title="Student Data" inData={studentData} outData={studentData} />
        <DataTablesSection title="Faculty Data" inData={facultyData} outData={facultyData} /> */}

        <StudentInOutTables
          studentInData={studentInData}
          studentOutData={studentOutData}
        />
        <FacultyInOutTables
          facultyInData={facultyInData}
          facultyOutData={facultyOutData}
        />
      </div>
      <ToastContainer />
    </div>
  )
}

export default GetInfo
