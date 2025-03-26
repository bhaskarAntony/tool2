import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/loading/Loading';
import { Dropdown, Offcanvas } from 'react-bootstrap';
import NewArmoury from '../../components/Newarmary/NewArmoury';
import Edit from '../manage/Edit';
import Details from '../manage/Details';
import MainIssue from '../mainIssuepage/MainIssue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ReturnAll() {
  const [weapons, setWeapons] = useState([]);
  const [filteredWeapons, setFilteredWeapons] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [AddType, setAddType] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: '',
    createdOn: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/transactions/list')
      .then((response) => {
        setIsLoading(false);
        const fixedWeapons = response.data;
        setWeapons(fixedWeapons.filter((item) => item.returned !== true));
        setFilteredWeapons(fixedWeapons.filter((item) => item.returned !== true));
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error fetching weapons:', error);
      });
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = weapons.map((weapon) => weapon._id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const filtered = weapons.filter((weapon) => {
      return (
        (!filters.type || weapon.type === filters.type) &&
        (!filters.status || weapon.status === filters.status) &&
        (!filters.category || weapon.category === filters.category) &&
        (!filters.createdOn || weapon.createdOn === filters.createdOn)
      );
    });
    setFilteredWeapons(filtered);
  };

  const handleActionSelect = (action) => {
    switch (action) {
      case 'delete':
        console.log('Delete selected rows:', selectedRows);
        break;
      case 'export':
        console.log('Export selected rows:', selectedRows);
        break;
      case 'download':
        selectedRows.forEach((id) => {
          const weapon = weapons.find((w) => w._id === id);
          if (weapon) {
            generatePDF(weapon);
          }
        });
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const generatePDF = (weapon) => {
    const doc = new jsPDF();
    const title = `Weapon Details: ${weapon.officer.name}`;
    const content = `
      Officer Name: ${weapon.officer.name}
      Metal No: ${weapon.officer.metalNo}
      Rank: ${weapon.officer.rank}
      Duty: ${weapon.officer.duty}
      Status: ${weapon.officer.status}
      Issue Date: ${new Date(weapon.issueDate).toLocaleDateString()}
      Return Date: ${new Date(weapon.returnDate).toLocaleDateString()}
      Weapons: ${weapon.weapons.map(w => w.type).join(', ')}
    `;

    doc.text(title, 10, 10);
    doc.text(content, 10, 20);
    doc.save(`${weapon.officer.name}_weapon_details.pdf`);
  };
  const saver = (id) => {
    const weapon = weapons.find((w) => w._id === id);
    if (weapon) {
      generatePDF(weapon);
    } else {
      alert('Weapon not found!');
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  if (isLoading) {
    return <Loading />;
  }

  const openCanvasHandler = (type, id) => {
    setAddType(type);
    setUpdateId(id);
    setShowCanvas(true);
  };

  const closeCanvasHanlder = () => {
    setShowCanvas(false);
    setAddType('');
  };

  const handleDelete = async (weaponId) => {
    try {
      await axios.delete(`https://tool-backendf.onrender.com/api/weapons/${weaponId}`);
      setWeapons(prevWeapons => prevWeapons.filter(w => w._id !== weaponId));
      alert('Weapon deleted successfully.');
    } catch (error) {
      console.error('Error deleting weapon:', error);
      alert('Failed to delete weapon.');
    }
  };

  return (
    <section className="container-fluid p-3 p-md-5">
      <h1 className="fs-3 fw-normal">Manage Transactions</h1>
      <hr />
      <div className="row">
        <div className="col-md-9">
          <div className="d-flex align-items-center justify-content-between">
            <div className="search">
              <input type="text" placeholder="Search Armoury" />
              <button>
                <i className="bi bi-search"></i>
              </button>
            </div>
            <select
              name="actions"
              id="actions"
              className="main-btn hover"
              onChange={(e) => handleActionSelect(e.target.value)}
              disabled={selectedRows.length === 0}
            >
              <option value="" disabled selected>
                Actions
              </option>
              <option value="delete">Delete</option>
              <option value="export">Export</option>
              <option value="download">Download PDF</option>
            </select>
          </div>
          <div className="main-btn mt-3 filter d-flex gap-2 align-items-center justify-content-between p-2" style={{ maxWidth: '100%', overflow: 'auto' }}>
            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="type">Type</label>
              <select name="type" id="type">
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
            </div>

            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="status">Status</label>
              <select name="status" id="status" onChange={handleFilterChange}>
                <option value="">Select Armoury Status</option>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
                <option value="repair">Repair</option>
              </select>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="category">Category</label>
              <select name="category" id="category" onChange={handleFilterChange}>
                <option value="">Select Armoury Category</option>
                <option value="armoury">Armoury</option>
                <option value="ammunition">Ammunition</option>
                <option value="munition">Munition</option>
              </select>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="createdOn">Created on</label>
              <input type="date" name="createdOn" onChange={handleFilterChange} />
            </div>
          </div>
          <table width="100%" className="table">
            <thead>
              <tr className="main-btn">
                <th className="d-flex gap-2 align-items-center">
                  <input
                    type="checkbox"
                    name="all"
                    id="all"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === weapons.length && weapons.length > 0}
                  />
                  Officer Name
                </th>
                <th>Metal No</th>
                <th>Rank</th>
                <th>Duty</th>
                <th>Status</th>
                <th>No of weapons</th>
                <th>Register No</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWeapons.length > 0 ? (
                filteredWeapons.map((item) => (
                  <tr key={item._id}>
                    <td className='d-flex gap-2 align-items-center'>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item._id)}
                        onChange={() => handleRowSelect(item._id)}
                      />
                      {item.officer.name}
                    </td>
                    <td>{item.officer.metalNo}</td>
                    <td>{item.officer.rank}</td>
                    <td>{item.officer.duty}</td>
                    <td>{item.officer.status}</td>
                    <td>{item.weapons.length}</td>
                    <td>{item.officer.registerNo}</td>
                    <td>{item.officer.phonenumber}</td>
                    <td className="text-center">
                       <Dropdown>
                                          <Dropdown.Toggle variant="link" className="text-dark p-0">
                                            <i className="bi bi-gear-fill" style={{ cursor: 'pointer' }}></i>
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Item href={`/return/weapon/${item._id}`} >  <a className='red-btn'>Receive</a></Dropdown.Item>
                                            <Dropdown.Item onClick={()=>saver(item._id)}> <button className="red-btn w-100">Print PDF</button></Dropdown.Item>
                                           
                                          </Dropdown.Menu>
                                        </Dropdown>
                    
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-3">
                    <i className="bi bi-ban display-2"></i>
                    <p className="fs-5 fw-bold mt-2">No weapons found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-md-3">
          <button className="red-btn w-100 text-start px-3" onClick={() => openCanvasHandler('issue')}>
            <i className="bi bi-plus-lg"></i> Issue
          </button>
        </div>
      </div>
      <Offcanvas show={showCanvas} onHide={closeCanvasHanlder} placement='bottom'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ textTransform: 'capitalize' }}>{AddType}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {
            AddType === 'issue' ? (<MainIssue C_type={'armoury'} />) : AddType === 'edit' ? (<Edit id={updateId} />) : AddType === 'view' ? (<Details id={updateId} />) : (null)
          }
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
}

export default ReturnAll;