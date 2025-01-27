import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const PreviewModal = ({ isOpen, toggle, data, onPrint }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} style={{display: "flex", justifyContent: "flex-start"}}>
      <ModalHeader toggle={toggle}>Visitor Details Preview</ModalHeader>
      <ModalBody 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          padding: '10px',
          '@media print': {
            padding: '10px',
            display: 'block',
            pageBreakInside: 'avoid'
          }
        }}
      >
        <p><strong>Name:</strong> {data.visitorName}</p>
        <p><strong>Place:</strong> {data.visitorPlace}</p>
        <p><strong>Phone:</strong> {data.visitorPhone}</p>
        <p><strong>Email:</strong> {data.visitorEmail}</p>
        <p><strong>Vehicle No:</strong> {data.visitorVehicle}</p>
        <p><strong>Material:</strong> {data.visitorMaterial}</p>
        <p><strong>Person to Meet:</strong> {data.personToMeet}</p>
        <p><strong>No. of Visitors:</strong> {data.visitorCount}</p>
        <p><strong>Purpose:</strong> {data.visitorPurpose}</p>
        <p><strong>Place to Go:</strong> {data.placeToGo}</p>
        <p><strong>In Time:</strong> {data.inTime}</p>
        <p><strong>Pass Number:</strong> {data.passNumber}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
        <Button color='success' onClick={onPrint}>Print</Button>
      </ModalFooter>
    </Modal>
  );
};

export default PreviewModal;
