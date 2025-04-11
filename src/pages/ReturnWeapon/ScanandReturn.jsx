import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CaptureFinger, MatchFinger } from '../../mfs100';

function ScanandReturn() {
  const [weapons, setWeapons] = useState([]);
  const [selectedWeapons, setSelectedWeapons] = useState([]);
  const [inputBuffer, setInputBuffer] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [mainSelect, setMainSelect] = useState(null);
  const [fingerData, setFingerData] = useState('')
  const [image, setImage] = useState('');
  const [scanned, setScanned] = useState(false);
  const [allOfficers, setOfficers] = useState([]);

  const navigate = useNavigate();

  // Fetch available weapons
  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/weapons')
      .then((response) => {
        setWeapons(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weapons:', error);
      });
  }, []);

  // Fetch officer data
  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/officer')
      .then((response) => {
        setOfficers(response.data);
        const officer = response.data.find(
          (item) => item._id === '67657722f615b23d0f2bcae2'
        );
        if (officer) {
          setMainSelect(officer);
        }
      })
      .catch((error) => {
        console.error('Error fetching officers:', error);
      });
  }, []);

  // Handle scanning input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        const cleanedData = inputBuffer.trim();
        handleSelect(cleanedData);
        setInputBuffer('');
      } else {
        setInputBuffer((prev) => prev + event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputBuffer]);

  // Select a weapon by scanning
  const handleSelect = (weaponId) => {
    const weapon = weapons.find(
      (item) => item._id === weaponId && item.status.toLowerCase() === 'available'
    );

    if (weapon) {
      setSelectedWeapons((prevState) => {
        if (prevState.some((item) => item._id === weaponId)) {
          toast.error('Already added');
          return prevState;
        } else {
          toast.success('Added successfully');
          return [...prevState, weapon];
        }
      });
    } else {
      const weaponInList = weapons.find((item) => item._id === weaponId);
      if (weaponInList?.status.toLowerCase() !== 'available') {
        toast.error(`Selected ${weaponInList?.category} Already Issued`);
      } else {
        toast.error('Not Found, Scan Again');
      }
    }
  };

  // Remove a weapon
  const handleRemove = (weaponId) => {
    if (window.confirm('Do you want to remove?')) {
      setSelectedWeapons((prevState) =>
        prevState.filter((item) => item._id !== weaponId)
      );
      toast.success('Weapon removed successfully');
    }
  };

  // Clear all selected weapons
  const clearSelectedWeapons = () => {
    if (window.confirm('Do you want to clear all?')) {
      setSelectedWeapons([]);
      toast.success('Selected Weapons Cleared');
    }
  };

  // Assign officer data to selectedOfficer state
  const handleOfficerSelect = () => {
    if (mainSelect) {
      setSelectedOfficer(mainSelect);
      toast.success('Officer data retrieved successfully');
    } else {
      toast.error('No officer found');
    }
  };

  // Issue selected weapons to the selected officer
  const handleIssueWeapons = () => {
    if (!selectedOfficer) {
      alert('Please select an officer.');
      return;
    }

    if (selectedWeapons.length === 0) {
      alert('Please select at least one weapon to issue.');
      return;
    }

    axios
      .post('https://tool-backendf.onrender.com/api/transactions/issue', {
        officerId: selectedOfficer._id,
        weaponIds: selectedWeapons,
      })
      .then(() => {
        toast.success('Issued Successfully')
        navigate('/a');
      })
      .catch((error) => {
        toast.error('Error issuing weapons:')
        console.error('Error issuing weapons:', error);
      });
  };
  const refreshScanner = () =>{
    setScanned(false);
    setFingerData('');
    setImage('');
  }
  const scanFinger = () =>{
    const result = CaptureFinger();
    setImage(result.data.BitmapData);
    setScanned(true)
    setFingerData(result.data.AnsiTemplate)
  }


  const macther = async() =>{
    const data  =  MatchFinger(60, 2000, 'Rk1SACAyMAABfAA1AA0AAAE8AWIAxQDFAQAAACg6gGkA1aUAQFQA72IAgLEA6JYAQFEBB24AgJIAq6cAQFIBGnIAQGoAm2EAgGUBLnkAgHEBO3sAgMYBH4YAQHUAfa4AgLIBOIYAQMMBLSsAQOoAwUgAQI4AagAAQBUBJ6cAQOkAo5sAgHQATrIAQCsASQsAgDUAFQsAQGgA', 'Rk1SACAyMAABfAA1AA0AAAE8AWIAxQDFAQAAACg6gGkA1aUAQFQA72IAgLEA6JYAQFEBB24AgJIAq6cAQFIBGnIAQGoAm2EAgGUBLnkAgHEBO3sAgMYBH4YAQHUAfa4AgLIBOIYAQMMBLSsAQOoAwUgAQI4AagAAQBUBJ6cAQOkAo5sAgHQATrIAQCsASQsAgDUAFQsAQGgA')
    console.log(data);
    
  }
  macther();
  return (
    <section className="container-fluid p-3 p-md-5">
      <div className="issue d-flex justify-content-end p-3 mt-5">
        <button className="red-btn px-5" onClick={handleIssueWeapons}>
          Take
        </button>
      </div>
      <div className="row">
        {/* Selected Officer Section */}
        <div className="col-md-5">
          <div className="card rounded-0" style={{ minHeight: '80vh' }}>
            <div className="card-header">
              <h4 className="fs-5 mb-0">Selected Officer</h4>
            </div>
            <div className="card-body">
              {selectedOfficer ? (
                <div className="card rounded-0 p-3">
                  <h5>Officer Details</h5>
                  <p><strong>Name:</strong> {selectedOfficer.name}</p>
                  <p><strong>Rank:</strong> {selectedOfficer.rank}</p>
                  <p><strong>Metal No:</strong> {selectedOfficer.metalNo}</p>
                  <p><strong>Phone:</strong> {selectedOfficer.phone}</p>
                  <p><strong>Duty:</strong> {selectedOfficer.duty}</p>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>

        {/* Selected Weapons Section */}
        <div className="col-md-7">
          <div className="card rounded-0" style={{ minHeight: '80vh' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="fs-5 mb-0">Selected Weapons</h2>
              <button className="red-btn py-1 small px-3" onClick={clearSelectedWeapons}>
                Clear
              </button>
            </div>
            <div className="card-body">
              {selectedWeapons.length > 0 ? (
                <table className="w-100">
                  <thead>
                    <tr>
                      <th>SI.No</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Register No</th>
                      <th>COY</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWeapons.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.type}</td>
                        <td>{item.category}</td>
                        <td>{item.registerNumber}</td>
                        <td>{item.coy}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item._id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) :(
                <div className="card text-center rounded-0 p-3 d-flex flex-column align-items-center justify-content-center">
                <img
                  src="https://cdn.dribbble.com/users/1220941/screenshots/11463637/media/73d1a3758fd18a336cf36a3b1d5ffa1d.gif"
                  alt=""
                  className="w-50"
                />
                <h1 className="fs-4">
                  No Armoury/Ammunition/Munition Selected
                </h1>
                <p className="fs-6 text-secondary">
                  Scan Armoury/Ammunition/Munition to add
                </p>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScanandReturn;
