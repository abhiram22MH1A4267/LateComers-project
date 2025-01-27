import React, { useEffect, useState, useMemo } from "react";
import { InputGroup, Label } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap";
import ViewFacultyData from "./ViewFacultyData";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "./loader"
import moment from "moment";
import * as xlsx from 'xlsx';

const FacultyDataTable = () => {
  const baseUrl = process.env.REACT_APP_API
  const [fromDate, setFromDate] = useState(moment(new Date()).format('DD-MM-YYYY'));
  const [toDate, setToDate] = useState(moment(new Date()).format('DD-MM-YYYY'));
  const [finalData, setFinalData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const { college } = useParams();
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const data = { 
      facultyCollege: college,
     };

    axios
      .get(baseUrl + `/college-Date-Data/${data.facultyCollege}/${fromDate}/${toDate}`)
      .then((result) => setFinalData(result.data))
      .catch((err) => console.log("Error while fetching data", err));
  }, [college]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)


    const resultObj = {
      fromDate: fromDate,
      toDate: toDate,
      facultyCollege: college,
    };

    axios.get(baseUrl + `/college-Date-Data/${resultObj.facultyCollege}/${resultObj.fromDate}/${resultObj.toDate}`)
      .then((result) => setFinalData(result.data))
      .catch((err) => console.log("Error while fetching date range data", err))
      .finally(() => {
        setLoader(false)
      })
  };

  const handleButtonClick = (faculty) => {
    setSelectedFaculty(faculty);
    setModalOpen(true);
  };



  const downloadExcel = () => {
    const workbook = xlsx.utils.book_new();

    // Convert your data into a worksheet format
    const worksheetData = finalData.excelData.map(v => [
      v.facultyId, v.facultyName, v.facultyGender, v.facultyCollege, v.date, v.inTime, v.outTime
    ]);

    // Add header row
    worksheetData.unshift([
      'Faculty Id', 'Faculty Name', 'Gender', 'Faculty College', 'Date', 'In Time', 'Out Time'
    ]);

    // Convert the data to a sheet
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);

    // Append the sheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Faculty Data');

    // Generate the Excel file and trigger download in the browser
    xlsx.writeFile(workbook, `Faculty_L_C_${college}_${fromDate}_to_${toDate}.xlsx`);
  }

  const downloadCSV = () => {
    const csvData = finalData.excelData.map(faculty => ({
      facultyId: faculty.facultyId,
      facultyName: faculty.facultyName,
      facultyGender: faculty.facultyGender,
      facultyCollege: faculty.facultyCollege,
      date: faculty.date,
      inTime: faculty.inTime,
      outTime: faculty.outTime
    }));

    // Convert to CSV
    const csvRows = [
      ['Faculty Id', 'Faculty Name', 'Gender', 'Faculty College', 'Date', 'In Time', 'Out Time'],
      ...csvData.map(faculty => [
        faculty.facultyId, faculty.facultyName, faculty.facultyGender, faculty.facultyCollege, faculty.date, faculty.inTime, faculty.outTime
      ]),
    ].map(e => e.join(",")).join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'faculty.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const data = useMemo(() => ({
    columns: [
      { label: "FACULTY ID", field: "facultyId", sort: "asc" },
      { label: "FACULTY NAME", field: "facultyName", sort: "asc" },
      { label: "GENDER", field: "facultyGender", sort: "asc" },
      { label: "COLLEGE", field: "facultyCollege", sort: "asc" },
      { label: "FACULTY PH", field: "facultyMobile", sort: "asc" },
      { label: "COUNT", field: "Count", sort: "asc" },
      // { label: "TIME IN", field: "inTime", sort: "asc" },
      // { label: "TIME OUT", field: "outTime", sort: "asc"},
      {
        label: "Actions",
        field: "buttons",
        sort: "asc",
      },
    ],
    rows: finalData.tableData && finalData.tableData
    .sort((a,b) => b.Count - a.Count)
    // .sort((a, b) => {
    //   const dateComparison = b.date.localeCompare(a.date);
    //   if (dateComparison !== 0) {
    //     return dateComparison;
    //   }
    //   return b.inTime.localeCompare(a.inTime);
    // })
      .map((faculty) => ({
        ...faculty,
        buttons: (
          <Button
            onClick={() => handleButtonClick(faculty)}
            className="btn btn-primary waves-effect waves-light "
          >
            View
          </Button>
        ),
      })),
  }),
    [finalData]
  );

  return (
    <>
      {selectedFaculty && (
        <ViewFacultyData
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          faculty={selectedFaculty}
        />
      )}

      <div
        className="h2"
        style={{ textAlign: "center", textTransform: "uppercase" }}
      >
        {`${college}`}
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
                  onChange={(selectedDates) => setFromDate(moment(selectedDates[0]).format('DD-MM-YYYY'))}
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
                  onChange={(selectedDates) => setToDate(moment(selectedDates[0]).format('DD-MM-YYYY'))}
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
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        {loader ? <Loader /> :
          <div className="table">
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center mb-3" style={{ margin: -20 }}>
                      <div className="flex-grow-1 text-center">
                        <h1 style={{ fontSize: "25px", margin: 0 }}>Staff Data</h1>
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
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
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

export default FacultyDataTable;
