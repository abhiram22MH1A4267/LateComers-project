import React, { useState, useEffect, useMemo } from "react";
import { InputGroup, Label, Button } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import ViewStudentData from "./ViewStudentData";
import ViewStudentWeekData from "./ViewStudentWeekData"
import ViewFacultyData from "./ViewFacultyData";
import { setBreadcrumbItems } from "store/actions";
import { connect } from "react-redux";
import Loader from "./loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import * as xlsx from 'xlsx'


const StudentSearch = (props) => {
  const baseUrl = process.env.REACT_APP_API
  const [searchParameter, setSearchParameter] = useState("");
  const [fromDate, setFromDate] = useState(moment(new Date() , "YYYY-MM-DD").format('DD-MM-YYYY'));
  const [toDate, setToDate] = useState(moment(new Date() , "YYYY-MM-DD").format('DD-MM-YYYY'));
  const [resultData, setResultData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loader, setloader] = useState(false);

  const breadcrumbItems = [
    { title: "Late Comers", link: "#" },
    { title: "Search", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems('New Visitor', breadcrumbItems);
  });

  const { branch, college } = useParams();

  const handleSubmit = e => {
    setloader(true);
    e.preventDefault();

    if (searchParameter.trim() === "" || fromDate > toDate) {
      setloader(false);
      return;
    }

    // const formatDate = date => {
    //   console.log(date)
    //   const d = moment(date , "YYYY-MM-DD" ).format("DD-MM-YYYY")
    //   console.log(d)
    //   return date;
    // };

    const resObject = {
      fromDate: fromDate,
      toDate: toDate,
    };

    const isFaculty = searchParameter.length < 10;

    const fetchData = async () => {
      try {
        let result;
        if (isFaculty) {
          resObject.facultyId = searchParameter.toUpperCase();
          result = await axios.get(baseUrl + `/search-Faculty/${resObject.facultyId}/${resObject.fromDate}/${resObject.toDate}`);
        } else {
          resObject.rollNo = searchParameter.toUpperCase();
          result = await axios.get(baseUrl + `/search-Student/${resObject.rollNo}/${resObject.fromDate}/${resObject.toDate}`, resObject);
        }

        if (result.data.length === 0) {
          setResultData([])
          toast.warn(`No data exists for ${searchParameter.toUpperCase()}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });

        } else {
          console.log(`The data of ${searchParameter} is getting successfully`);
          setResultData(result.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error(`Error While fetching data`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } finally {
        setloader(false);
      }
    };

    fetchData();
  };

  const handleButtonClick = student => {
    setSelectedPerson(student);
    setModalOpen(true);
  };

  const downloadExcel = () => {
    const workbook = xlsx.utils.book_new();

    // Convert your data into a worksheet format
    const worksheetData = Array.from(resultData).map(v => [
      v.studentRoll, v.studentName, v.gender, v.college, v.date, v.inTime, v.passedOutYear
    ]);

    // Add header row
    worksheetData.unshift([
      'student Roll', 'Student Name', 'Gender', 'College', 'Date', 'In_Time', 'Passed Out Year'
    ]);

    // Convert the data to a sheet
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);

    // Append the sheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Search Result');

    // Generate the Excel file and trigger download in the browser
    xlsx.writeFile(workbook,`${searchParameter.toUpperCase()}_Data_${fromDate}_to_${toDate}`);
  }

  const downloadCSV = () => {
    const csvData = Array.from(resultData).map(student => ({
      studentRoll: student.studentRoll,
      studentName: student.studentName,
      gender: student.gender,
      college: student.college,
      date: student.date,
      inTime: student.inTime,
      passoutYear: student.passedOutYear
    }));

    // Convert to CSV
    const csvRows = [
      ['Student Roll', 'Student Name', 'Gender', 'College', 'Date', 'In_Time', 'Passed Out Year'],
      ...csvData.map(student => [
        student.studentRoll, student.studentName, student.gender, student.college, student.date, student.inTime, student.passoutYear
      ]),
    ].map(e => e.join(",")).join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'Student search result.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const studentData = useMemo(() => ({
    columns: [
      { label: "Student Roll", field: "studentRoll", sort: "asc", },
      { label: "Student Name", field: "studentName", sort: "asc", },
      { label: "Gender", field: "gender", sort: "asc", },
      { label: "College", field: "college", sort: "asc", },
      { label: "Branch", field: "branch", sort: "asc", },
      { label: "Date", field: "date", sort: "asc" },
      { label: "Time In", field: "inTime", sort: "asc", },
      { label: "Time Out", field: "outTime", sort: "asc", },
      {
        label: "Actions",
        field: "buttons",
        sort: "asc",
        width: 100,
        buttons: (student) => (
          <Button
            color="primary"
            onClick={() => handleButtonClick(student)}
            className="btn btn-primary waves-effect waves-light"
          >
            View
          </Button>
        )
      }
    ],
    rows: resultData
      .sort((a, b) => {
        const dateComparison = b.date.localeCompare(a.date);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        return b.inTime.localeCompare(a.inTime);
      })
      .map((student) => ({
        ...student,
        buttons: (
          <Button
            color="primary"
            onClick={() => handleButtonClick(student)}
            className="btn btn-primary waves-effect waves-light"
          >
            View
          </Button>
        ),
      }))
    ,
  }), [resultData]);


  const facultyData = {
    columns: [
      { label: "Faculty ID", field: "facultyId" },
      { label: "Faculty Name", field: "facultyName" },
      { label: "Gender", field: "facultyGender" },
      { label: "College", field: "facultyCollege" },
      { label: "Date", field: "date" },
      { label: "Late Count", field: "Count" },
      { label: "Time In", field: "inTime" },
      {
        label: "Actions",
        field: "buttons",
        default: row => (
          <Button color="primary" onClick={() => handleButtonClick(row)}>View</Button>
        ),
      },
    ],
    rows: resultData && resultData.sort((a, b) => b.date.localeCompare(a.date)).map(student => ({
      ...student,
      buttons: (
        <Button color="primary" onClick={() => handleButtonClick(student)}>
          View
        </Button>
      ),
    })),
  };
  console.log(facultyData.rows);

  return (
    <>
      {
        searchParameter.length < 10 ? selectedPerson && (
          <ViewFacultyData
            isOpen={modalOpen}
            toggle={() => setModalOpen(!modalOpen)}
            faculty={selectedPerson}
          />
        )
          :
          selectedPerson && (
            <ViewStudentData
              isOpen={modalOpen}
              toggle={() => setModalOpen(!modalOpen)}
              student={selectedPerson}
            />
          )
      }

      <div style={styles.container}>
        <h2 style={styles.heading}>Search</h2>

        <AvForm onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Enter Student ID / Employee ID </label>
            <AvField
              name="rollNO"
              placeholder="Search by Roll No"
              type="text"
              errorMessage="Please enter the roll no."
              className="form-control"
              validate={{ required: { value: true } }}
              value={searchParameter}
              style={styles.input}
              onChange={e => setSearchParameter(e.target.value)}
            />
          </div>

          <div style={styles.inpGroup}>
            <div className="form-group mb-4" style={styles.formGroup}>
              <Label>From Date</Label>
              <InputGroup>
                <Flatpickr
                  className="form-control d-block"
                  options={{ dateFormat: "d-m-Y" }}
                  onChange={selectedDates => setFromDate(moment(selectedDates[0] , "YYYY-MM-DD").format("DD-MM-YYYY"))}
                  value={fromDate}
                />
              </InputGroup>
            </div>

            <div className="form-group mb-4" style={styles.formGroup}>
              <Label>To Date</Label>
              <InputGroup>
                <Flatpickr
                  className="form-control d-block"
                  options={{ dateFormat: "d-m-Y" }}
                  onChange={selectedDates => setToDate(moment(selectedDates[0] , "YYYY-MM-DD").format("DD-MM-YYYY"))}
                  value={toDate}
                />
              </InputGroup>
            </div>
          </div>

          <Button color="primary" type="submit" style={styles.button}>
            Search
          </Button>
        </AvForm>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        {loader ? <Loader /> :
          <div style={{ width: "100%" }}>
            <div className="studentTable">
              <Row className="my-4">
                <Col className="col-12">
                  <Card className="shadow">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="flex-grow-1 text-center">
                          <h1 style={{ fontSize: "25px", margin: 0 }}>Searched Data</h1>
                        </div>
                        <div>
                          <Button type="button" color="primary" onClick={downloadExcel} style={{ marginRight: 10, fontWeight: 600 }} > EXCEL</Button>
                          <Button type="button" color="primary" onClick={downloadCSV} style={{ fontWeight: 600 }}> CSV</Button>
                        </div>
                      </div>
                      <MDBDataTable
                        data={searchParameter.length < 10 ? facultyData : studentData}
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
          </div>
        }
        <ToastContainer />
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
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
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
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
  },
  dateGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
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
}

export default connect(null, { setBreadcrumbItems })(StudentSearch);
