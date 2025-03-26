import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import './style.css'
import Loading from '../../components/loading/Loading';

function EditOfficer({id}) {
    // const { id } = useParams(); // Get the officer ID from the URL
    const [officer, setOfficer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        rank: '',
        metalNo: '',
        duty: '',
        status: 'returned',
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch officer data by ID from backend
        axios.get(`https://tool-backendf.onrender.com/api/officer/${id}`)
            .then(response => {
                setOfficer(response.data);
                setIsLoading(false)
                setFormData({
                    name: response.data.name,
                    rank: response.data.rank,
                    metalNo: response.data.metalNo,
                    duty: response.data.duty,
                    status: response.data.status,
                });
            })
            .catch(error => {
                setIsLoading(false)
                console.error('Error fetching officer data:', error)
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        // Update officer data
        axios.put(`https://tool-backendf.onrender.com/api/officer/edit/${id}`, formData)
            .then(response => {
                setIsLoading(false);
                alert('Officer updated successfully!');
                navigate('/duty/officer');
            })
            .catch(error => {
                setIsLoading(false);
                console.error('Error updating officer:', error);
                alert('Failed to update officer');
            });
    };

    if (!officer) {
        return <Loading/>; // Loading state until officer data is fetched
    }

    if(isLoading){
        return <Loading/>
    }

    return (
        <section className="mt-5 container-fluid">
    <h3 className="text-white mb-4 border-bottom border-light pb-3">Add New Officer</h3>
         
         <div className="row">
            <div className="col-md-11 m-auto new-weapon p-4">
                   <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Officer Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter officer name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formRank">
                    <Form.Label>Rank</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter rank"
                        name="rank"
                        value={formData.rank}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formMetalNo">
                    <Form.Label>Metal No</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter metal number"
                        name="metalNo"
                        value={formData.metalNo}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDuty">
                    <Form.Label>Duty</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter duty"
                        name="duty"
                        value={formData.duty}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                        as="select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                    >
                        <option value="returned">Returned</option>
                        <option value="recieved">Received</option>
                    </Form.Control>
                </Form.Group>

                <button  type="submit" className="red-btn px-4 mt-3">
                    Update Officer
                </button>
            </Form>
            </div>
         </div>
        </section>
    );
}

export default EditOfficer;
