import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import { Dropdown, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CaptureFinger, MatchFinger } from '../../mfs100';

function ScanAndReturn() {
  const [weapons, setWeapons] = useState([]);
  const [ammunitions, setAmmunitions] = useState([]);
  const [munitions] = useState([
    { id: 'm1', type: 'Grenade', category: 'Explosive', quantity: 50 },
    { id: 'm2', type: 'Flashbang', category: 'Non-lethal', quantity: 30 },
  ]);
  const [selectedWeapons, setSelectedWeapons] = useState([]);
  const [selectedAmmunitions, setSelectedAmmunitions] = useState([]);
  const [selectedMunitions, setSelectedMunitions] = useState([]);
  const [inputBuffer, setInputBuffer] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [fingerData, setFingerData] = useState('');
  const [image, setImage] = useState('');
  const [scanned, setScanned] = useState(false);
  const [allOfficers, setOfficers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [officerTransactions, setOfficerTransactions] = useState([]);
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
        toast.error('Failed to fetch weapons');
      });
  }, []);

  // Fetch available ammunitions
  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/items')
      .then((response) => {
        setAmmunitions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching ammunitions:', error);
        toast.error('Failed to fetch ammunitions');
      });
  }, []);

  // Fetch officer data
  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/officer')
      .then((response) => {
        setOfficers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching officers:', error);
        toast.error('Failed to fetch officers');
      });
  }, []);

  // Fetch all transactions
  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/transactions/list')
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to fetch transactions');
      });
  }, []);

  // Handle barcode scanning input for weapons
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        const cleanedData = inputBuffer.trim();
        handleSelectWeapon(cleanedData);
        setInputBuffer('');
      } else if (event.key.length === 1) {
        setInputBuffer((prev) => prev + event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputBuffer, selectedOfficer, officerTransactions]);

  // Scan fingerprint
  const scanFinger = () => {
    try {
      const result = CaptureFinger(80, 5000);
      if (result.data.ErrorCode === '0') {
        setImage(result.data.BitmapData);
        setScanned(true);
        setFingerData(result.data.AnsiTemplate);
        matchOfficer(result.data.AnsiTemplate);
      } else {
        toast.error(`Fingerprint capture failed: ${result.data.ErrorDescription || 'Unknown error'}`);
        setScanned(false);
      }
    } catch (error) {
      console.error('Error capturing fingerprint:', error);
      toast.error('Error capturing fingerprint');
      setScanned(false);
    }
  };

  // Match fingerprint with officer database
  const matchOfficer = async (capturedFingerprint) => {
    if (!capturedFingerprint) {
      toast.error('No fingerprint data captured');
      return;
    }

    for (const officer of allOfficers) {
      if (!officer.fingerPrintData) {
        console.warn(`Officer ${officer.name} has no fingerprint data`);
        continue;
      }

      try {
         const result = MatchFinger(80, 5000, capturedFingerprint, officer.fingerPrintData, "ANSI");
                if (
                  result.httpStaus && // spelling fix here too from httpStatus to httpStaus
                  result.data.ErrorCode === '0' &&
                  result.data.Status === true
                ) {
                  setSelectedOfficer(officer);
                  toast.success(`Officer ${officer.name} authenticated successfully`);
                
                  // Find transactions for this officer
                  const officerTrans = transactions.filter(
                    (trans) => trans.officer._id === officer._id
                  );
                  setOfficerTransactions(officerTrans);
                  toast.success(`Officer ${officer.name} authenticated successfully`);
                  return;
        }
      } catch (error) {
        console.error(`Error matching fingerprint for officer ${officer.name}:`, error);
      }
    }

    toast.error('No matching officer found');
    setScanned(false);
    setFingerData('');
    setImage('');
  };

  // Refresh scanner
  const refreshScanner = () => {
    setScanned(false);
    setFingerData('');
    setImage('');
    setSelectedOfficer(null);
    setOfficerTransactions([]);
  };

  // Select a weapon by scanning
  const handleSelectWeapon = (weaponId) => {
    if (!selectedOfficer) {
      toast.error('Please authenticate an officer first');
      return;
    }

    // Check if weapon is in officer's transactions
    let weaponFound = false;
    for (const trans of officerTransactions) {
      if (trans.weaponsIds.includes(weaponId)) {
        const weapon = weapons.find((item) => item._id === weaponId);
        if (weapon) {
          setSelectedWeapons((prevState) => {
            if (prevState.some((item) => item._id === weaponId)) {
              toast.error('Weapon already added for return');
              return prevState;
            } else {
              toast.success('Weapon added for return');
              return [...prevState, weapon];
            }
          });
          weaponFound = true;
        }
        break;
      }
    }

    if (!weaponFound) {
      toast.error('Weapon not found in officer’s issued items');
    }
  };

  // Manually select ammunition
  const handleSelectAmmunition = (ammoId) => {
    const ammo = ammunitions.find((item) => item._id === ammoId);
    if (ammo) {
      setSelectedAmmunitions((prevState) => {
        if (prevState.some((item) => item._id === ammoId)) {
          toast.error('Ammunition already added');
          return prevState;
        } else {
          toast.success('Ammunition added for return');
          return [...prevState, ammo];
        }
      });
    }
  };

  // Manually select munition
  const handleSelectMunition = (munId) => {
    const mun = munitions.find((item) => item.id === munId);
    if (mun) {
      setSelectedMunitions((prevState) => {
        if (prevState.some((item) => item.id === munId)) {
          toast.error('Munition already added');
          return prevState;
        } else {
          toast.success('Munition added for return');
          return [...prevState, mun];
        }
      });
    }
  };

  // Remove a weapon
  const handleRemoveWeapon = (weaponId) => {
    if (window.confirm('Do you want to remove this weapon from return list?')) {
      setSelectedWeapons((prevState) =>
        prevState.filter((item) => item._id !== weaponId)
      );
      toast.success('Weapon removed from return list');
    }
  };

  // Remove an ammunition
  const handleRemoveAmmunition = (ammoId) => {
    if (window.confirm('Do you want to remove this ammunition from return list?')) {
      setSelectedAmmunitions((prevState) =>
        prevState.filter((item) => item._id !== ammoId)
      );
      toast.success('Ammunition removed from return list');
    }
  };

  // Remove a munition
  const handleRemoveMunition = (munId) => {
    if (window.confirm('Do you want to remove this munition from return list?')) {
      setSelectedMunitions((prevState) =>
        prevState.filter((item) => item.id !== munId)
      );
      toast.success('Munition removed from return list');
    }
  };

  // Clear all selected items
  const clearSelectedItems = () => {
    if (window.confirm('Do you want to clear all selected items?')) {
      setSelectedWeapons([]);
      setSelectedAmmunitions([]);
      setSelectedMunitions([]);
      toast.success('All selected items cleared');
    }
  };

  // Return selected items
  const handleReturnItems = () => {
    if (!selectedOfficer) {
      toast.error('Please authenticate an officer.');
      return;
    }

    if (selectedWeapons.length === 0 && selectedAmmunitions.length === 0 && selectedMunitions.length === 0) {
      toast.error('Please select at least one item to return.');
      return;
    }

    const payload = {
      officerId: selectedOfficer._id,
      transactionIds: officerTransactions.map((t) => t._id),
      weaponIds: selectedWeapons.map((w) => w._id),
      ammunitionIds: selectedAmmunitions.map((a) => a._id),
      munitionIds: selectedMunitions.map((m) => m.id),
    };

    axios
      .post('https://tool-backendf.onrender.com/api/transactions/return', payload)
      .then(() => {
        toast.success('Items returned successfully');
        navigate('/a');
      })
      .catch((error) => {
        toast.error('Error returning items');
        console.error('Error returning items:', error);
      });
  };

  // Get received items from transactions
  const getReceivedItems = () => {
    const receivedWeapons = [];
    officerTransactions.forEach((trans) => {
      trans.weapons.forEach((weapon) => {
        if (!receivedWeapons.some((w) => w._id === weapon._id)) {
          receivedWeapons.push(weapon);
        }
      });
    });
    return receivedWeapons;
  };

  return (
    <section className="container-fluid p-3 p-md-5">
      <div className="issue d-flex justify-content-end p-3 mt-5">
        <Button className="red-btn px-5" onClick={handleReturnItems}>
          Return
        </Button>
      </div>
      <div className="row">
        {/* Officer Authentication Section */}
        <div className="col-md-5">
          <div className="card rounded-0" style={{ minHeight: '80vh' }}>
            <div className="card-header">
              <h4 className="fs-5 mb-0">Officer Authentication</h4>
            </div>
            <div className="card-body">
              {selectedOfficer ? (
                <div className="card rounded-0 p-3">
                  <h5>Officer Details</h5>
                  <p><strong>Name:</strong> {selectedOfficer.name}</p>
                  <p><strong>Rank:</strong> {selectedOfficer.rank}</p>
                  <p><strong>Metal No:</strong> {selectedOfficer.metalNo}</p>
                  <p><strong>Phone:</strong> {selectedOfficer.phonenumber}</p>
                  <p><strong>Duty:</strong> {selectedOfficer.duty}</p>
                  <h6>Received Items</h6>
                  {getReceivedItems().length > 0 ? (
                    <ul>
                      {getReceivedItems().map((item) => (
                        <li key={item._id}>
                          {item.type} - {item.category} ({item.registerNumber})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items received</p>
                  )}
                  <Button variant="secondary" onClick={refreshScanner}>
                    Reset Authentication
                  </Button>
                </div>
              ) : (
                <div className="card">
                  <div className="card-header d-flex justify-content-between">
                    <p className="fs-5 mb-0">Fingerprint Scanner</p>
                    {scanned && (
                      <div className="icon border" onClick={refreshScanner}>
                        <i className="bi bi-arrow-clockwise"></i>
                      </div>
                    )}
                  </div>
                  <div className={`card-body p-3 text-center ${scanned ? 'scanned' : 'not-scanned'}`}>
                    <p className="scanner-status">{scanned ? 'Finger Scanned' : 'Not Scanned'}</p>
                    <img
                      src={
                        image
                          ? `data:image/png;base64,${image}`
                          : 'https://i.pinimg.com/originals/db/ac/5e/dbac5e5082fd1e8f896a47c0d3b84cf5.gif'
                      }
                      alt=""
                      className={image ? 'w-50 d-block m-auto mb-4 mt-4' : 'w-100'}
                    />
                    <button
                      className={`tick-indicator text-white btn rounded-0 ${scanned ? 'bg-success' : 'bg-danger'}`}
                      disabled
                    >
                      {scanned ? <i className="bi bi-check2"></i> : <i className="bi bi-x-lg"></i>}
                    </button>
                  </div>
                  <div className="card-footer p-0">
                    {!scanned && (
                      <Button className="red-btn w-100 rounded-0 p-3" onClick={scanFinger}>
                        Scan Fingerprint
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Items Section */}
        <div className="col-md-7">
          <div className="card rounded-0" style={{ minHeight: '80vh' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="fs-5 mb-0">Items to Return</h2>
              <Button className="red-btn py-1 small px-3" onClick={clearSelectedItems}>
                Clear All
              </Button>
            </div>
            <div className="card-body">
              {/* Manual Selection for Ammunition */}
              {/* <div className="mb-4">
                <h5>Select Ammunition</h5>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-ammunition">
                    Select Ammunition
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {ammunitions.map((ammo) => (
                      <Dropdown.Item
                        key={ammo._id}
                        onClick={() => handleSelectAmmunition(ammo._id)}
                      >
                        {ammo.category} - {ammo.type}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div> */}

              {/* Manual Selection for Munition */}
              {/* <div className="mb-4">
                <h5>Select Munition</h5>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-munition">
                    Select Munition
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {munitions.map((mun) => (
                      <Dropdown.Item
                        key={mun.id}
                        onClick={() => handleSelectMunition(mun.id)}
                      >
                        {mun.type} - {mun.category}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div> */}

              {/* Selected Items Table */}
              {(selectedWeapons.length > 0 || selectedAmmunitions.length > 0 || selectedMunitions.length > 0) ? (
                <table className="w-100 table table-bordered">
                  <thead>
                    <tr>
                      <th>SI.No</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Details</th>
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
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveWeapon(item._id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {selectedAmmunitions.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1 + selectedWeapons.length}</td>
                        <td>{item.type}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity || 'N/A'}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveAmmunition(item._id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {selectedMunitions.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1 + selectedWeapons.length + selectedAmmunitions.length}</td>
                        <td>{item.type}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveMunition(item.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="card text-center rounded-0 p-3 d-flex flex-column align-items-center justify-content-center">
                  <img
                    src="https://cdn.dribbble.com/users/1220941/screenshots/11463637/media/73d1a3758fd18a336cf36a3b1d5ffa1d.gif"
                    alt=""
                    className="w-50"
                  />
                  <h1 className="fs-4">
                    No Armoury/Ammunition/Munition Selected for Return
                  </h1>
                  <p className="fs-6 text-secondary">
                    Scan Armoury or Select Ammunition/Munition to return
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

export default ScanAndReturn;