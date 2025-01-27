import React, { useState, useEffect } from "react"
import { setBreadcrumbItems } from "store/actions"
import { connect } from "react-redux"
import { studentData } from "./dummyData"
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap"
import axios from "axios"
import { set } from "lodash"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import "flatpickr/dist/plugins/monthSelect/style.css";
import moment from "moment"
import ViewStudentData from "./ViewStudentData"
import ViewStudentWeekData from "./ViewStudentWeekData"
import Loader from "./loader"
import * as xlsx from 'xlsx';

function MonthlyReport(props) {

  const baseUrl = process.env.REACT_APP_API
  const breadcrumbItems = [
    { title: "Late Comers", link: "#" },
    { title: "Report", link: "#" },
    { title: "Monthly Report", link: "#" },
  ]

  useEffect(() => {
    props.setBreadcrumbItems('Monthly Report', breadcrumbItems)
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [OverallStudents, setOverallStudents] = useState([])
  const [FrequentStudents, setFrequentStudents] = useState([])
  const [loader, setLoader] = useState(false)

  const [monthYear, setMonthYear] = useState(moment(new Date(), 'YYYY-MM').format('MM-YYYY'));

  useEffect(() => {
    setLoader(true)
    console.log(monthYear);

    axios.get(baseUrl + `/student-Monthly-Report/${monthYear}`)
      .then((res) => {
        console.log(res.data)
        // setOverallStudents(res.data[0]);
        setFrequentStudents(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoader(false)
      })
  }, [monthYear]);

  // Step 3: Handle monthYear change
  const handleChange = (event) => {
    setMonthYear(moment(event[0], 'YYYY-MM').format('MM-YYYY'));
  };

  const handleButtonClick = student => {
    console.log(student)
    setSelectedStudent(student);
    setModalOpen(true);
  }

  // const MonthData = {
  //   columns: [
  //     {
  //       label: "Date",
  //       field: "date",
  //       sort: "asc",
  //       width: 100,
  //     },
  //     {
  //       label: "Student Roll.No",
  //       field: "studentRoll",
  //       sort: "asc",
  //       width: 100,
  //     },
  //     {
  //       label: "Student Name",
  //       field: "studentName",
  //       sort: "asc",
  //       width: 100,
  //     },
  //     {
  //       label: "Time_In",
  //       field: "inTime",
  //       sort: "asc",
  //       width: 100,
  //     },
  //     {
  //       label: "Gender",
  //       field: "gender",
  //       sort: "asc",
  //       width: 100,
  //     },
  //     {
  //       label: "College",
  //       field: "college",
  //       sort: "asc",
  //       width: 100,
  //     },
  //     {
  //       label: "Actions",
  //       field: "buttons",
  //       sort: "asc",
  //       width: 100,
  //     },
  //   ],
  //   rows: Array.from(OverallStudents).map((student) =>  ({
  //     ...student,
  //     buttons: (
  //       <Button
  //         color="primary"
  //         onClick={() => handleButtonClick(student)}
  //         className="btn btn-primary waves-effect waves-light"
  //       >
  //         View
  //       </Button>
  //     ),
  //   })),
  // }


  const downloadExcel = () => {
    const workbook = xlsx.utils.book_new();

    // Convert your data into a worksheet format
    const worksheetData = [];
    Array.from(FrequentStudents).forEach(student => {
        student.date.forEach(date => {
            worksheetData.push([
                student.studentRoll,
                student.studentName,
                student.gender,
                student.college,
                student.branch,
                student.fatherName,
                student.fatherMobile,
                date,
                
            ]);
        });
    });

    worksheetData.sort((a, b) => {
      const [dayA, monthA, yearA] = a[7].split('-').map(Number);
      const [dayB, monthB, yearB] = b[7].split('-').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA - dateB;
  });

    // Add header row
    worksheetData.unshift([
        'Student Roll', 'Student Name', 'Gender', 'College', 'branch', 'Father Name', 'Father Mobile', 'Date'
    ]);

    // Convert the data to a sheet
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);

    // Append the sheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Monthly Student Report');

    // Generate the Excel file and trigger download in the browser
    xlsx.writeFile(workbook, `Monthly Student Report-${monthYear}.xlsx`);
}


const downloadCSV = () => {
  const csvData = [];
  Array.from(FrequentStudents).forEach(student => {
      student.date.forEach(date => {
          csvData.push({
              studentRoll: student.studentRoll,
              studentName: student.studentName,
              gender: student.gender,
              college: student.college,
              branch: student.branch,
              fatherName: student.fatherName,
              fatherMobile: student.fatherMobile,
              date: date,
          });
      });
  });

  csvData.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('-').map(Number);
    const [dayB, monthB, yearB] = b.date.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA - dateB;
});

  // Convert to CSV
  const csvRows = [
      ['Student Roll', 'Student Name', 'Gender', 'College', 'branch', 'Father Name', 'Father Mobile', 'Date'],
      ...csvData.map(student => [
          student.studentRoll,
          student.studentName,
          student.gender,
          student.college,
          student.branch,
          student.fatherName,
          student.fatherMobile,
          student.date,
      ]),
  ].map(e => e.join(",")).join("\n");

  // Create a Blob from the CSV string
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `Monthly_Student_Report-${monthYear}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
    rows: Array.from(FrequentStudents).sort((a, b) => b.Count - a.Count).map((student, index) => ({
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
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      {loader ? <Loader /> :
        <div style={{width : "100%"}}>
          {selectedStudent && (
            <ViewStudentWeekData
              isOpen={modalOpen}
              toggle={() => setModalOpen(!modalOpen)}
              student={selectedStudent}
            />
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card style={{ width: "40%" }}>
              <CardBody style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CardTitle className="h4" style={{ marginBottom: "40px" }}>Select Month</CardTitle>
                <div style={{ marginBottom: "20px", width: "50%" }}>
                  <label>Select Month</label>
                  <Flatpickr
                    value={monthYear}
                    onChange={(date) => handleChange(date)}
                    options={{
                      plugins: [
                        new monthSelectPlugin({
                          shorthand: true,
                          dateFormat: "m-Y",
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
          grid-template-columns: repeat(4, 1fr);  /* 4 columns */
          grid-template-rows: repeat(3, 1fr);     /* 3 rows */
          gap: 10px;  /* Add some space between the months */
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
              <CardTitle className="h1" style={{textAlign : "center", fontSize : "25px", marginTop : "20px"}}>Students Monthly Report</CardTitle>
              <CardBody>
              <div className="d-flex justify-content-end">
                <Button type="button" color="primary" onClick={downloadExcel} style={{margin : 10 , fontWeight : 600}}>EXCEL</Button>
                <Button type="button" color="primary" onClick={downloadCSV} style={{margin : 10 , fontWeight : 600}}>CSV</Button>
              </div>
                  <MDBDataTable
                    data={FrequentStudentData}
                    responsive
                    bordered
                    striped
                    noBottomColumns
                    paginationLabel={["Prev", "Next"]}
                    hover
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      }
    </div>



  )
}

export default connect(null, { setBreadcrumbItems })(MonthlyReport)
