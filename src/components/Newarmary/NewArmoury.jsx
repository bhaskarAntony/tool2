import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './style.css'

function NewArmoury({title, C_type}) {
    const [isIssued, setisIssued] = useState(false)
    const [isFixed, setIsFixed] = useState(false)
    const [weaponData, setWeaponData] = useState({
        type: '',
        registerNumber: '',
        buttno: '',
        status: 'Available',
        fixedToOfficer: { rank: '', metalno: '', officername: '' },
        coy: 'A',
        rackNumber: '',
        lastAuditBy: '',
        repairHistory: [''],
        upcomingMaintenanceDate: '',
        category:C_type,
        isIssued:isIssued,
    });
    useEffect(()=>{
        console.log(weaponData.isIssued);
        
        if(weaponData.isIssued == true){
            setIsFixed(true)
        }else{
            setIsFixed(false)
        }
    }, [weaponData.isIssued])
    useEffect(() => {
        setWeaponData((prevWeaponData) => {
            if (prevWeaponData.isIssued !== isIssued) {
                return { ...prevWeaponData, isIssued };
            }
            return prevWeaponData; // Avoid unnecessary state updates
        });
    }, [isIssued]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('fixedToOfficer')) {
            const officerField = name.split('.')[1];
            setWeaponData((prev) => ({
                ...prev,
                fixedToOfficer: {
                    ...prev.fixedToOfficer,
                    [officerField]: value
                }
            }));
        } else {
            setWeaponData({ ...weaponData, [name]: value });
        }
    };

    const handleRepairHistoryChange = (index, value) => {
        const newRepairHistory = [...weaponData.repairHistory];
        newRepairHistory[index] = value;
        setWeaponData({ ...weaponData, repairHistory: newRepairHistory });
    };

    const handleAddRepairHistory = () => {
        setWeaponData({ ...weaponData, repairHistory: [...weaponData.repairHistory, ''] });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); //https://armoury-backend-ti9n.onrender.com
        axios.post('https://tool-backendf.onrender.com/api/weapons', weaponData)
            .then(response => {
                alert('Weapon added successfully!');
            })
            .catch(error => {
                console.error('Error adding weapon:', error);
                alert('Failed to add weapon');
            });
    };

    return (
        <section className="container-fluid ">
           
         <div className="row">
            <div className="col-md-11 m-auto new-weapon p-3">
            <h3 className="mb-4 border-bottom border-secondary pb-3" style={{textTransform:'capitalize'}}>Add New {C_type}</h3>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formType">
                            <Form.Label>Armoury Type</Form.Label>
                            {/* <Form.Control
                                type="text"
                                placeholder="Enter weapon type"
                                name="type"
                                value={weaponData.type}
                                onChange={handleInputChange}
                                required
                            /> */}
                            <select className='form-control' onChange={handleInputChange} value={weaponData.type} name="type" id="">
                            <option value="7.62mm SLR 1A1">7.62mm SLR 1A1</option>
                            <option value="RIFLE  7.62mm AK-47">RIFLE  7.62mm AK-47</option>
                            <option value="RIFLE  5.56mm INSAS">RIFLE  5.56mm INSAS</option>
                            <option value="RIFLE  5.56mm EX-CALIBUR">RIFLE  5.56mm EX-CALIBUR</option>
                            <option value="GM 7.62mm LMG 1B">GM 7.62mm LMG 1B</option>
                            <option value="RIFLE 7.62mm TAR">RIFLE 7.62mm TAR</option>
                            <option value="5.56mm  JVPC">5.56mm  JVPC</option>
                            <option value="9mm CMG">9mm CMG</option>
                            <option value="9mm BROWNING PISTOL">9mm BROWNING PISTOL</option>
                            <option value="9mm AUTO PISTOL 1A">9mm AUTO PISTOL 1A</option>
                            <option value="ANTI RIOT GUN .303">ANTI RIOT GUN .303</option>
                            <option value="ANTI RIOT GUN 50G">ANTI RIOT GUN 50G</option>
                            <option value="ANTI RIOT GUN 80G">ANTI RIOT GUN 80G</option>
                            <option value="PROJECTOR PYRO TECHNIC  13MM   HAND ">PROJECTOR PYRO TECHNIC  13MM   HAND </option>
                            <option value="TEAR GAS GUN ">TEAR GAS GUN </option>
                            <option value="COLT  M-4 RIFLE">COLT  M-4 RIFLE</option>
                            <option value="GM 5.56MM LMG 1A1">GM 5.56MM LMG 1A1</option>
                            <option value="51MM  MORTAR">51MM  MORTAR</option>
                            <option value="MBL (Agnivarsha)">MBL (Agnivarsha)</option>
                            <option value=".303’’ NO 4 MK-1 RIFLE">.303’’ NO 4 MK-1 RIFLE</option>
                            </select>
                        </Form.Group>
                    </Col>
                    {/* <Col md={6}>
                        <Form.Group controlId="formType">
                            <Form.Label>Weapon Type</Form.Label>
                            <select name="category" className='form-select' id="" onChange={handleInputChange}>
                                <option selected disabled>Select Category</option>
                                <option value="armoury">Armoury</option>
                                <option value="Ammunition">Ammunition</option>
                                <option value="munition">Munition</option>
                            </select>
                        </Form.Group>
                    </Col> */}
                    <Col md={6}>
                        <Form.Group controlId="formRegisterNumber">
                            <Form.Label>Register Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter register number"
                                name="registerNumber"
                                value={weaponData.registerNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formButtno">
                            <Form.Label>Butt Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter butt number"
                                name="buttno"
                                value={weaponData.buttno}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={weaponData.status}
                                onChange={handleInputChange}
                            >
                                <option value="Available">Available</option>
                                <option value="Under Maintenance">Under Maintenance</option>
                                <option value="Missing">Missing</option>
                                <option value="Expired">Expired</option>
                                <option value="issued">Issued</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="formCoy">
                            <Form.Label>Company</Form.Label>
                            {/* <Form.Control
                                type="text"
                                placeholder="Enter company name"
                                name="coy"
                                value={weaponData.coy}
                                onChange={handleInputChange}
                            /> */}
                            <select name="coy" value={weaponData.coy} onChange={handleInputChange} id="" className="form-control">

                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                                <option value="F">F</option>
                                <option value="G">G</option>
                                <option value="H">H</option>
                            </select>
                        </Form.Group>
                    </Col>
                   
                    <Col md={2}>
                        <Form.Group controlId="formImage">
                            <Form.Label>Allocated?</Form.Label>
                            <Form.Select 
                                className="form-select" 
                                value={isIssued} 
                                onChange={(e) => setisIssued(e.target.value === "true")}
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formRackNumber">
                            <Form.Label>Rack Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter rack number"
                                name="rackNumber"
                                value={weaponData.rackNumber}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                  
                    <Col md={6}>
                        <Form.Group controlId="formLastAuditBy">
                            <Form.Label>Last Audit By</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last audit by"
                                name="lastAuditBy"
                                value={weaponData.lastAuditBy}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formUpcomingMaintenanceDate">
                            <Form.Label>Upcoming Maintenance Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="upcomingMaintenanceDate"
                                value={weaponData.upcomingMaintenanceDate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>

                    {
                        isFixed?(
                            <>
                            <h1 className="fs-4 mt-4">Officer/Men Details</h1>
                            <hr />
                              <Col md={4}>
                        <Form.Group controlId="formRank">
                            <Form.Label>Officer/Men Rank</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter officer rank"
                                name="fixedToOfficer.rank"
                                value={weaponData.fixedToOfficer.rank}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formMetalno">
                            <Form.Label>Officer/Men KGID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter officer metal number"
                                name="fixedToOfficer.metalno"
                                value={weaponData.fixedToOfficer.metalno}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="formOfficerName">
                            <Form.Label>Officer/Men Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter officer name"
                                name="fixedToOfficer.officername"
                                value={weaponData.fixedToOfficer.officername}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <div className="col-md-6">
                    <label htmlFor="" className="form-lable">Select Officer/Men Rank</label>
                        <select name="" className='form-control' id="">
                                        
                                        <option value="">Select Officers/Men Rank</option>
                                        <option value="type1">PC</option>
                                        <option value="type2">HC</option>
                                        <option value="">ARSI/ASI</option>
                                        <option value="">RSI/PSI</option>
                                        <option value="">RPI/PI</option>
                                        <option value="">AC/DySP</option>
                                        <option value="">DC/Addl.SP</option>
                                        <option value="">Commandant/SP</option>
                        </select>
                    </div>
                            </>
                        ):(null)
                    }
                    <div className="col-md-12">
                        <label htmlFor="">Remarks</label>
                        <textarea name="" className='form-control' id="" placeholder='Enter Remarks'></textarea>
                    </div>
                    <label htmlFor="">Upload Documents</label>
                    <input type="file" className='form-control' />

                   
                </Row>


                <button  type="submit" className="mt-3 red-btn px-5">Submit</button>
            </Form>
            </div>
         </div>
        </section>
    );
}

export default NewArmoury;
