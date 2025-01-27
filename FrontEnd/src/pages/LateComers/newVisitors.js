import React, { useEffect, useState, useRef } from 'react';
import { setBreadcrumbItems } from 'store/actions';
import { connect } from 'react-redux';
import Barcode from 'react-barcode';
import axios from 'axios';
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  CardTitle,
  Label,

} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import moment from 'moment';
import { concat } from 'lodash';
import PreviewModal from './previewModel';

function NewVisitors(props) {

  const baseUrl = process.env.REACT_APP_API
  const [GetPass, setGetPass] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const [listColleges, setListColleges] = useState(new Set(["OTHERS", "ADITYA UNIVERSITY", "ADITYA COLLEGE OF ENGINEERING & TECHNOLOGY", "ADITYA PHARMACY COLLEGE", "ADITYA COLLEGE OF PHARMACY", "ADITYA POLYTECHNIC COLLEGE", "ADITYA GLOBAL BUSINESS SCHOOL", "ADITYA DEGREE AND PG COLLEGE", "ADITYA GLOBAL BUSINESS SCHOOL (ACET)"]));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    axios.get(baseUrl + '/get-SNo')
      .then((result) => {
        console.log(result.data)
        const passNumber = result.data[0] ? result.data[0].sum + 1 : 1;
        const formattedPass = passNumber < 10 ? `0${passNumber}` : `${passNumber}`;
        setGetPass(formattedPass);
        console.log(GetPass)
      }).catch((er) => {
        console.log(er)
      })

      axios.get(baseUrl + "/getPlaces")
      .then((result) => {
        const updatedColleges = new Set([...listColleges, ...result.data]);
        setListColleges(updatedColleges);
        console.log([...listColleges]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [formKey, isUpdated])

  const [date , setdate] = useState(new Date());
  const [SelectCollege, SetSelectCollege] = useState(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select College");
  const [FormData, setFormData] = useState({
    visitorName: "",
    visitorPlace: "",
    visitorPhone: "",
    visitorEmail: "",
    visitorVehicle: "",
    visitorMaterial: "",
    personToMeet: "",
    visitorCount: "",
    visitorPurpose: "",
    placeToGo: "",
    inDate: moment(new Date()).format("DD-MM-YYYY"),
    outDate: "",
    inTime: date.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
    outTime: "",
    passNumber: GetPass,
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      passNumber: GetPass  // Update passNumber in FormData
    }));
  }, [GetPass]);

  const formRef = useRef();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmited, SetisSubmited] = useState(false);
  const [showBar, setshowBar] = useState(false);
  const barcodeRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleInputChange = (event) => {
    setFormData({ ...FormData, [event.target.name]: event.target.value });
    if (event.target.name === "visitorPhone") {
      setshowBar(true);
    }

    if (event.target.name === 'otherPlace'){
      const value = event.target.value;
      setFormData({...FormData, placeToGo : value.toUpperCase()});
    }
  };

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const handleDropdownChange = value => {
    console.log(FormData.inDate);
    setSelectedOption(value);
    setIsOtherSelected(false);
    setFormData({...FormData, placeToGo : value})
    if(value === "OTHERS"){
      setIsOtherSelected(true);
      setFormData({...FormData, placeToGo : ""});
    }
  };

  const handleReset = () => {
    setFormData({
      visitorName: "",
      visitorPlace: "",
      visitorPhone: "",
      visitorEmail: "",
      visitorVehicle: "",
      visitorMaterial: "",
      personToMeet: "",
      visitorCount: "",
      visitorPurpose: "",
      placeToGo: "",
      otherPlace: "",
      inDate: moment(new Date()).format("DD-MM-YYYY"),
      outDate: "",
      inTime: date.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }),
      outTime: "",
      passNumber: GetPass,
    });
    SetSelectCollege(null);
    setIsOtherSelected(false);
    SetisSubmited(false);
    setshowBar(false);
    setIsUpdated(true);
    setSelectedOption("Select College");
    setFormKey(Date.now());
  };
  

  const breadcrumbItems = [
    { title: "Late Comers", link: "#" },
    { title: "New Visitor", link: "#" },
  ];
  

  useEffect(() => {
    // props.setBreadcrumbItems('New Visitor', breadcrumbItems);
  });

  // Form validation logic
  useEffect(() => {
    const isValid =
      FormData.visitorName &&
      /^[a-zA-Z\s]+$/.test(FormData.visitorName) &&
      FormData.visitorPlace &&
      /^[a-zA-Z\s]+$/.test(FormData.visitorPlace) &&
      FormData.visitorEmail &&
      FormData.personToMeet &&
      /^[a-zA-Z0-9\s()]+$/.test(FormData.personToMeet) &&
      FormData.visitorCount &&
      FormData.visitorPurpose &&
      /^[a-zA-Z\s]+$/.test(FormData.visitorPurpose) &&
      FormData.placeToGo &&
      FormData.inDate &&
      /^\d{10}$/.test(FormData.visitorPhone); // Validate visitorPhone
  
    setIsFormValid(isValid);
  }, [FormData]);


  const handlePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  }

  const togglePreviewModal = () => {
    setIsPreviewOpen((prevState) => !prevState);
  };

  const printDetails = () => {
    setIsPreviewOpen(!isPreviewOpen);
    // Get the current time and update FormData
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const Data = { ...FormData, inTime: currentTime, passNumber : "VISITOR" + GetPass };
    setFormData(Data);
    console.log(Data);
  
    // Generate the print content
    const printContent = `
      <html>
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <style>
            @page {
              margin: 0;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
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
                border: 2px solid green;
                margin-top: 20px;
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
                margin-top: 0;
                height: 25px;
                border: 2px solid transparent;
                border-bottom-color: green;
              }
              p {
                margin: 5px 3px;
                font-size: 16px;
              }
              .Acknowledgement {
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
                display: flex;
                justify-content: space-between;
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
                bottom: 5px;
              }
              .Note p {
                font-size: 12px;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="barcode-container" style="opacity: 100">
              ${barcodeRef.current.innerHTML}
            </div>
            <p class="visitor-Details"><i class="fa-solid fa-id-card"></i>Visitor Pass</p>
            <div class="header-details">
              <p><strong>Gate Pass: </strong> ${FormData.passNumber}</p>
              <p id="inDate"><strong>Issued on:</strong> ${FormData.inDate}</p>
              <p><strong>In Time :</strong> ${Data.inTime}</p>
              <div>
                <img src="./UniversityLogo.png"/>
              </div>
            </div>
            <p><strong>Visitor Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${FormData.visitorName.toUpperCase()}</p>
            <p><strong>Visitor Phone&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${FormData.visitorPhone}</p>
            <p><strong>Coming From&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${FormData.visitorPlace.toUpperCase()}</p>
            <p><strong>No.of Visitors&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${FormData.visitorCount}</p>
            <p><strong>Vehicle No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${FormData.visitorVehicle}</p>
            <p><strong>Person To Meet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${FormData.personToMeet.toUpperCase()}</p>
            <p><strong>Place to Go &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong>${FormData.placeToGo.toUpperCase()}</p>
            <p><strong>Purpose &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</strong> ${FormData.visitorPurpose.toUpperCase()}</p>
            <p><strong>Material with Visitor :</strong> ${FormData.visitorMaterial.length > 0 ? FormData.visitorMaterial.toUpperCase() : "NO"}</p>
            <p class="Acknowledgement"><strong>I/We have understood the briefing given to us on norms to be followed by us within the campus during our visit within the site</strong></p>
            <div class="Signature-section">
              <div class="Signatures">
                <div>Security Officer</div>
                <div>Signature of the Visitor</div>
                <div>Signature of the Officer in Charge</div>
              </div>
            </div>
            <div class="Note">
              <p><span style="font-weight: bold; font-size: 14px">Note:</span> <i class="fa-solid fa-pen-to-square"></i> Visitors are requested to take the signature of the officer they met and should submit this gate pass at the gate security going out of the gate.</p>
              <p><i class="fa-solid fa-pen-to-square"></i> Entry into construction area, class work area is prohibited without permission.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  
    // Create an iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
  
    // Write the content to the iframe
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(printContent);
    iframeDoc.close();
  
    // Flag to check if print was successful
    let printConfirmed = false;
  
    // Listen for print events
    window.onbeforeprint = () => {
      printConfirmed = false; // Reset the flag before opening the print dialog
    };
  
    iframe.contentWindow.onafterprint = () => {
      console.log("Print dialog closed");
      
      // Only call axios if print was confirmed
      if (printConfirmed) {
        // Call axios to save the data
        axios.post(baseUrl + "/add-Visitor", Data)
          .then((result) => {
            console.log("Added successfully ");
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
          handleReset();
          document.body.removeChild(iframe);
      }
  
       // Remove the iframe after printing
    };
  
    // Trigger the print dialog
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  
    // After triggering the print dialog, set the flag to true
    printConfirmed = true;
  };
  
  

  return ( 
    <div style={{display:"flex",justifyContent:"center"}}>
    <Card style={{width:"90%"}}>
      <CardBody>
        <CardTitle className="h1" style={{textAlign:"center", marginBottom: "20px", fontSize:"25px"}}>Add New Visitor</CardTitle>
        <AvForm ref={formRef} key={formKey}>
          <Row>
            <Col>
              <AvField
                className="mb-1"
                label="Visitor Name"
                name="visitorName"
                type="text"
                value= {FormData.visitorName}
                placeholder="Enter Visitor Name"
                errorMessage="Enter Visitor Name"
                onChange={handleInputChange}
                validate={{
                  required: { value: true },
                  pattern: {
                    value: "^[a-zA-Z ,]+$",
                    errorMessage: "Only letters",
                  },
                }}
              />
            </Col>
            <Col>
              <AvField
                className="mb-3"
                name="visitorPlace"
                label="Place [From]"
                type="text"
                value= {FormData.visitorPlace}
                placeholder="Enter Place"
                errorMessage="Enter Place"
                onChange={handleInputChange}
                validate={{
                  required: { value: true },
                  pattern: {
                    value: "^[a-zA-Z ,]+$",
                    errorMessage: "Only letters",
                  },
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
                <AvField
                  className="mb-3"
                  name="visitorPhone"
                  label="Phone.No"
                  type="number"
                  value= {FormData.visitorPhone}
                  placeholder="Enter mobile number"
                  errorMessage="Enter mobile number"
                  onChange={handleInputChange}
                  validate={{
                    required: { value: true },
                    pattern: {
                      value: "^[0-9]+$",
                      errorMessage: "Only numbers",
                    },
                    minLength: { value: 10, errorMessage: "Enter exactly 10 digits" },
                    maxLength: { value: 10, errorMessage: "Enter exactly 10 digits" },
                  }}
                />
            </Col>
            <Col>
              <AvField
                className="mb-3"
                name="visitorEmail"
                label="Visitor Email"
                value= {FormData.visitorEmail}
                placeholder="Enter Valid Email"
                type="email"
                errorMessage="Invalid Email"
                onChange={handleInputChange}
                validate={{
                  required: { value: true },
                  email: { value: true },
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <AvField
                className="mb-3"
                name="visitorVehicle"
                label="Vehicle.No"
                value= {FormData.visitorVehicle}
                placeholder="Enter Vehicle number"
                type="text"
                errorMessage="Enter Vehicle number"
                onChange={handleInputChange}
                validate={{
                  pattern: {
                    value: "^[0-9a-zA-Z]+$",
                    errorMessage: "No Special Characters and spaces are not allowed",
                  },
                }}
              />
            </Col>
            <Col>
              <AvField
                className="mb-3"
                name="visitorMaterial"
                label="Material"
                value= {FormData.visitorMaterial}
                placeholder="Material (if any)"
                type="text"
                onChange={handleInputChange}
                validate={{
                  required: { value: false },
                  pattern: {
                    value: "^[0-9a-zA-Z ,]+$",
                    errorMessage: "Only text",
                  },
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <AvField
                className="mb-3"
                name="personToMeet"
                label="Person To Meet   "
                value= {FormData.personToMeet}
                placeholder="Search Person"
                type="text"
                errorMessage="Enter Person Name"
                onChange={handleInputChange}
                validate={{
                  required: { value: true },
                  pattern: {
                    value: "^[0-9a-zA-Z() ,]+$",
                    errorMessage: "Please enter valid name (or) Roll number",
                  },
                }}
              />
            </Col>
            <Col>
              <AvField
                className="mb-3"
                name="visitorCount"
                label= "No.of Visitors"
                value= {FormData.visitorCount}
                placeholder= "Enter No.of Visitors"
                type= "number"
                onChange={handleInputChange}
                validate={{
                  required: { value: true },
                  pattern: {
                    value: "^[0-9]+$",
                    errorMessage: "Only numbers",
                  },
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <AvField
                className="mb-3"
                label="Purpose"
                name="visitorPurpose"
                type="text"
                value= {FormData.visitorPurpose}
                placeholder="Purpose"
                errorMessage="Enter Purpose"
                onChange={handleInputChange}
                validate={{
                  required: { value: true },
                  pattern: {
                    value: "^[a-zA-Z ,]+$",
                    errorMessage: "Only letters",
                  },
                }}
              />
            </Col>
            <Col>
    <div className="mb-3" id="Others">
        <Label>College</Label>
        <div className="form-group mb-3">
            <Select
                value={{ label: selectedOption, value: selectedOption }}
                onChange={(selected) => handleDropdownChange(selected.value)}
                options={listColleges && [...listColleges].sort((a, b) => a.localeCompare(b)).map(college => ({
                    label: college,
                    value: college
                }))}
                styles={{
                  menu: (provided) => ({
                      ...provided,
                      maxHeight: '230px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                          width: '0px',
                          display: 'none'
                      },
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: '230px',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '0px',
                        display: 'none',
                    },
                }),
              }}
                placeholder="Select a College"
            />
        </div>
    </div>
</Col>
          </Row>
          <div
            className="mb-3"
            style={{ display: isOtherSelected === true ? 'block' : 'none' }}
          >
            <AvField
              name="otherPlace"
              label="Enter Manually"
              placeholder="Enter manually"
              errorMessage="Please fill this field"
              onChange={handleInputChange}
              value= {FormData.placeToGo === "others" ? "" : FormData.placeToGo}
              validate={{
                required: { value: true },
                pattern: {
                  value: "^[a-zA-Z ,.()]+$",
                  errorMessage: "Only letters",
                },
              }}
            />
          </div>
          <Row>
          <Col className="mb-3">
      <label
        htmlFor="example-time-input"
        className="col-md-2 col-form-label"
      >
        Date
      </label>
      <div className="mb-1">
        <input
          className="form-control"
          type="text"
          name='date'
          value={FormData.inDate}
          readOnly
        />
      </div>
    </Col>
          <Col className="mb-3">
                <label
                  htmlFor="example-time-input"
                  className="col-md-2 col-form-label"
                >
                  In Time
                    </label>
                <div className="mb-1">
                  <input
                    className="form-control"
                    type="time"
                    name='inTime'
                    value={FormData.inTime}
                    readOnly
                    
                  />
                </div>
              </Col>
              </Row>
              <Row>
                <Col className="mb-3">
                <label
                  htmlFor="example-time-input"
                  className="col-md-2 col-form-label"
                >
                  Pass.No
                    </label>
                <div className="mb-1">
                  <input
                    className="form-control"
                    type="number"
                    name='passNumber'
                    value={FormData.passNumber}
                    readOnly
                    
                  />
                </div>
              </Col>
                    
                <Col>
                <FormGroup className="mb-0">
            <div style={{display : "flex", justifyContent : "space-evenly", marginTop : "30px", width : "40%", minWidth : "250px"}}>
              <Button
                color='success'
                className='ms-1'
                onClick={handlePreview}
                disabled={!isFormValid}
              >Preview</Button>

<PreviewModal
            isOpen={isPreviewOpen}
            toggle={togglePreviewModal}
            data={FormData}
            onPrint= {printDetails}
          />

              <Button type="reset" color="secondary" onClick={handleReset}>
                Cancel
              </Button>
            </div>
          </FormGroup>
                </Col>
              </Row>


              

              <div className="mb-3" style={{ display: "none" }}>
            {showBar && (
              <div ref={barcodeRef}>
                <Barcode value={`VISITOR${FormData.passNumber}`} displayValue={false} />
              </div>
            )}
          </div>
        </AvForm>
      </CardBody>
    </Card>
    </div>
  );
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
  customDropdown : {
    maxHeight : "200px",
    overflowY : "scroll"
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

export default connect(null, { setBreadcrumbItems })(NewVisitors);