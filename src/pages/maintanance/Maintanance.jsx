import React, { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import { MaintenanceForm } from './MaintenanceForm';
import { MaintenanceCharts } from './MaintenanceCharts';
import { MaintenanceTable } from './MaintenanceTable';

function Maintanance() {
    const [weapons, setWeapons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch weapons from backend
        axios.get('https://armoury-backend-ti9n.onrender.com/api/weapons')
        .then(response => setWeapons(response.data.filter(item => 
            item.status === 'issued' && 
            item.fixedToOfficer &&
            item.fixedToOfficer.rank !== '' && 
            item.fixedToOfficer.officername !== '' && 
            item.fixedToOfficer.metalno !== ''
        )))
        .catch(error => console.error('Error fetching weapons:', error));
        
    }, []);

    const handleCardClick = (weaponId) => {
        navigate(`/weapon/${weaponId}`);
    };

    return (
        <div className="container">
      {/* <h1 className="mb-4 fs-3 mb-3 pb-3 text-white border-bottom border-light">Maintenance Logs</h1> */}
      <div className="row mb-4">
        <div className="col-md-6">
          <MaintenanceForm />
        </div>
        <div className="col-md-6">
          <MaintenanceCharts />
        </div>
      </div>
      <MaintenanceTable />
    </div>
    );
}

export default Maintanance;
