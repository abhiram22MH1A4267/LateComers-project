import React, { useEffect, useState } from "react";
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./ViewStudentDataStyles.css";
import axios from "axios";
import suspendAlert from "./suspendAlert"

const ViewStudentData = ({ isOpen, toggle, student , hook }) => {
  const baseUrl = process.env.REACT_APP_API;
  const [isUpdated, setIsUpdated] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    roll: "",
    isSuspended: "NO", // Default value, will change based on student
  });

  // Set the updatedData state when student prop changes
  useEffect(() => {
    if (student) {
      setUpdatedData({
        roll: student.studentRoll,
        isSuspended: student.suspended
      });
    }
  }, [student]);

  const handleSuspend = (value) => {
    setUpdatedData({ ...updatedData, isSuspended: value });
  };

  const handleUpdate = () => {

    console.log(updatedData);

    axios.put(baseUrl + "/update-Student", updatedData)
      .then((res) => {
        console.log(res);
        setIsUpdated(!isUpdated); // Trigger useEffect to fetch updated data
      })
      .catch((err) => {
        console.log(err);
      });
    toggle(); // Close the modal after updating
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {student ? `Details of ${student.studentName}` : "Student Details"}
      </ModalHeader>
      <ModalBody style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "10px" }}>
        <Row className="details_group">
          <div className="mb-12 image-div">
            <img
              src={`https://info.aec.edu.in/adityacentral/studentphotos/${student.studentRoll}.jpg`}
              alt="student"
              className="student-image"
            />
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6">
            <div className="span">Student Code:</div> {student.studentRoll}
          </div>
          <div className="mb-3 col-lg-6">
            <div className="span">Student Name:</div> {student.studentName}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6">
            <div className="span">College:</div> {student.college}
          </div>
          <div className="mb-3 col-lg-6">
            <div className="span">Branch:</div> {student.branch}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6">
            <div className="span">Student Mobile:</div> {student.studentMobile}
          </div>
          <div className="mb-3 col-lg-6">
            <div className="span">Gender :</div> {student.gender}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6">
            <div className="span">PassOut Year:</div> {student.passedOutYear}
          </div>
          <div className="mb-3 col-lg-6">
            <div className="span">Father Name :</div> {student.fatherName}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6">
            <div className="span">Father Mobile:</div> {student.fatherMobile}
          </div>
          <div className="mb-3 col-lg-6">
            <label className="span" style={{ fontWeight: 'bold', marginRight: '8px' }}>Select Option:</label>
            <div className="input-group">
              <select
                className="form-control"
                value={updatedData.isSuspended}
                onChange={(e) => handleSuspend(e.target.value)}
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleUpdate}>
          Update
        </Button>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewStudentData;
