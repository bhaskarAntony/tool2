import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import { useNavigate } from 'react-router-dom';
import {
  Dropdown,
  Offcanvas,
  Button,
  Pagination,
  Form,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import Loading from '../../components/loading/Loading';
import NewArmoury from '../../components/Newarmary/NewArmoury';
import Edit from './Edit';
import Details from './Details';
import { saveAs } from 'file-saver';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

function Armoury() {
  const [weapons, setWeapons] = useState([]);
  const [filteredWeapons, setFilteredWeapons] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showFilterCanvas, setShowFilterCanvas] = useState(false);
  const [addType, setAddType] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: '',
    createdOn: '',
    registerNumber: '',
    coy: '',
    isIssued: '',
  });
  const [tempFilters, setTempFilters] = useState({ ...filters });

  // Fetch weapons
  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/weapons')
      .then((response) => {
        const data = response.data;
        setWeapons(data);
        setFilteredWeapons(data.filter((item) => item.isIssued !== true));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching weapons:', error);
        toast.error('Failed to fetch weapons');
        setIsLoading(false);
      });
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setShowFilterCanvas(false);
  };

  // Clear filters
  const clearFilters = () => {
    const resetFilters = {
      type: '',
      status: '',
      category: '',
      createdOn: '',
      registerNumber: '',
      coy: '',
      isIssued: '',
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setCurrentPage(1);
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...weapons];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.type.toLowerCase().includes(searchQuery) ||
          item.registerNumber.toLowerCase().includes(searchQuery) ||
          item.coy.toLowerCase().includes(searchQuery)
      );
    }

    // Apply filters
    filtered = filtered.filter((item) => {
      return (
        (!filters.type || item.type === filters.type) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.category || item.category === filters.category) &&
        (!filters.createdOn ||
          new Date(item.createdOn).toDateString() === new Date(filters.createdOn).toDateString()) &&
        (!filters.registerNumber ||
          item.registerNumber.toLowerCase().includes(filters.registerNumber.toLowerCase())) &&
        (!filters.coy || item.coy.toLowerCase().includes(filters.coy.toLowerCase())) &&
        (!filters.isIssued || (filters.isIssued === 'true' ? item.isIssued : !item.isIssued))
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredWeapons(filtered);
  }, [weapons, filters, searchQuery, sortConfig]);

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredWeapons.map((weapon) => weapon.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Handle row select
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle bulk actions
  const handleActionSelect = async (action) => {
    if (selectedRows.length === 0) {
      toast.error('Please select at least one weapon');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedRows.length} weapon(s)?`)) {
          try {
            await Promise.all(
              selectedRows.map((id) =>
                axios.delete(`https://tool-backendf.onrender.com/api/weapons/${id}`)
              )
            );
            setWeapons((prev) => prev.filter((w) => !selectedRows.includes(w.id)));
            setSelectedRows([]);
            toast.success('Weapons deleted successfully');
          } catch (error) {
            console.error('Error deleting weapons:', error);
            toast.error('Failed to delete weapons');
          }
        }
        break;
      case 'export':
        exportToCSV();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Type', 'Category', 'Register No', 'Coy', 'Status', 'Created On', 'Issued'];
    const rows = filteredWeapons
      .filter((w) => selectedRows.includes(w.id))
      .map((w) => [
        w.type,
        w.category,
        w.registerNumber,
        w.coy,
        w.status,
        new Date(w.createdOn).toLocaleDateString(),
        w.isIssued ? 'Yes' : 'No',
      ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'weapons.csv');
    toast.success('Weapons exported successfully');
  };

  // Handle delete
  const handleDelete = async (weaponId) => {
    if (window.confirm('Are you sure you want to delete this weapon?')) {
      try {
        await axios.delete(`https://tool-backendf.onrender.com/api/weapons/${weaponId}`);
        setWeapons((prev) => prev.filter((w) => w.id !== weaponId));
        setSelectedRows((prev) => prev.filter((id) => id !== weaponId));
        toast.success('Weapon deleted successfully');
      } catch (error) {
        console.error('Error deleting weapon:', error);
        toast.error('Failed to delete weapon');
      }
    }
  };

  // Open/Close Offcanvas
  const openCanvasHandler = (type, id) => {
    setAddType(type);
    setUpdateId(id);
    setShowCanvas(true);
  };

  const closeCanvasHandler = () => {
    setShowCanvas(false);
    setAddType('');
    setUpdateId('');
  };

  // Navigate to details
  const viewDetails = (id) => {
    navigate(`/details/${id}`);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWeapons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWeapons.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Chart data
  const statusChartData = {
    labels: ['Available', 'Issued', 'Repair'],
    datasets: [
      {
        label: 'Weapon Status',
        data: [
          weapons.filter((w) => w.status === 'available').length,
          weapons.filter((w) => w.status === 'issued').length,
          weapons.filter((w) => w.status === 'repair').length,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const categoryChartData = {
    labels: ['Armoury', 'Ammunition', 'Munition'],
    datasets: [
      {
        label: 'Weapon Categories',
        data: [
          weapons.filter((w) => w.category === 'armoury').length,
          weapons.filter((w) => w.category === 'ammunition').length,
          weapons.filter((w) => w.category === 'munition').length,
        ],
        backgroundColor: ['#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="container-fluid p-3 p-md-5">
      <h1 className="fs-3 fw-normal">Manage Armoury</h1>
      <hr />

      {/* Charts */}
      

      <div className="row">
        <div className="col-md-9">
          {/* Search and Actions */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <Button
                
                onClick={() => setShowFilterCanvas(true)}
                className="filter-toggle-btn red-btn"
              >
                <i className="bi bi-filter"></i> Filters
              </Button>
              <div className="search d-flex align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Search by Type, Reg. No, or Coy"
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{ width: '500px' }}
                />
                <Button className="ms-2 red-btn">
                  <i className="bi bi-search"></i>
                </Button>
              </div>
            </div>
            <Form.Select
              name="actions"
              id="actions"
              className="main-btn hover"
              onChange={(e) => handleActionSelect(e.target.value)}
              disabled={selectedRows.length === 0}
              style={{ width: '200px' }}
            >
              <option value="" disabled>
                Actions
              </option>
              <option value="delete">Delete</option>
              <option value="export">Export to CSV</option>
            </Form.Select>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="main-btn">
                <tr className='main-btn'>
                  <th>
                    <Form.Check
                      type="checkbox"
                      id="selectAll"
                      onChange={handleSelectAll}
                      checked={
                        selectedRows.length === currentItems.length &&
                        currentItems.length > 0
                      }
                    />
                  </th>
                  <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                    Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('registerNumber')} style={{ cursor: 'pointer' }}>
                    Reg. No {sortConfig.key === 'registerNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('coy')} style={{ cursor: 'pointer' }}>
                    Coy {sortConfig.key === 'coy' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('isIssued')} style={{ cursor: 'pointer' }}>
                    Issued {sortConfig.key === 'isIssued' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleRowSelect(item.id)}
                        />
                      </td>
                      <td>{item.type}</td>
                      <td>{item.category.toUpperCase()}</td>
                      <td>{item.registerNumber}</td>
                      <td>{item.coy}</td>
                      <td>{item.status}</td>
                      <td>{item.isIssued ? 'Yes' : 'No'}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="link" className="text-dark p-0">
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Actions</Tooltip>}
                            >
                              <i className="bi bi-gear-fill" style={{ cursor: 'pointer' }}></i>
                            </OverlayTrigger>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => openCanvasHandler('edit', item.id)}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(item.id)}>
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => viewDetails(item.id)}>
                              View Details
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => openCanvasHandler('history', item.id)}>
                              View History
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No weapons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredWeapons.length)} of{' '}
              {filteredWeapons.length} weapons
            </div>
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === currentPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="col-md-3">
          <Button
            className="red-btn w-100 text-start px-3 mb-2"
            onClick={() => openCanvasHandler('armoury', '')}
          >
            <i className="bi bi-plus-lg"></i> Add New Armoury
          </Button>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
        <div className="card p-3">
        <h5>Weapon Status Distribution</h5>
        <hr />
          <div style={{ height: '300px' }}>
            <Bar
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
              }}
            />
          </div>
        </div>
        </div>
        <div className="col-md-6">
         <div className="card p-3">
         <h5>Weapon Category Breakdown</h5>
         <hr />
          <div style={{ height: '300px' }}>
            <Pie
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
              }}
            />
          </div>
         </div>
        </div>
      </div>

      {/* Filter Offcanvas */}
      <Offcanvas
        show={showFilterCanvas}
        onHide={() => setShowFilterCanvas(false)}
        placement="start"
        style={{ width: '300px' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="filter-container p-3">
            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="type">Type</Form.Label>
              <Form.Select
                name="type"
                id="type"
                value={tempFilters.type}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="">All Types</option>
                <option value="7.62mm SLR 1A1">7.62mm SLR 1A1</option>
                <option value="RIFLE 7.62mm AK-47">RIFLE 7.62mm AK-47</option>
                <option value="RIFLE 5.56mm INSAS">RIFLE 5.56mm INSAS</option>
                <option value="RIFLE 5.56mm EX-CALIBUR">RIFLE 5.56mm EX-CALIBUR</option>
                <option value="GM 7.62mm LMG 1B">GM 7.62mm LMG 1B</option>
                <option value="RIFLE 7.62mm TAR">RIFLE 7.62mm TAR</option>
                <option value="5.56mm JVPC">5.56mm JVPC</option>
                <option value="9mm CMG">9mm CMG</option>
                <option value="9mm BROWNING PISTOL">9mm BROWNING PISTOL</option>
                <option value="9mm AUTO PISTOL 1A">9mm AUTO PISTOL 1A</option>
                <option value="ANTI RIOT GUN .303">ANTI RIOT GUN .303</option>
                <option value="ANTI RIOT GUN 50G">ANTI RIOT GUN 50G</option>
                <option value="ANTI RIOT GUN 80G">ANTI RIOT GUN 80G</option>
                <option value="PROJECTOR PYRO TECHNIC 13MM HAND">
                  PROJECTOR PYRO TECHNIC 13MM HAND
                </option>
                <option value="TEAR GAS GUN">TEAR GAS GUN</option>
                <option value="COLT M-4 RIFLE">COLT M-4 RIFLE</option>
                <option value="GM 5.56MM LMG 1A1">GM 5.56MM LMG 1A1</option>
                <option value="51MM MORTAR">51MM MORTAR</option>
                <option value="MBL (Agnivarsha)">MBL (Agnivarsha)</option>
                <option value=".303’’ NO 4 MK-1 RIFLE">.303’’ NO 4 MK-1 RIFLE</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="status">Status</Form.Label>
              <Form.Select
                name="status"
                id="status"
                value={tempFilters.status}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
                <option value="repair">Repair</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="category">Category</Form.Label>
              <Form.Select
                name="category"
                id="category"
                value={tempFilters.category}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="">All Categories</option>
                <option value="armoury">Armoury</option>
                <option value="ammunition">Ammunition</option>
                <option value="munition">Munition</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="createdOn">Created On</Form.Label>
              <Form.Control
                type="date"
                name="createdOn"
                id="createdOn"
                value={tempFilters.createdOn}
                onChange={handleFilterChange}
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="registerNumber">Register Number</Form.Label>
              <Form.Control
                type="text"
                name="registerNumber"
                id="registerNumber"
                value={tempFilters.registerNumber}
                onChange={handleFilterChange}
                placeholder="Enter register no"
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="coy">Coy</Form.Label>
              <Form.Control
                type="text"
                name="coy"
                id="coy"
                value={tempFilters.coy}
                onChange={handleFilterChange}
                placeholder="Enter coy"
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="isIssued">Issued</Form.Label>
              <Form.Select
                name="isIssued"
                id="isIssued"
                value={tempFilters.isIssued}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" onClick={applyFilters} className="w-100">
                Apply Filters
              </Button>
              <Button variant="outline-secondary" onClick={clearFilters} className="w-100">
                Clear Filters
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Action Offcanvas */}
      <Offcanvas
        show={showCanvas}
        onHide={closeCanvasHandler}
        placement="bottom"
        style={{ height: '80vh' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ textTransform: 'capitalize' }}>
            {addType}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {addType === 'armoury' ? (
            <NewArmoury C_type="armoury" />
          ) : addType === 'edit' ? (
            <Edit id={updateId} />
          ) : addType === 'view' ? (
            <Details id={updateId} />
          ) : addType === 'history' ? (
            <div>
              <h5>Weapon History for ID: {updateId}</h5>
              <p>History view placeholder - implement API call to fetch history</p>
            </div>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
}

export default Armoury;