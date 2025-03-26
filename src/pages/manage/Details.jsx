import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, ListGroup, Alert } from 'react-bootstrap';
// import { weaponData } from '../data/weaponData';

const WeaponDetails = () => {
  const [newRemark, setNewRemark] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [weaponData, setWeaponData] = useState( {
    _id: "67654aae88fb50cccd6388f8",
    type: "RIFLE 7.62mm AK-47",
    category: "armoury",
    registerNumber: "NK446666",
    buttno: "01",
    status: "issued",
    fixedToOfficer: null,
    coy: "A",
    rackNumber: "R-123",
    lastAuditBy: "Sgt. Johnson",
    repairHistory: ["Minor repair - Spring replacement (01/15/2024)"],
    upcomingMaintenanceDate: "2024-03-15",
    isIssued: "false",
    history: [
      "6768cfdcc9748a647161d683",
      "6768fcc3d3a4e9576ea45197",
      "67690652d3a4e9576ea451cb"
    ],
    remarks: [
      {
        name: "Sgt. Williams",
        remarks: "Regular maintenance completed. All parts functioning properly.",
        date: "2024-01-20"
      },
      {
        name: "Lt. Anderson",
        remarks: "Scope alignment checked and adjusted during monthly inspection.",
        date: "2024-01-15"
      },
      {
        name: "Cpl. Martinez",
        remarks: "Minor wear observed on grip, scheduled for replacement next month.",
        date: "2024-01-10"
      },
      {
        name: "Maj. Thompson",
        remarks: "Performance test completed. Accuracy within acceptable range.",
        date: "2024-01-05"
      },
      {
        name: "Sgt. Davis",
        remarks: "Regular cleaning performed. No issues found.",
        date: "2024-01-01"
      }
    ]
  })

  const handleSubmitRemark = (e) => {
    e.preventDefault();
    if (newRemark.trim()) {
      // Add logic to submit remark
      setShowAlert(true);
      setNewRemark('');
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <Container fluid className="py-4 px-4 bg-light">
      {showAlert && (
        <Alert variant="success" className="mb-4" onClose={() => setShowAlert(false)} dismissible>
          Remark added successfully!
        </Alert>
      )}
      
      <Row>
        {/* Main Weapon Information */}
        <Col lg={8} className="mb-4">
          <Card className="shadow mb-4">
            <Card.Header className="main-bg text-white  d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fs-5">Weapon Details</h4>
              <Badge bg={weaponData.status === 'issued' ? 'danger' : 'success'} className="small">
                {weaponData.status.toUpperCase()}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Type:</strong> {weaponData.type}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Category:</strong> {weaponData.category}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Register Number:</strong> {weaponData.registerNumber}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Butt Number:</strong> {weaponData.buttno}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Company:</strong> {weaponData.coy}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Rack Number:</strong> {weaponData.rackNumber}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Last Audit By:</strong> {weaponData.lastAuditBy}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Next Maintenance:</strong>{' '}
                      {new Date(weaponData.upcomingMaintenanceDate).toLocaleDateString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Fixed To Officer:</strong>{' '}
                      {weaponData.fixedToOfficer || 'Not Assigned'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>ID:</strong> {weaponData._id}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Repair History Card */}
          <Card className="shadow">
            <Card.Header className="main-bg text-white">
              <h5 className="mb-0">Repair & Maintenance History</h5>
            </Card.Header>
            <Card.Body>
              {weaponData.repairHistory.length > 0 ? (
                <ListGroup variant="flush">
                  {weaponData.repairHistory.map((repair, index) => (
                    <ListGroup.Item key={index} className="d-flex align-items-center">
                      <i className="bi bi-tools me-2"></i>
                      {repair}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted mb-0">No repair history available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Remarks Section */}
        <Col lg={4}>
          <Card className="shadow">
            <Card.Header className="main-bg text-white">
              <h4 className="mb-0 fs-5">Remarks & Comments</h4>
            </Card.Header>
            <Card.Body>
              {/* Add New Remark Form */}
              <Form onSubmit={handleSubmitRemark} className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Label>Add New Remark</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your remark here..."
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                  />
                </Form.Group>
                <button type="submit" className="red-btn" disabled={!newRemark.trim()}>
                  Add Remark
                </button>
              </Form>

              {/* Remarks List */}
              <div className="remarks-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {weaponData.remarks.map((remark, index) => (
                  <Card key={index} className="mb-3 border-0 border-bottom">
                    <Card.Body className="py-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 main-text">
                          <i className="bi bi-person-circle me-2"></i>
                          {remark.name}
                        </h6>
                        <small className="text-dark">
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(remark.date).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-0 text-secondary">{remark.remarks}</p>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WeaponDetails;