import React, { useState, useEffect , useMemo } from "react"
import { setBreadcrumbItems } from "store/actions"
import { connect } from "react-redux"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap"
import axios from "axios"
import Flatpickr from "react-flatpickr"
import ViewStudentWeekData from "./ViewStudentWeekData"
import Loader from "./loader"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import * as xlsx from "xlsx"
import moment from "moment"

function WeeklyReport(props) {
  const baseurl = process.env.REACT_APP_API
  const breadcrumbItems = [
    { title: "Late Comers", link: "#" },
    { title: "Report", link: "#" },
    { title: "Weekly Report", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Weekly Report", breadcrumbItems)
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [excelData, setExcelData] = useState([])
  const [tableData, setTableData] = useState([])
  const [loader, setLoader] = useState(false)
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    handleSearch(date)
  }, [date])

  const handleSearch = selectedDate => {
    setLoader(true)
    // console.log('this is weekly report data')
    // console.log(selectedDate)
    axios
      .post(baseurl + "/student-Weekly-Report-Api", { toDate: selectedDate })
      .then(result => {
        console.log("Backend Data:", result.data)

        // Store complete data for downloads
        setTableData(result.data.tableData)
        setExcelData(result.data.excelData)
        console.log(result.data.excelData)
        // Prepare simplified data for display
        // const formattedData = result.data
        //   .sort((a, b) => b.weekCount - a.weekCount)
        //   .map((studentEntry, index) => {
        //     const studentDetails = studentEntry[0] || {}
        //     return {
        //       SNO: index + 1,
        //       studentRoll: studentDetails.studentRoll,
        //       studentName: studentDetails.studentName,
        //       gender: studentDetails.gender,
        //       college: studentDetails.college,
        //       branch: studentDetails.branch,
        //       weekCount: studentEntry.weekCount,
        //       buttons: (
        //         <Button
        //           color="primary"
        //           onClick={() => handleButtonClick(studentEntry)}
        //           className="btn btn-primary waves-effect waves-light"
        //         >
        //           View
        //         </Button>
        //       ),
        //     }
        //   })

        // setFrequentStudents(formattedData)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      })
      .finally(() => {
        setLoader(false)
      })
  }

  const handleButtonClick = student => {
    const singleStudent = { ...student, date: student.date }
    console.log(singleStudent)
    setSelectedStudent(singleStudent)
    setModalOpen(true)
  }

  // const downloadExcel = () => {
  //   const workbook = xlsx.utils.book_new()

  //   // Flatten and sort the complete data by date, ensuring no duplicates
  //   const worksheetData = tableData.map(studentEntry => {
  //     // Convert each studentEntry object to an array of individual records
  //     return Object.values(studentEntry)
  //       .slice(0, studentEntry.weekCount)
  //       .map(student => ({
  //         studentName: student.studentName,
  //         studentRoll: student.studentRoll,
  //         college: student.college,
  //         branch: student.branch,
  //         studentMobile: student.studentMobile,
  //         email: student.email,
  //         passedOutYear: student.passedOutYear,
  //         gender: student.gender,
  //         fatherName: student.fatherName,
  //         fatherMobile: student.fatherMobile,
  //         date: student.date,
  //         inTime: student.inTime,
  //         outTime: student.outTime,
  //       }))
  //   })
  //     .flat()
  //     .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date

  //   // Convert to 2D array for worksheet
  //   const worksheetArray = worksheetData.map(student => [
  //     student.studentRoll,
  //     student.studentName,
  //     student.gender,
  //     student.college,
  //     student.branch,
  //     student.fatherName,
  //     student.fatherMobile,
  //     student.email,
  //     student.passedOutYear,
  //     student.date,
  //     student.inTime,
  //     student.outTime,
  //   ])

  //   // Add header row
  //   worksheetArray.unshift([
  //     "student Roll",
  //     "Student Name",
  //     "Gender",
  //     "College",
  //     "Branch",
  //     "Father Name",
  //     "Father Mobile",
  //     "Student Email",
  //     "Passed Out Year",
  //     "Date",
  //     "In Time",
  //     "Out Time",
  //   ])

  //   // Convert the data to a sheet
  //   const worksheet = xlsx.utils.aoa_to_sheet(worksheetArray)
  //   xlsx.utils.book_append_sheet(workbook, worksheet, "Students Weekly Report")

  //   // Generate the Excel file and trigger download in the browser
  //   xlsx.writeFile(workbook, `Weekly_Students_Report-of-${date}.xlsx`)
  // }

  // const downloadCSV = () => {
  //   // Flatten and sort the complete data by date, ensuring no duplicates
  //   const csvData = excelData.map(studentEntry => {
  //     // Convert each studentEntry object to an array of individual records
  //     return Object.values(studentEntry)
  //       .slice(0, studentEntry.weekCount)
  //       .map(student => ({
  //         studentName: student.studentName,
  //         studentRoll: student.studentRoll,
  //         college: student.college,
  //         branch: student.branch,
  //         studentMobile: student.studentMobile,
  //         email: student.email,
  //         passedOutYear: student.passedOutYear,
  //         gender: student.gender,
  //         fatherName: student.fatherName,
  //         fatherMobile: student.fatherMobile,
  //         date: student.date,
  //         inTime: student.inTime,
  //         outTime: student.outTime,
  //       }))
  //   })
  //     .flat()
  //     .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date

  //   // Convert to CSV
  //   const csvRows = [
  //     [
  //       "Student Name",
  //       "Student Roll",
  //       "College",
  //       "Branch",
  //       "Student Mobile",
  //       "Email",
  //       "Passed Out Year",
  //       "Gender",
  //       "Father Name",
  //       "Father Mobile",
  //       "Date",
  //       "In Time",
  //       "Out Time",
  //     ],
  //     ...csvData.map(student => [
  //       student.studentName,
  //       student.studentRoll,
  //       student.college,
  //       student.branch,
  //       student.studentMobile,
  //       student.email,
  //       student.passedOutYear,
  //       student.gender,
  //       student.fatherName,
  //       student.fatherMobile,
  //       student.date,
  //       student.inTime,
  //       student.outTime,
  //     ]),
  //   ]
  //     .map(e => e.join(","))
  //     .join("\n")

  //   // Create a Blob from the CSV string
  //   const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" })
  //   const link = document.createElement("a")
  //   const url = URL.createObjectURL(blob)
  //   link.setAttribute("href", url)
  //   link.setAttribute("download", `Weekly_Students_Report-of-${date}.csv`)
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

  const downloadExcel = () => {
    const workbook = xlsx.utils.book_new()

    // Convert your data into a worksheet format
    const worksheetData = excelData && excelData
      .sort((a, b) => {
        const rollComparison = a.studentRoll.localeCompare(b.studentRoll)
        if (rollComparison !== 0) {
          return rollComparison
        }
        return new Date(a.date) - new Date(b.date)
      })
      .map(student => [
        student.studentRoll,
        student.studentName,
        student.gender,
        student.college,
        student.branch,
        student.fatherName,
        student.fatherMobile,
        student.email,
        student.passedOutYear,
        student.date,
      ])

    // Add header row
    worksheetData.unshift([
      "student Roll",
      "Student Name",
      "Gender",
      "College",
      "Branch",
      "Father Name",
      "Father Mobile",
      "Student Email",
      "Passed Out Year",
      "Date",
    ])

    // Convert the data to a sheet
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData)

    // Append the sheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Student Data")

    // Generate the Excel file and trigger download in the browser
    const toDate = new Date(date)
    const fromDate = new Date(date)
    fromDate.setDate(fromDate.getDate() - 6)

    const fd = moment(new Date(fromDate)).format("DD-MM-YYYY")
    const td = moment(new Date(toDate)).format("DD-MM-YYYY")
    xlsx.writeFile(workbook, `Weekly_Students_Report_${fd}_to_${td}.xlsx`)
  }

  const downloadCSV = () => {
    const csvData =
      excelData &&
      excelData
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(student => ({
          studentName: student.studentName,
          studentRoll: student.studentRoll,
          college: student.college,
          branch: student.branch,
          studentMobile: student.studentMobile,
          email: student.email,
          passedOutYear: student.passedOutYear,
          gender: student.gender,
          fatherName: student.fatherName,
          fatherMobile: student.fatherMobile,
          date: new Date(student.date),
        }))

    // Convert to CSV
    const csvRows = [
      [
        "Student Name",
        "Student Roll",
        "College",
        "Branch",
        "Student Mobile",
        "Email",
        "Passed Out Year",
        "Gender",
        "Father Name",
        "Father Mobile",
        "Date",
      ],
      ...csvData.map(student => [
        student.studentName,
        student.studentRoll,
        student.college,
        student.branch,
        student.studentMobile,
        student.email,
        student.passedOutYear,
        student.gender,
        student.fatherName,
        student.fatherMobile,
        student.date,
      ]),
    ]
      .map(e => e.join(","))
      .join("\n")

    // Create a Blob from the CSV string
    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)

    const toDate = new Date(date)
    const fromDate = new Date(date)
    fromDate.setDate(fromDate.getDate() - 6)

    const fd = moment(new Date(fromDate)).format("DD-MM-YYYY")
    const td = moment(new Date(toDate)).format("DD-MM-YYYY")

    link.setAttribute("download", `Weekly_Students_Report_${fd}_to_${td}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const FrequentStudentData =  useMemo(
    () => ({
    columns: [
      { label: "SNO", field: "SNO" },
      { label: "Student Roll.No", field: "studentRoll" },
      { label: "Student Name", field: "studentName" },
      { label: "Gender", field: "gender" },
      { label: "College", field: "college" },
      { label: "Branch", field: "branch" },
      { label: "No.of LateComes", field: "Count", sort: "desc" },
      { label: "Actions", field: "buttons" },
    ],
    rows:
      tableData &&
      tableData
        .sort((a, b) => b.Count - a.Count)
        .map((student, index) => ({
          ...student,
          SNO: index + 1,
          buttons: (
            <Button
              onClick={() => handleButtonClick(student)}
              className="btn btn-primary waves-effect waves-light"
            >
              View
            </Button>
          ),
        })),
      }),
      [tableData],
    )

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {loader ? (
        <Loader />
      ) : (
        <div style={{ width: "100%" }}>
          {selectedStudent && (
            <ViewStudentWeekData
              isOpen={modalOpen}
              toggle={() => setModalOpen(!modalOpen)}
              student={selectedStudent}
            />
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card style={{ width: "50%" }}>
              <CardBody
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CardTitle className="h4">Select Dates</CardTitle>
                <Col>
                  <div className="form-group mb-4">
                    <label>Select last date of the week</label>
                    <Flatpickr
                      value={date}
                      onChange={date => setDate(new Date(date))}
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                      }}
                    />
                    {/* <Flatpickr
                      className="form-control d-block"
                      placeholder="dd M,yyyy"
                      value={date}
                      onChange={handleDateChange}
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                      }}
                    /> */}
                  </div>
                </Col>
              </CardBody>
            </Card>
          </div>

          <Row>
            <Col className="col-12">
              <Card>
                <CardTitle
                  className="h1"
                  style={{
                    textAlign: "center",
                    fontSize: "25px",
                    marginTop: "20px",
                  }}
                >
                  Students Weekly Report
                </CardTitle>
                <CardBody>
                  <div className="d-flex justify-content-end">
                    <Button
                      type="button"
                      color="primary"
                      onClick={downloadExcel}
                      style={{ margin: 10, fontWeight: 600 }}
                    >
                      EXCEL
                    </Button>
                    <Button
                      type="button"
                      color="primary"
                      onClick={downloadCSV}
                      style={{ margin: 10, fontWeight: 600 }}
                    >
                      CSV
                    </Button>
                  </div>
                  <MDBDataTable
                    data={FrequentStudentData}
                    responsive
                    bordered
                    striped
                    pagesAmount={3}
                    noBottomColumns
                    paginationLabel={["Prev", "Next"]}
                    hover
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}

export default connect(null, { setBreadcrumbItems })(WeeklyReport)
