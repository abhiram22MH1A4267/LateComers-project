import React, { useState, useEffect } from "react"
import { setBreadcrumbItems } from "store/actions"
import { connect } from "react-redux"
import { studentData } from "./dummyData"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap"
import axios from "axios"
import { set } from "lodash"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/material_blue.css"
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect"
import "flatpickr/dist/plugins/monthSelect/style.css"
import moment from "moment"
import ViewStudentData from "./ViewStudentData"
import ViewStudentWeekData from "./ViewStudentWeekData"
import Loader from "./loader"
import * as xlsx from "xlsx"

function MonthlyReport(props) {
  const baseUrl = process.env.REACT_APP_API
  const breadcrumbItems = [
    { title: "Late Comers", link: "#" },
    { title: "Report", link: "#" },
    { title: "Monthly Report", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems("Monthly Report", breadcrumbItems)
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [OverallStudents, setOverallStudents] = useState([])
  const [FrequentStudents, setFrequentStudents] = useState([])
  const [loader, setLoader] = useState(false)

  const [monthYear, setMonthYear] = useState(new Date())

  useEffect(() => {
    setLoader(true)
    axios
      .get(baseUrl + `/student-Monthly-Report/${monthYear}`)
      .then(res => {
        // console.log(res.data)
        setFrequentStudents(res.data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoader(false)
      })
  }, [monthYear])

  const handleButtonClick = student => {
    console.log(student)
    setSelectedStudent(student)
    setModalOpen(true)
  }

  const downloadExcel = () => {
    const workbook = xlsx.utils.book_new()

    // Convert your data into a worksheet format
    const worksheetData = []
    Array.from(FrequentStudents)
      .sort((a, b) => {
        const rollComparison = a.studentRoll.localeCompare(b.studentRoll)
        if (rollComparison !== 0) {
          return rollComparison
        }
        return new Date(a.date) - new Date(b.date)
      })
      .forEach(student => {
        console.log(student)
        student.date.forEach(date => {
          worksheetData.push([
            student.studentRoll,
            student.studentName,
            student.gender,
            student.college,
            student.branch,
            student.fatherName,
            student.fatherMobile,
            student.email,
            student.studentMobile,
            student.passedOutYear,
            student.date,
          ])
        })
      })

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
      "Student Mobile",
      "Passed Out Year",
      "Date",
    ])

    // Convert the data to a sheet
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData)

    // Append the sheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Monthly Student Report")

    // Generate the Excel file and trigger download in the browser
    const date = moment(new Date(monthYear)).format("MM-YYYY")
    xlsx.writeFile(workbook, `Monthly Student Report_${date}.xlsx`)
  }

  const downloadCSV = () => {
    const csvData = []
    Array.from(FrequentStudents).forEach(student => {
      student.date.forEach(date => {
        csvData.push({
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
          date: new Date(student.date)
        })
      })
    })

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
    const date = moment(new Date(monthYear)).format("MM-YYYY")
    link.setAttribute("download", `Monthly_Student_Report-${date}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const FrequentStudentData = {
    columns: [
      { label: "SNO", field: "SNO" },
      { label: "Student Roll.No", field: "studentRoll" },
      { label: "Student Name", field: "studentName" },
      { label: "Gender", field: "gender" },
      { label: "College", field: "college" },
      { label: "branch", field: "branch" },
      {
        label: "No. of Latecomes",
        field: "Count",
        sort: "desc",
      },
      { label: "Actions", field: "buttons" },
    ],
    rows: Array.from(FrequentStudents)
      .sort((a, b) => b.Count - a.Count)
      .map((student, index) => ({
        ...student,
        SNO: index + 1,
        buttons: (
          <Button
            color="primary"
            onClick={() => handleButtonClick(student)}
            className="btn btn-primary waves-effect waves-light"
          >
            View
          </Button>
        ),
      })),
  }

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
            <Card style={{ width: "40%" }}>
              <CardBody
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CardTitle className="h4" style={{ marginBottom: "40px" }}>
                  Select Month
                </CardTitle>
                <div style={{ marginBottom: "20px", width: "50%" }}>
                  <label>Select Month</label>
                  {/* <Flatpickr className="form-control" placeholder="From Date" options={{ }} value={fromDate} onChange={(date) => setFromDate(date[0].toLocaleDateString('en-CA'))} />&nbsp;&nbsp;&nbsp;&nbsp; */}

                  <Flatpickr
                    value={monthYear}
                    onChange={date =>
                      setMonthYear(
                        date[0].toLocaleDateString("en-CA").slice(0, 7),
                      )
                    } // Get only YYYY-MM
                    options={{
                      dateFormat: "Y-m",
                      plugins: [
                        new monthSelectPlugin({
                          shorthand: true,
                          dateFormat: "Y-m",
                          altFormat: "F Y",
                        }),
                      ],
                      altInput: true,
                    }}
                  />

                  <style jsx>{`
                    .flatpickr-monthSelect-months {
                      width: 125%;
                      display: grid;
                      grid-template-columns: repeat(4, 1fr); /* 4 columns */
                      grid-template-rows: repeat(3, 1fr); /* 3 rows */
                      gap: 10px; /* Add some space between the months */
                    }
                    .flatpickr-monthSelect-month {
                      padding: 10px;
                      text-align: center;
                      cursor: pointer;
                      border-radius: 5px;
                      transition: background 0.3s;
                      width: 100%;
                    }
                    .flatpickr-monthSelect-month:hover {
                      background-color: #f0f0f0; /* Add hover effect */
                    }
                    .flatpickr-monthSelect-month.selected {
                      background-color: #007bff;
                      color: white;
                    }
                  `}</style>
                </div>
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
                  Students Monthly Report
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
    </div>
  )
}

export default connect(null, { setBreadcrumbItems })(MonthlyReport)
