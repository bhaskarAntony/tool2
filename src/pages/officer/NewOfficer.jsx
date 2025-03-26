import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CaptureFinger } from '../../mfs100';

function NewOfficer() {
    const [fingerData, setFingerData] = useState('')
    const [image, setImage] = useState('');
    const [scanned, setScanned] = useState(false);
    const [officerData, setOfficerData] = useState({
        name: '',
        rank: '',
        status: 'returned',
        metalNo: '',
        duty: '',
        phonenumber: '',
        received: '',
        returned: '',
        registerNo: '',
        kgidNo: '',
        role: '',
        remarks: '',
        auditDate: '',
        maintenanceDate: '',
        lastAuditedDate: '',
        fingerPrintData:""
    });
    const  scanFinger = () =>{
        const result = CaptureFinger();
        console.log(result);
        setImage(result.data.BitmapData);
        setScanned(true)
        setFingerData(result.data.AnsiTemplate)
        
    }

    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOfficerData({ ...officerData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();//https://tool-backendf.onrender.com
        axios.post('http://localhost:4000/api/officer', officerData)
            .then(response => {
                toast.success('Officer added successfully!');
                setOfficerData({
                    name: '',
                    rank: '',
                    status: 'returned',
                    metalNo: '',
                    duty: '',
                    phonenumber: '',
                    received: '',
                    returned: '',
                    registerNo: '',
                    kgidNo: '',
                    remarks: '',
                    auditDate: '',
                    maintenanceDate: '',
                    lastAuditedDate: '',
                    fingerPrintData:""
                }); // Reset form
                navigate('/')
            })
            .catch(error => {
                console.error('Error adding officer:', error);
                toast.error('Failed to add officer');
            });
    };
    const refreshScanner = ()=>{
        setScanned(false);
        setFingerData('');
        setImage('');
    }
    useEffect(() => {
        setOfficerData(prevState => ({
            ...prevState,
          ...{  fingerPrintData: fingerData}
        }));
    }, [fingerData]); // Ensure dependencies are correct

    return (
        <Container className="mt-5">
            <h3 className="fs-3">Add New Officer</h3>
            <hr />
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                <p className="fs-5 mb-0">Officer Authentication</p>
                {
               
                scanned?( <div className="icon border" onClick={refreshScanner}><i class="bi bi-arrow-clockwise"></i></div>):(null)
                }
                </div>
                <div className={`card-body p-3 text-center ${scanned?'scanned':'not-scanned'}`}>
                    <p className="scanner-status">{scanned?'Finger Scanned':'Not scanned'}</p>
                    <img src={image?(`data:image/png;base64,${image}`):('https://i.pinimg.com/originals/db/ac/5e/dbac5e5082fd1e8f896a47c0d3b84cf5.gif')} alt="" className={image?'w-50 d-block m-auto mb-4 mt-4':'w-100'} />
                   
                    <button className={`tick-indicator text-white btn rounded-0 ${scanned?'bg-success':'bg-danger'}`}>{scanned?(<i class="bi bi-check2"></i>):(<i class="bi bi-x-lg"></i>)}</button>
                </div>
                <div className="card-footer p-0 ">
               {
                !scanned&&( <button className="red-btn w-100 rounded-0 p-3" onClick={scanFinger}>Scan</button>)
               }
                </div>
              </div>
            </div>
            <div className="col-md-8">
            <div className="row">
                <div className="col-md-11 new-weapon m-auto">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={12}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Officer/Men Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter officer/men name"
                                        name="name"
                                        value={officerData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formMetalNo">
                                    <Form.Label>Metal Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter metal number"
                                        name="metalNo"
                                        value={officerData.metalNo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {/* <Col md={6}>
                                <Form.Group controlId="formRank">
                                    <Form.Label>Rank</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter rank"
                                        name="rank"
                                        value={officerData.rank}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col> */}
                            <Col md={6}>
                                <Form.Group controlId="formPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number"
                                        name="phonenumber"
                                        value={officerData.phonenumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formRegisterNo">
                                    <Form.Label>Register Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter register number"
                                        name="registerNo"
                                        value={officerData.registerNo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formKGIDNo">
                                    <Form.Label>KGID Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter KGID number"
                                        name="kgidNo"
                                        value={officerData.kgidNo}
                                        onChange={handleInputChange}
                                    />

                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formRole">
                                    <Form.Label>Rank</Form.Label>
                                    <select
                                        name="rank"
                                        value={officerData.rank}
                                        className='form-control'
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Officers/Men Rank</option>
                                        <option value="PC">PC</option>
                                        <option value="HC">HC</option>
                                        <option value="ARSI/ASI">ARSI/ASI</option>
                                        <option value="RSI/PSI">RSI/PSI</option>
                                        <option value="RPI/PI">RPI/PI</option>
                                        <option value="AC/DySP">AC/DySP</option>
                                        <option value="DC/Addl.SP">DC/Addl.SP</option>
                                        <option value="Commandant/SP">Commandant/SP</option>
                                    </select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formDuty">
                                    <Form.Label>Duty</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter duty"
                                        name="duty"
                                        value={officerData.duty}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            {/* <Col md={6}>
                                <Form.Group controlId="formStatus">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="status"
                                        value={officerData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="returned">Returned</option>
                                        <option value="received">Received</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col> */}
                            <Col md={12}>
                                <Form.Group controlId="formRemarks">
                                    <Form.Label>Remarks</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter remarks"
                                        name="remarks"
                                        value={officerData.remarks}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formAuditDate">
                                    <Form.Label>Audit/Maintenance Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="auditDate"
                                        value={officerData.auditDate}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formLastAuditedDate">
                                    <Form.Label>Last Audited Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="lastAuditedDate"
                                        value={officerData.lastAuditedDate}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <button type="submit" className="mt-3 red-btn px-5 border-0">Submit</button>
                    </Form>
                </div>
            </div>
            </div>
          </div>
        </Container>
    );
}

export default NewOfficer;
