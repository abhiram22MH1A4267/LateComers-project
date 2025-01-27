import React, { useState, useEffect } from "react";
import { setBreadcrumbItems } from "store/actions";
import { connect } from "react-redux";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import ViewStudentWeekData from "./ViewStudentWeekData";
import Loader from "./loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import * as xlsx from 'xlsx';

function WeeklyReport(props) {
    const baseurl = process.env.REACT_APP_API;
    const breadcrumbItems = [
        { title: "Late Comers", link: "#" },
        { title: "Report", link: "#" },
        { title: "Weekly Report", link: "#" },
    ];

    useEffect(() => {
        props.setBreadcrumbItems('Monthly Report', breadcrumbItems);
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [FrequentStudents, setFrequentStudents] = useState([]); // Simplified data for display
    const [FrequentStudentsComplete, setFrequentStudentsComplete] = useState([]); // Complete data for downloads
    const [loader, setLoader] = useState(false);

    const [date, setDate] = useState(moment(new Date(), 'YYYY-MM-DD').format("DD-MM-YYYY"));

    const handleDateChange = (selected) => {
        const formattedDate = moment(selected[0], 'YYYY-MM-DD').format("DD-MM-YYYY");
        setDate(formattedDate);
        handleSearch(formattedDate);
    };

    useEffect(() => {
        handleSearch(date);
    }, []);

    const handleSearch = (selectedDate) => {
        setLoader(true);
        axios.post(baseurl + "/student-Weekly-Report-Api", { toDate: selectedDate })
            .then((result) => {
                console.log("Backend Data:", result.data);
                
                // Store complete data for downloads
                setFrequentStudentsComplete(result.data);

                // Prepare simplified data for display
                const formattedData = result.data.sort((a,b) => b.weekCount - a.weekCount).map((studentEntry, index) => {
                    const studentDetails = studentEntry[0] || {};
                    return {
                        SNO: index + 1,
                        studentRoll: studentDetails.studentRoll,
                        studentName: studentDetails.studentName,
                        gender: studentDetails.gender,
                        college: studentDetails.college,
                        branch: studentDetails.branch,  
                        weekCount: studentEntry.weekCount,
                        buttons: (
                            <Button
                                color="primary"
                                onClick={() => handleButtonClick(studentEntry)}
                                className="btn btn-primary waves-effect waves-light"
                            >
                                View
                            </Button>
                        ),
                    };
                });

                setFrequentStudents(formattedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoader(false);
            });
    };

    const handleButtonClick = (student) => {
        const singleStudent = { ...student[0], date : student.date };
        setSelectedStudent(singleStudent);
        setModalOpen(true);
    };

    const downloadExcel = () => {
      const workbook = xlsx.utils.book_new();
  
      // Flatten and sort the complete data by date, ensuring no duplicates
      const worksheetData = FrequentStudentsComplete.map(studentEntry => {
          // Convert each studentEntry object to an array of individual records
          return Object.values(studentEntry).slice(0, studentEntry.weekCount).map(record => ({
              studentRoll: record.studentRoll,
              studentName: record.studentName,
              gender: record.gender,
              college: record.college,
              branch: record.branch,
              fatherName: record.fatherName,
              fatherMobile: record.fatherMobile,
              date: record.date,
          }));
      }).flat().sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
  
      // Convert to 2D array for worksheet
      const worksheetArray = worksheetData.map(record => [
          record.studentRoll, record.studentName, record.gender, record.college, record.branch,record.fatherName, record.fatherMobile, moment(record.date, 'YYYY-MM-DD').format("DD-MM-YYYY"),
      ]);
  
      // Add header row
      worksheetArray.unshift([
          'Student Roll', 'Student Name', 'Gender', 'College', 'branch', 'Father Name', 'Father Mobile', 'Date'
      ]);
  
      // Convert the data to a sheet
      const worksheet = xlsx.utils.aoa_to_sheet(worksheetArray);
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Students Weekly Report');
  
      // Generate the Excel file and trigger download in the browser
      xlsx.writeFile(workbook, `Weekly_Students_Report-of-${date}.xlsx`);
  };
  
  

  const downloadCSV = () => {
    // Flatten and sort the complete data by date, ensuring no duplicates
    const csvData = FrequentStudentsComplete.map(studentEntry => {
        // Convert each studentEntry object to an array of individual records
        return Object.values(studentEntry).slice(0, studentEntry.weekCount).map(record => ({
            studentRoll: record.studentRoll,
            studentName: record.studentName,
            gender: record.gender,
            college: record.college,
            branch: record.branch,
            fatherName: record.fatherName,
            fatherMobile: record.fatherMobile,
            date: record.date,
        }));
    }).flat().sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    // Convert to CSV
    const csvRows = [
        ['Student Roll', 'Student Name', 'Gender', 'College','branch', 'Father Name', 'Father Mobile', 'Date'],
        ...csvData.map(student => [
            student.studentRoll, student.studentName, student.gender, student.college, student.branch, student.fatherName, student.fatherMobile, moment(student.date, 'YYYY-MM-DD').format('DD-MM-YYYY'),
        ]),
    ].map(e => e.join(",")).join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Weekly_Students_Report-of-${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



    const FrequentStudentData = {
        columns: [
            { label: "SNO", field: "SNO" },
            { label: "Student Roll.No", field: "studentRoll" },
            { label: "Student Name", field: "studentName" },
            { label: "Gender", field: "gender" },
            { label: "College", field: "college" },
            { label: "Branch", field: "branch"},
            { label: "No.of LateComes", field: "weekCount", sort: "desc" },
            { label: "Actions", field: "buttons" },
        ],
        rows: FrequentStudents
    };

    return (
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
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Card style={{ width: "50%" }}>
                            <CardBody style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <CardTitle className="h4">Select Dates</CardTitle>
                                <Col>
                                    <div className="form-group mb-4">
                                        <label>Select last date of the week</label>
                                        <Flatpickr
                                            className="form-control d-block"
                                            placeholder="dd M,yyyy"
                                            value={date}
                                            onChange={handleDateChange}
                                            options={{
                                                altInput: true,
                                                altFormat: "F j, Y",
                                                dateFormat: "d-m-Y"
                                            }}
                                        />
                                    </div>
                                </Col>
                            </CardBody>
                        </Card>
                    </div>

                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardTitle className="h1" style={{ textAlign: "center", fontSize: "25px", marginTop: "20px" }}>
                                    Students Weekly Report
                                </CardTitle>
                                <CardBody>
                                    <div className="d-flex justify-content-end">
                                        <Button type="button" color="primary" onClick={downloadExcel} style={{ margin: 10, fontWeight: 600 }}>EXCEL</Button>
                                        <Button type="button" color="primary" onClick={downloadCSV} style={{ margin: 10, fontWeight: 600 }}>CSV</Button>
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
            <ToastContainer />
        </div>
    );
}

export default connect(null, { setBreadcrumbItems })(WeeklyReport);
