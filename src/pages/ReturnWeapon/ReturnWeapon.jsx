import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';

function ReturnWeapon() {
    const { transactionId } = useParams(); // Transaction ID from URL
    const [transaction, setTransaction] = useState(null); // Transaction details
    const [selectedWeapons, setSelectedWeapons] = useState([]); // Weapons to return
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
        const [purpose, setPurpose] = useState('');
        const [weaponUsed, setWeaponUsed] = useState('false'); // New state for dropdown

    // Fetch transaction details on mount
    useEffect(() => {
        axios.get(`https://tool-backendf.onrender.com/api/transactions/single/${String(transactionId)}`)
            .then(response => setTransaction(response.data))
            .catch(error => console.error('Error fetching transaction:', error));
    }, [transactionId]);

    // Handle checkbox selection
    const handleCheckboxChange = (weaponId) => {
        setSelectedWeapons(prev =>
            prev.includes(weaponId)
                ? prev.filter(id => id !== weaponId) // Remove if already selected
                : [...prev, weaponId] // Add if not selected
        );
    };
    const handleTakeWeapon = () => {
        // if (weapon.status !== 'issued') {
        //     alert('Weapon is not issued to anyone.');
        //     return;
        // }

        setShowModal(true); // Show the confirmation modal
    };

    // Handle form submission to return selected weapons
    const handleReturnWeapons = () => {
        if (selectedWeapons.length === 0) {
            alert('Please select at least one weapon to return.');
            return;
        }

        if (weaponUsed === 'true' && !purpose) {
            alert('Please provide a purpose.');
            return;
        }

        axios.post('https://tool-backendf.onrender.com/api/transactions/return', {
            transactionId,
            weaponsIds: selectedWeapons,
        })
            .then(response => {
                alert('Weapons returned successfully!');
                setSelectedWeapons([]); // Reset selected weapons
                navigate('/return');
            })
            .catch(error => {
                console.error('Error returning weapons:', error);
                alert('Failed to return weapons.');
            });
    };

    return (
        <div className="container mt-4">
               <p><strong>Issue Date:</strong> {new Date(transaction?.transactiondata.issueDate).toLocaleDateString()}</p> <hr />
            <h3 className="mb-4 fs-4">Officer Details</h3>
            {transaction ? (
                <>
                    <table width="100%" className="table">
            <thead>
              <tr className="main-btn">
                <th className="d-flex gap-2 align-items-center">
                  
                  Name
                </th>
                <th>Rank</th>
                <th>Reg. no</th>
                <th>Metal No</th>
                <th>Phone number</th>
                <th>Recieved</th>
                <th>staaus</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
                  <tr key={transaction?.transactiondata.officer.id}>
                    <td className='d-flex gap-2 align-ietms-center'>
                      
                      {transaction?.transactiondata.officer.name}
                    </td>
                    <td>{transaction?.transactiondata.officer.rank.toUpperCase()}</td>
                    <td>{transaction?.transactiondata.officer.registerNo}</td>
                    <td>{transaction?.transactiondata.officer.metalNo}</td>
                    <td>{transaction?.transactiondata.officer.phonenumber}</td>
                    <td>{transaction?.transactiondata.officer.recieved?.length}</td>
                    <td>{transaction?.transactiondata.officer.status}</td>
                    
                  </tr>
              
            </tbody>
          </table>
                 
                    <hr />
                    <p className='fs-4'><strong>Weapons Issued:</strong></p>
                    <hr />
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Weapon Type</th>
                                <th>Register Number</th>
                                <th>Status</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.weaponDetails.map((item) => (
                                   <tr key={item._id}>
                                    <td>{item.type}</td>
                                    <td>{item.registerNumber}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(item._id)}
                                            checked={selectedWeapons.includes(item._id)} // Pre-check if already selected
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        className="red-btn mt-3"
                        onClick={handleTakeWeapon}
                    >
                        Return Selected Weapons
                    </button>
                </>
            ) : (
                <p>Loading transaction details...</p>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Return Weapon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group controlId="formUsed">
                        <Form.Label>Weapon Used?</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={weaponUsed} 
                            onChange={(e) => setWeaponUsed(e.target.value)}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group controlId="formPurpose">
                        <Form.Label>Purpose</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Enter the purpose for returning the weapon" 
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                        />
                    </Form.Group>

                   
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='rounded-pill' onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <button className='red-btn' onClick={handleReturnWeapons}>
                        Return Weapon
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ReturnWeapon;
