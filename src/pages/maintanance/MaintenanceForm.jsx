import React, { useState } from "react";
import axios from "axios";
import Loading from "../../components/loading/Loading";

export const MaintenanceForm = () => {
  const [formData, setFormData] = useState({
    weaponId: "",
    maintenanceDate: "",
    status: "Pending",
    assignedOfficer: "",
    // cost: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://tool-backendf.onrender.com/api/maintenance", formData);
      alert('log created successfully');
      setFormData({
        registerNo: "",
        maintenanceDate: "",
        status: "Pending",
        assignedOfficer: "",
        cost: "",
      });
      setLoading(false)
    } catch (error) {
      setLoading(false);
      console.error("Error adding log:", error);
    }
  };
  if(loading){
    return <Loading/>
  }

  return (
    <form onSubmit={handleSubmit} className="dashboard-card p-4">
        <h1 className="fs-4">Create new Maintenance log</h1>
        <hr />
     
    
     <div className="row">
        <div className="col-md-6">
        <div className="mb-3">
        <label className="form-label">Weapon Register No</label>
        <input
          type="text"
          className="form-control"
          name="registerNo"
          value={formData.registerNo}
          onChange={handleChange}
          required
        />
      </div>
        </div>
        <div className="col-md-6">
        <div className="mb-3">
        <label className="form-label">Maintenance Date</label>
        <input
          type="date"
          className="form-control"
          name="maintenanceDate"
          value={formData.maintenanceDate}
          onChange={handleChange}
          required
        />
      </div>
        </div>
        <div className="col-md-6">
        <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-control"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
        </div>
        <div className="col-md-6">
     <div className="mb-3">
        <label className="form-label">Assigned Officer</label>
        <input
          type="text"
          className="form-control"
          name="assignedOfficer"
          value={formData.assignedOfficer}
          onChange={handleChange}
        />
      </div>
     </div>
     </div>
   
      <div className="mb-3">
        <label className="form-label">logs(Optional)</label>
        <textarea  
          className="form-control"
          name="log"
          value={formData.log}
          onChange={handleChange} cols="30" rows="4"></textarea>
      </div>
    <div className="d-flex gap-2 flex-wrap"> 
         <button type="submit" className="red-btn px-3">
        Add Maintenance Log
      </button>
      <button type="reset" className="btn-outline-secondary btn px-3">
       Cancel
      </button></div>
    </form>
  );
};
