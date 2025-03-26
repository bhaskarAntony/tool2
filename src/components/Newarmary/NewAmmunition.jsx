import React, { useState } from 'react';
import axios from 'axios';

function NewAmmunition() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState([{ title: '', description: '' }]);

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { title: '', description: '' }]);
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications[index][field] = value;
    setSpecifications(updatedSpecifications);
  };

  const handleRemoveSpecification = (index) => {
    const updatedSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(updatedSpecifications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tool-backendf.onrender.com/api/items', {
        title,
        description,
        specifications,
      });
      console.log('Item added:', response.data);
      setTitle('');
      setDescription('');
      setSpecifications([{ title: '', description: '' }]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="row">
        <div className="col-md-6">
        <div className="mb-3">
        <label className="form-label">Ammunition Name</label>
        <input
          type="text"
          className="form-control"
          value={title}
          placeholder='Enter Ammunition name'
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
    
        </div>
        <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label">No of Ammunitions</label>
        <input
          type="text"
          className="form-control"
          value={title}
          placeholder='Bundle / Count'
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      </div>
      <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label">Date of upload</label>
        <input
          type="date"
          className="form-control"
          value={title}
          placeholder='Bundle / Count'
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      </div>

      <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label">No.Of Empty Cases - When Fired</label>
        <input
          type="date"
          className="form-control"
          value={title}
          placeholder='No.Of Empty Cases'
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      </div>

    

      <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label">No of Ammunition Fired</label>
        <input
          type="text"
          className="form-control"
          value={title}
          placeholder='Fired Count'
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      </div>

      <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label">Generated QR Code</label>
       <div className="qr" style={{backgroundColor:'#ccc', padding:'20px', textAlign:'center'}}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt=""  style={{width:'100px'}} />
       </div>
      </div>
      </div>
      </div>
      <div className="mb-3">
        <label className="form-label">About Ammunition</label>
        <textarea
          className="form-control"
          rows="3"
          value={description}
          placeholder='Write about Ammunition'
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="col-md-12">
                        <label htmlFor="">Remarks</label>
                        <textarea name="" className='form-control mb-3' id="" placeholder='Enter Remarks'></textarea>
                    </div>
                    <label htmlFor="">Upload Documents</label>
                    <input type="file" className='form-control' />
         <div className="mb-3 mt-4">
        <label className="form-label">Technical Specifications</label>
        {specifications.map((spec, index) => (
          <div key={index} className="row mb-2 align-items-center">
           <div className="col-md-5">
           <input
              type="text"
              className="form-control mb-2"
              placeholder="Specification Name"
              value={spec.title}
              onChange={(e) => handleSpecificationChange(index, 'title', e.target.value)}
              required
            />
           </div>
           
            <div className="col-md-6">
            <input
              className="form-control mb-2"
              rows="2"
              placeholder="Specification Description"
              value={spec.description}
              onChange={(e) => handleSpecificationChange(index, 'description', e.target.value)}
              required
            ></input>
            </div>
            
            <div className="col-1">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => handleRemoveSpecification(index)}
            >
              <i class="bi bi-x-lg"></i> 
            </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline-secondary rounded-1" onClick={handleAddSpecification}>
        <i class="bi bi-plus-lg"></i> Add More
        </button>
      </div>
      <button type="submit" className="red-btn px-5">
      <i class="bi bi-check-circle"></i> Create
      </button>
    </form>
  );
}

export default NewAmmunition;
