import React, { useEffect, useState } from "react";
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./ViewStudentDataStyles.css";
import axios from "axios";

const SuspendAlert = ({ isOpen, toggle, student , hook }) => {
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
    hook = !hook
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
        Suspend Alert...
      </ModalHeader>
      <ModalBody style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "10px" }}>
        <Row className="details_group">
          {/* <div className="mb-3 col-lg-6">
            <div className="span">Student Code:</div> {student.studentRoll}
          </div>
          <div className="mb-3 col-lg-6">
            <div className="span">Student Name:</div> {student.studentName}
          </div> */}
          <p>Do you want to Suspend this Student</p>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleUpdate}>
          YES
        </Button>
        <Button color="secondary" onClick={toggle}>
          NO
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SuspendAlert;
