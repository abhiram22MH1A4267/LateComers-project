import React from "react";
import {
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import "./ViewStudentDataStyles.css";

const ViewFacultyData = ({ isOpen, toggle, faculty }) => {
  console.log(faculty);

  // Convert the dates into a 4x4 grid format
  const renderDateGrid = () => {
    if (!faculty || !faculty.date) return null;

    // Split dates into chunks of 4
    const rows = [];
    for (let i = 0; i < faculty.date.length; i += 4) {
      rows.push(faculty.date.slice(i, i + 4));
    }

    return rows.map((row, rowIndex) => (
      <Row
        key={rowIndex}
        className={`details_group ${row.length <= 4 ? 'justify-content-start' : 'justify-content-between'}`}
      >
        {row.map((date, colIndex) => (
          <div key={colIndex} className="mb-3 col-lg-3 text-center">
            <div className="span">{date}</div>
          </div>
        ))}
      </Row>
    ));
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {faculty ? `Details of ${faculty.facultyName}` : "Faculty Details"}
      </ModalHeader>
      <ModalBody style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft:"10px" }}>
        <Row className="details_group">
          <div className="mb-3 image-div">
            <img
              src={`https://info.aec.edu.in/ACET/employeephotos/${faculty.facultyId}.jpg`}
              alt="faculty"
              className="faculty-image"
            />
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6 ">
            <div className="span">Faculty Id:</div> {faculty.facultyId}
          </div>
          <div className="mb-3 col-lg-6 ">
            <div className="span">Faculty Name:</div> {faculty.facultyName}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6 ">
            <div className="span">College:</div> {faculty.facultyCollege}
          </div>
          <div className="mb-3 col-lg-6 ">
            <div className="span">College Code:</div> {faculty.facultyCollegeCode}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6 ">
            <div className="span">Faculty Mobile:</div> {faculty.facultyMobile}
          </div>
          <div className="mb-3 col-lg-6 ">
            <div className="span">Faculty Mail:</div> {faculty.facultyMail}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6 ">
            <div className="span">Gender :</div> {faculty.facultyGender}
          </div>
          <div className="mb-3 col-lg-6 ">
            <div className="span">Count :</div> {faculty.date.length}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-12">
            <div className="span">Dates:</div>
            {renderDateGrid()}
          </div>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewFacultyData;
