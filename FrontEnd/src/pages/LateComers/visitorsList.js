import React, { useEffect, useState, useRef } from 'react';
import { setBreadcrumbItems } from 'store/actions';
import { connect } from 'react-redux';
import { MDBDataTable } from "mdbreact"
import { Row, Col, Card, CardBody, Button, CardTitle } from "reactstrap"
import Barcode from 'react-barcode';
import axios from 'axios';
import moment from 'moment';
import {
  InputGroup,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Loader from "./loader"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import * as xlsx from 'xlsx';


const axiosAPI = axios.create();

function VisitorsList(props) {
  const baseUrl = process.env.REACT_APP_API
  const todayString = moment(new Date()).format('DD-MM-YYYY');
  const [finalData, setFinalData] = useState(null)
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("ALL COLLEGES");
  const [otherInput, setOtherInput] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loader, setloader] = useState(false);
  const [dropPlaces, setDropPlaces] = useState([])
  const [head ,setHead] = useState("ALL COLLEGES")

  const obj = {
    fromDate: todayString,
    toDate: todayString,
    isOthersSelected: false,
    place: "ALL COLLEGES"
  }


  useEffect(() => {
    setloader(true)
    axios.get(baseUrl + `/get-Visitors-Bt-Dates/${obj.toDate}/${obj.fromDate}/${obj.place}/${obj.isOthersSelected}`)
      .then((result) => {
        console.log(result.data)
        setFinalData(result.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setloader(false)
      })

    axios.get(baseUrl + "/getPlaces")
      .then((result) => {
        console.log(result.data)
        const resultData = ["ALL COLLEGES", ...result.data]
        setDropPlaces(resultData)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setloader(false)
      })
  }, [])


  const barcodeRef = useRef(null);

  useEffect(() => {
    console.log(selectedStudent);
    <div ref={barcodeRef}>
      <Barcode value={{ selectedStudent }} displayValue={false} />
    </div>
  }, [selectedStudent])

  const breadcrumbItems = [
    { title: "Late Comers", link: "#" },
    { title: "Visitors List", link: "#" },
  ];

  useEffect(() => {
    props.setBreadcrumbItems('New Visitor', breadcrumbItems);
  });



  const finalFunn = (student) => {
    return `
    <html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
          @page {
            margin : 0;
          }
          @media print {
            body {
              padding = 0px
              margin: 0px;
              width: 90%;
              height: 40%;
              box-sizing: border-box;
              position: relative;
              left: 3%;
            }

            .visitor-Details {
              position: absolute;
              top: 0px;
              left: 10px;
              width: 120px;
              height: 3px;
            }

            .header-details {
              height: 40px;
              display: flex;
              justify-content: space-evenly;
              align-items: flex-end;
              border-bottom: 2px solid green;
              margin-bottom: 20px;
            }
            .header-details div {
              width: 140px;
              height: 50px;
              margin-bottom: 5px;
            }
            .header-details div img {
              width: 100%;
              height: 100%;
              
            }
            .print-container {
              font-family: Arial, sans-serif;
              width: 95%;
              height: 100%;
              padding: 20px;
              position: relative;
            }

            .barcode-container {
              position: absolute;
              top: 70px;
              right: 40px;
              text-align: right;
            }

            h3 {
              text-align: center;
              font-size: 20px;
              margin-top : 0px;
              height: 25px;
              border: 2px solid transparent;
              border-bottom-color: green;
            }
            
            p {
              margin: 5px 3px;
              font-size: 16px;
            }

            .Acknowledgement{
              position: absolute;
              bottom: 130px;
              font-size: 12px;
              font-weight: 100;
            }
            .Signature-section {
              position: absolute;
              width: 100%;
              height: 20px;
              bottom: 60px;
            }
            .Signatures {
              width: 95%;
              height: 100%;
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid green;
            }
            .Note {
              position: absolute;
              bottom: 0px;
            }
            .Note p {
              font-size: 12px;
            }
          }
        </style>
      </head>
      <body>
      
        <div class="print-container" style= "border : 2px solid green">
          <div class="barcode-container" style= "opacity : 100">
            ${barcodeRef.current.innerHTML}
          </div>
          <p class="visitor-Details"><i class="fa-solid fa-id-card"></i>Visitor Pass</p>
          <div class= "header-details">
            <p><strong>Gate Pass: </strong> ${student.passNumber.substring(7)}</p>
            <p id="inDate"><strong>Issued on:</strong> ${student.inDate}</p>
            <p><strong>In Time :</strong> ${student.inTime}</p>
            <div>
              <img src = "./UniversityLogo.png"/>
            </div>
          </div>
          <p><strong>Visitor Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${student.visitorName}</p>
          <p><strong>Visitor Phone&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${student.visitorPhone}</p>
          <p><strong>Coming From&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${student.visitorPlace}</p>
          <p><strong>No.of Visitors&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${student.visitorCount}</p>
          <p><strong>Vehicle No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${student.visitorVehicle}</p>
          <p><strong>Person To Meet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${student.personToMeet}</p>
          <p><strong>Place to Go &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong>${student.placeToGo === "others" ? student.otherPlace : student.placeToGo}</p>
          <p><strong>Purpose &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${student.visitorPurpose}</p>
          <p><strong>Material with Visitor :</strong> ${student.visitorMaterial.length > 0 ? student.visitorMaterial : "No"}</p>
          <p class= "Acknowledgement"><strong>I/We have understood the briefing given to us on norms to be followed by us within the campus during our visit within the site</strong></p>
          <div class= "Signature-section">
            <div class= "Signatures">
              <div>Security Officer</div>
              <div>Signature of the Visitor</div>
              <div>Signature of the Officer in Charge</div>
            </div>
          </div>
          <div class= "Note">
              <p><span style= "font-weight: bold; font-size: 14px">Note:</span> &nbsp;&nbsp;<i class="fa-solid fa-pen-to-square"></i>Visitors are requested to take the signature of the officer they met and should submit this gate pass at the gate security &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; going out of the gate.</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-pen-to-square"></i>Entry into construction area, class work area is prohibited without permission.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  }

  const handleButtonClick = (student) => {
    setSelectedStudent(student.passNumber)
    console.log(student)
    console.log(selectedStudent);

    let printContent;

    setTimeout(() => {
      printContent = finalFunn(student);
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(printContent);
      iframe.contentWindow.document.close();

      // Listen for the print dialog closing
      iframe.contentWindow.onafterprint = () => {
        document.body.removeChild(iframe);
      };

      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 1000);


  }

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const handleSubmit = e => {
    e.preventDefault();
    setloader(true)

    if (selectedOption === "Others" && !otherInput.trim()) {
      console.error("Please enter the place name.");
      setloader(false)
      return;
    }

    if (fromDate > toDate) {
      console.error("From date must be before to date.");
      toast.warn('Provide a Valid Dates to Search', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setloader(false)
      return;
    }

    const isOthersSelected = selectedOption === "Others";

    const searchValue = isOthersSelected ? otherInput : selectedOption;

    const resObject = {
      place: searchValue,
      fromDate: moment(new Date(fromDate)).format('DD-MM-YYYY'),
      toDate: moment(new Date(toDate)).format('DD-MM-YYYY'),
      selectedOthers: isOthersSelected.toString(),
    };

    console.log(resObject);
    setHead(resObject.place)
    axios.get(baseUrl + `/get-Visitors-Bt-Dates/${resObject.toDate}/${resObject.fromDate}/${resObject.place}/${resObject.isOthersSelected}`)
      .then((result) => {
        console.log(result.data);
        setFinalData(result.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setloader(false)
      })
    return resObject;
  };

  const handleDropdownChange = value => {
    setSelectedOption(value);
    if (value !== "Others") {
      setOtherInput("");
    }
  };

  const downloadExcel = () => {
    const workbook = xlsx.utils.book_new();

    // Convert your data into a worksheet format
    const worksheetData = finalData.map(v => [
      v.inDate, v.inTime, v.otherPlace, v.outDate, v.outTime, v.passNumber.split('-')[1],
      v.personToMeet, v.placeToGo, v.visitorCount, v.visitorEmail, v.visitorMaterial,
      v.visitorName, v.visitorPhone, v.visitorPlace, v.visitorPurpose, v.visitorVehicle
    ]);

    // Add header row
    worksheetData.unshift([
      'In Date', 'In Time', 'Other Place', 'Out Date', 'Out Time', 'Pass Number',
      'Person to Meet', 'Place to Go', 'Visitor Count', 'Visitor Email', 'Visitor Material',
      'Visitor Name', 'Visitor Phone', 'Visitor Place', 'Visitor Purpose', 'Visitor Vehicle'
    ]);

    // Convert the data to a sheet
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);

    // Append the sheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Visitors');

    // Generate the Excel file and trigger download in the browser
    const fDate = moment(new Date(fromDate)).format("DD-MM-YYYY");
    const tDate = moment(new Date(toDate)).format("DD-MM-YYYY");
    xlsx.writeFile(workbook, `${head}_Visitors_${fDate}_to_${tDate}.xlsx`);
  }

  const downloadCSV = () => {
    const csvData = finalData.map(visitor => ({
      inDate: visitor.inDate,
      inTime: visitor.inTime,
      otherPlace: visitor.otherPlace,
      outDate: visitor.outDate,
      outTime: visitor.outTime,
      passNumber: visitor.passNumber,
      personToMeet: visitor.personToMeet,
      placeToGo: visitor.placeToGo,
      visitorCount: visitor.visitorCount,
      visitorEmail: visitor.visitorEmail,
      visitorMaterial: visitor.visitorMaterial,
      visitorName: visitor.visitorName,
      visitorPhone: visitor.visitorPhone,
      visitorPlace: visitor.visitorPlace,
      visitorPurpose: visitor.visitorPurpose,
      visitorVehicle: visitor.visitorVehicle,
    }));

    // Convert to CSV
    const csvRows = [
      ['In Date', 'In Time', 'Other Place', 'Out Date', 'Out Time', 'Pass Number', 'Person to Meet', 'Place to Go', 'Visitor Count', 'Visitor Email', 'Visitor Material', 'Visitor Name', 'Visitor Phone', 'Visitor Place', 'Visitor Purpose', 'Visitor Vehicle'],
      ...csvData.map(visitor => [
        visitor.inDate, visitor.inTime, visitor.otherPlace, visitor.outDate, visitor.outTime,
        visitor.passNumber, visitor.personToMeet, visitor.placeToGo, visitor.visitorCount,
        visitor.visitorEmail, visitor.visitorMaterial, visitor.visitorName,
        visitor.visitorPhone, visitor.visitorPlace, visitor.visitorPurpose, visitor.visitorVehicle
      ]),
    ].map(e => e.join(",")).join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'visitors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const collegeNames = [
    { label: "ALL COLLEGES" },
    { label: "Aditya University" },
    { label: "ACET" },
    { label: "Aditya Pharmacy College" },
    { label: "Aditya College of Pharmacy" },
    { label: "Pharmacy" },
    { label: "B-School" },
    { label: "Boys Hostel" },
    { label: "Girls Hostel" },
    { label: "Aditya Degree PG College" },
  ];

  const data = {
    columns: [
      { label: "SNO", field: "SNO" },
      { label: "IN DATE", field: "inDate" },
      { label: "VNAME", field: "visitorName" },
      { label: "PLACE TO VISIT", field: "placeToGo" },
      { label: "PERSON TO MEET", field: "personToMeet" },
      { label: "MOBILE", field: "visitorPhone" },
      { label: "IN TIME", field: "inTime" },
      { label: "OUT TIME", field: "outTime" },
      { label: "Actions", field: "buttons" },
    ],
    rows: finalData && finalData.sort((a, b) => {
      const dateComparison = b.inDate.localeCompare(a.inDate);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return b.inTime.localeCompare(a.inTime);
    })
      .map((visitor, index) => ({
        ...visitor,
        SNO: index + 1,
        buttons: (
          <Button
            onClick={() => handleButtonClick(visitor)}
            className="btn waves-effect waves-light"
            style={{ letterSpacing: 0.5, backgroundColor: "#5CB85C" }}
          >
            PRINT
          </Button>
        ),
      }))

  }

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      {loader ? <Loader /> :
        <div style={{ width: "100%" }}>

          <div
            className="h2"
            style={{ textAlign: "center", textTransform: "uppercase" }}
          >
            {`${head}`}
          </div>
          <div style={styles.container}>
            <h2 style={styles.heading}>VISITOR LIST</h2>
            <AvForm onSubmit={handleSubmit} style={styles.form} className="needs-validation">
              <div style={styles.inpGroup}>
                <div className="form-group mb-2" style={styles.formGroup}>
                  <Label>From Date</Label>
                  <InputGroup>

                    <Flatpickr
                      className="form-control d-block"
                      placeholder="DD-MM-YYYY"
                      options={{ dateFormat: "d-m-Y" }}
                      onChange={selectedDates => setFromDate(selectedDates[0])}
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
                      onChange={selectedDates => setToDate(selectedDates[0])}
                      value={toDate}
                    />
                  </InputGroup>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label>Select Place</label>
                <div className="form-group mb-3" style={styles.toggleOthersInput}>
                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle caret color="secondary">
                      {selectedOption} <i className="mdi mdi-chevron-down" />
                    </DropdownToggle>
                    {console.log(dropPlaces)}
                    <DropdownMenu>
                      {dropPlaces && dropPlaces.sort((a, b) => a.localeCompare(b)).map((college, index) => (

                        <DropdownItem
                          key={index}
                          onClick={() => handleDropdownChange(college)}
                        >
                          {college}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  {/* {selectedOption === "Others" && (
                  <AvField
                    name="others"
                    type="text"
                    className="form-control"
                    placeholder="Enter the other place"
                    value={otherInput}
                    onChange={e => setOtherInput(e.target.value)}
                    errorMessage="Please enter the place name."
                    validate={{ required: { value: true } }}
                  />
                )} */}
                </div>
              </div>

              <Button color="primary" type="submit" style={styles.button}>
                Search
              </Button>
            </AvForm>
          </div>
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="flex-grow-1 text-center">
                      <h1 style={{ fontSize: "25px", margin: 0 }}>Visitors Data</h1>
                    </div>
                    <div>
                      <Button type="button" color="primary" onClick={downloadExcel} style={{ marginRight: 10, fontWeight: 600 }} > EXCEL</Button>
                      <Button type="button" color="primary" onClick={downloadCSV} style={{ fontWeight: 600 }}> CSV</Button>
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
          <div className="mb-3" style={{ display: "none" }}>
            {(
              <div ref={barcodeRef}>
                <Barcode value={`${selectedStudent}`} displayValue={false} />
              </div>
            )}
          </div>

        </div>
      }
      <ToastContainer />
    </div>
  )
}

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
  toggleOthersInput: {
    display: "flex",
    gap: "2rem",
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

export default connect(null, { setBreadcrumbItems })(VisitorsList);