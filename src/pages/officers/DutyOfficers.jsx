import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/loading/Loading';
import { Dropdown, Offcanvas } from 'react-bootstrap';
import NewArmoury from '../../components/Newarmary/NewArmoury';
import Edit from '../manage/Edit';
import Details from '../manage/Details';
import EditOfficer from './EditOfficer';
import NewOfficer from '../officer/NewOfficer';


function Armoury() {
  const [weapons, setWeapons] = useState([]);
  const [filteredWeapons, setFilteredWeapons] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [AddType, setAddType] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: '',
    createdOn: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/officer')
      .then((response) => {
        setIsLoading(false);
        const fixedWeapons = response.data;
        setWeapons(fixedWeapons);
        setFilteredWeapons(fixedWeapons);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error fetching weapons:', error);
      });
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = weapons.map((weapon) => weapon.id);
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
      default:
        console.log('Unknown action:', action);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  if (isLoading) {
    return <Loading />;
  }

  const openCanvasHandler = (type, id) =>{
    setAddType(type);
    setUpdateId(id)
    setShowCanvas(true)
}
const closeCanvasHanlder = () =>{
    setShowCanvas(false);
    setAddType('');
}

const handleDelete = async (id) => {
  try {
      await axios.delete(`https://tool-backendf.onrender.com/api/officer/${id}`);
      setWeapons(preOfficer => preOfficer.filter(w => w.id !== id));
      alert('Weapon deleted successfully.');
  } catch (error) {
      console.error('Error deleting weapon:', error);
      alert('Failed to delete weapon.');
  }
};
  return (
    <section className="container-fluid p-3 p-md-5">
      <h1 className="fs-3 fw-normal">Manage Duty Officers</h1>
      <hr />
      <div className="row">
        <div className="col-md-9">
          <div className="d-flex align-items-center justify-content-between">
            <div className="search">
              <input type="text" placeholder="Search officers" />
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
            </select>
          </div>
          <div className="main-btn mt-3 filter d-flex gap-2 align-items-center justify-content-between p-2">
            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="type">Type</label>
              <select name="type" id="type" onChange={handleFilterChange}>
                <option value="">Select Officers Type</option>
                <option value="type1">Fixed Officers/Men</option>
                <option value="type2">Duty Ofiicers/Men</option>
              </select>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="type">Rank</label>
              <select name="type" id="type" onChange={handleFilterChange}>
                <option value="">Select Officers/Men Rank</option>
                <option value="type1">PC</option>
                <option value="type2">HC</option>
                <option value="">ARSI</option>
                <option value="">ASI</option>
                <option value="">PSI</option>
                <option value="">RSI</option>
                <option value="">RPI</option>
                <option value="">P1</option>
                <option value="">AC</option>
                <option value="">DSP</option>
              </select>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <label htmlFor="status">Status</label>
              <select name="status" id="status" onChange={handleFilterChange}>
                <option value="">Select Officers Status</option>
                <option value="returned">Returned</option>
                <option value="recieved">Recieved</option>
              </select>
            </div>

            {/* <div className="d-flex gap-2 align-items-center">
              <label htmlFor="category">Category</label>
              <select name="category" id="category" onChange={handleFilterChange}>
                <option value="">Select Armoury Category</option>
                <option value="fixed officers">Fixed Officers</option>
                <option value="daily duty">Daily duty</option>
              </select>
            </div> */}

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
                  Name
                </th>
                <th>Rank</th>
                <th>Reg. no</th>
                <th>Metal No</th>
                <th>Phone number</th>
                <th>Recieved</th>
                <th>Returned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWeapons.length > 0 ? (
                filteredWeapons.map((item) => (
                  <tr key={item.id}>
                    <td className='d-flex gap-2 align-ietms-center'>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                      />
                      {item.name}
                    </td>
                    <td>{item.rank.toUpperCase()}</td>
                    <td>{item.registerNo}</td>
                    <td>{item.metalNo}</td>
                    <td>{item.phonenumber}</td>
                    <td>{item.recieved?.length}</td>
                    <td>{item.returned?.length}</td>
                    <td className="text-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-dark p-0">
                          <i className="bi bi-gear-fill" style={{ cursor: 'pointer' }}></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={()=>openCanvasHandler('edit', item._id)}>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={()=>handleDelete(item._id)}>Delete</Dropdown.Item>
                          {/* <Dropdown.Item  onClick={()=>openCanvasHandler('view', item._id)}>View Details</Dropdown.Item> */}
                          {/* <Dropdown.Item>History</Dropdown.Item> */}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No weapons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-md-3">
          <button onClick={()=>openCanvasHandler('new')}className="red-btn w-100 text-start px-3">
            <i className="bi bi-plus-lg"></i> Add new Officer
          </button>
        </div>
      </div>
      <Offcanvas show={showCanvas} onHide={closeCanvasHanlder} placement='bottom'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{textTransform:'capitalize'}}>{AddType}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            {
                AddType=='new'?(<NewOfficer C_type={'armoury'}/>):AddType=='edit'?(<EditOfficer id={updateId}/>):AddType=='view'?(<Details id={updateId}/>):(null)
            }
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
}

export default Armoury;
