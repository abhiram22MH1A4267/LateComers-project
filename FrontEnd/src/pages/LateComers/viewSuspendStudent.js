import React from "react"
import {
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap"

import "./ViewStudentDataStyles.css"

const ViewModal = ({ isOpen, toggle, student }) => {

  console.log(student);

  const styles = {
    label: {
      fontWeight: 'bold',
      marginRight: '8px',
    },
    latecomeDatesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    latecomeDate: {
      padding: '6px 12px',
      borderRadius: '4px',
      color: '#333',
      minWidth: '100px',
      textAlign: 'center',
    },
    noDates: {
      color: '#999',
      fontStyle: 'italic',
    },
  };

  const renderDates = () => {
    if (student.date && student.date.length > 0) {
      return (
        <div style={styles.latecomeDatesGrid}>
          {student.date.map((date, index) => (
            <div key={index} style={styles.latecomeDate}>
              {date}
            </div>
          ))}
        </div>
      );
    }
    return <span style={styles.noDates}>No latecoming dates available</span>;
  };


  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {student ? `Details of ${student.studentName}` : "Student Details"}
      </ModalHeader>
      <ModalBody>
        <Row className="details_group">
          <div className="mb-12 image-div">
            <img src={`https://info.aec.edu.in/adityacentral/studentphotos/${student.studentRoll}.jpg`} alt="student" className="student-image" />
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6 ">
            <div className="span">Student Code:</div> {student.studentRoll}
          </div>
          <div className="mb-3 col-lg-6 ">
            <div className="span">Student Name:</div> {student.studentName}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6 ">
            <div className="span">College:</div> {student.college}
          </div>
          <div className="mb-3 col-lg-6 ">
            <div className="span">Branch:</div> {student.branch}
          </div>
        </Row>
        <Row className="details_group">
          <div className="mb-3 col-lg-6 ">
            <div className="span">Student Mobile:</div> {student.studentMobile}
          </div>
          <div className="mb-3 col-lg-6 ">
            <div className="span">Gender :</div> {student.gender}
          </div>
        </Row>
        <Row className="details_group">
          
          <div className="mb-3 col-lg-6 ">
            <div className="span">PassOut Year:</div> {student.passedOutYear}
          </div>
          <div className="mb-3 col-lg-6 ">
            <div className="span">Father Mobile:</div> {student.fatherMobile}
          </div>
        </Row>          
          



      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ViewModal
