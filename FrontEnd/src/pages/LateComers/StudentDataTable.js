import React, { useEffect, useState, useMemo } from "react";
import { InputGroup, Label, Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { MDBDataTable } from "mdbreact";
import ViewStudentData from "./ViewStudentData";
import ViewStudentWeekData from './ViewStudentWeekData'
import viewSuspendStudent from "./viewSuspendStudent"
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "./loader"
import moment from "moment";
import * as xlsx from 'xlsx';

const StudentDataTable = () => {
  const baseUrl = process.env.REACT_APP_API
  const [fromDate, setFromDate] = useState(moment(new Date()).format("DD-MM-YYYY"));
  const [toDate, setToDate] = useState(moment(new Date()).format("DD-MM-YYYY"));
  const [finalData, setFinalData] = useState([]);
  const { college, branch } = useParams();
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setLoader(true)
    const data = {
      college: college,
      branch: branch,
      fromDate : moment(new Date()).format("DD-MM-YYYY")
    };

    // axios.get(baseUrl + `/today-Student-Data/${college}/${branch}`)
    //   .then((result) => {
    //     setFinalData(result.data);
    //     console.log("Today data fetched successfully", result.data);
    //   })
    //   .catch((err) => {
    //     console.log("Error fetching today’s data", err);
    //   })
    //   .finally(() => {
    //     setLoader(false)
    //   })
    
    axios.get(baseUrl + `/college-Branch-Date-Data/${college}/${branch}/${fromDate}/${fromDate}`)
      .then((result) => {
        if (JSON.stringify(result.data) !== JSON.stringify(finalData)) {
          setFinalData(result.data);
        }
        console.log(result.data);
      })
      .catch((err) => {
        console.log("Error fetching data by date", err);
      })
      .finally(() => {
        setLoader(false)
      })

  }, [college, branch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)


    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const resultObj = {
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      college: college,
      branch: branch
    };

    axios.get(baseUrl + `/college-Branch-Date-Data/${college}/${branch}/${fromDate}/${toDate}`)
      .then((result) => {
        if (JSON.stringify(result.data) !== JSON.stringify(finalData)) {
          setFinalData(result.data);
        }
        console.log(result.data);
      })
      .catch((err) => {
        console.log("Error fetching data by date", err);
      })
      .finally(() => {
        setLoader(false)
      })
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleButtonClick = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const downloadExcel = () => {
    const workbook = xlsx.utils.book_new();

    // Convert your data into a worksheet format
    const worksheetData = finalData.excelData.sort((a,b) => a.date.localeCompare(b.date)).map(student => [
      student.studentRoll, student.studentName, student.gender, student.college, student.branch, student.fatherName, student.fatherMobile,  student.date, student.inTime, student.outTime
    ]);

    // Add header row
    worksheetData.unshift([
      'student Roll', 'Student Name', 'Gender', 'College', "Branch", "Father Name", "Father Mobile",  'Date', 'In Time', 'Out Time'
    ]);

    // Convert the data to a sheet
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);

    // Append the sheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Student Data');

    // Generate the Excel file and trigger download in the browser
    xlsx.writeFile(workbook, `Student_L_C_${college} (${branch})_${fromDate}_to_${toDate}.xlsx`);
  }

  const downloadCSV = () => {
    const csvData = finalData.excelData.map(student => ({
      studentRoll: student.studentRoll,
      studentName: student.studentName,
      gender: student.gender,
      college: student.college,
      branch : student.branch,
      date: student.date,
      inTime: student.inTime,
      outTime: student.outTime
    }));

    // Convert to CSV
    const csvRows = [
      ['Student Roll', 'Student Name', 'Gender', 'College',"Branch" ,"Father Name", "Father Mobile",  'Date', 'In Time', 'Out Time'],
      ...csvData.map(student => [
        student.studentRoll, student.studentName, student.gender, student.college, student.branch ,student.fatherName, student.fatherMobile, student.date, student.inTime, student.outTime
      ]),
    ].map(e => e.join(",")).join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_L_C_${college} (${branch})_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const data = useMemo(() => ({
    columns: [
      { label: "STUDENT ROLL", field: "studentRoll", sort: "asc", },
      { label: "STUDENT NAME", field: "studentName", sort: "asc", },
      { label: "GENDER", field: "gender", sort: "asc", },
      { label: "COLLEGE", field: "college", sort: "asc", },
      { label: "BRANCH", field: "branch", sort: "asc",},
      { label: "LATE COUNT", field: "Count", sort: "asc" },
      // { label: "Time_Out", field: "outTime", sort: "asc", },
      {
        label: "Actions", field: "buttons", sort: "asc",
        buttons: (student) => (
          <Button
            onClick={() => handleButtonClick(student)}
            className="btn btn-primary waves-effect waves-light"
          >
            View
          </Button>
        )
      }
    ],
    rows: finalData.tableDate && finalData.tableDate
      .sort((a, b) =>  b.Count - a.Count
      //   {
      //   const dateComparison = b.date[0].localeCompare(a.date[0]);
      //   if (dateComparison !== 0) {
      //     return dateComparison;
      //   }
      //   return b.inTime.localeCompare(a.inTime);
      // }
    )
      .map((student) => ({
        ...student,
        buttons: (
          <Button
            onClick={() => handleButtonClick(student)}
            className="btn btn-primary waves-effect waves-light"
          >
            View
          </Button>
        ),
      }))
    ,
  }), [finalData]);


  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        {loader ? <Loader /> :
          <div style={{ width: "100%" }}>
            {selectedStudent && (
              <ViewStudentWeekData
                isOpen={modalOpen}
                toggle={() => setModalOpen(!modalOpen)}
                student={selectedStudent}
              />
            )}
            <div
              className="h2"
              style={{ textAlign: "center", textTransform: "uppercase" }}
            >
              {`${college} (${branch})`}
            </div>
            <div style={styles.container}>
              <h2 style={styles.heading}>SEARCH BY DATE</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inpGroup}>
                  <div className="form-group mb-2" style={styles.formGroup}>
                    <Label>From Date</Label>
                    <InputGroup>
                      <Flatpickr
                        className="form-control d-block"
                        placeholder="DD-MM-YYYY"
                        options={{ dateFormat: "d-m-Y" }}
                        onChange={selectedDates => setFromDate(moment(selectedDates[0]).format("DD-MM-YYYY"))}
                        value={fromDate}
                      />
                    </InputGroup>
                  </div>

                  <div className="form-group mb-2" style={styles.formGroup}>
                    <Label>To Date</Label>
                    <InputGroup>
                      <Flatpickr
                        className="form-control d-block"
                        placeholder="DD-MM-YYYY"
                        options={{ dateFormat: "d-m-Y" }}
                        onChange={selectedDates => setToDate(moment(selectedDates[0]).format("DD-MM-YYYY"))}
                        value={toDate}
                      />
                    </InputGroup>
                  </div>
                </div>
                <Button color="primary" type="submit" style={styles.button}>
                  Search
                </Button>
              </form>
            </div>
            <div className="table">
              <Row>
                <Col className="col-12">
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3" style={{ margin: -20 }}>
                        <div className="flex-grow-1 text-center">
                          <h1 style={{ fontSize: "25px", margin: 0 }}>Student Data</h1>
                        </div>
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
                      </div>

                      <MDBDataTable
                        data={data}
                        responsive
                        bordered
                        striped
                        noBottomColumns
                        paginationLabel={["Prev", "Next"]}
                        hover
                        pagesAmount={3}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>


          </div>

        }
      </div>


    </>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "0.25rem",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow:
      "0 -3px 31px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.02)",
    marginBottom: "2rem",
  },
  heading: {
    textAlign: "center",
    margin: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inpGroup: {
    display: "flex",
    justifyContent: "space-evenly",
    gap: "2rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    padding: "0.5rem",
    color: "#fff",
    border: "none",
    borderRadius: "0.25rem",
    cursor: "pointer",
    width: "40%",
    alignSelf: "center",
  },
};

export default StudentDataTable;
