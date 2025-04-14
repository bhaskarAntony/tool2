import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Offcanvas, Button, Pagination, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loading from '../../components/loading/Loading';
import MainIssue from '../mainIssuepage/MainIssue';
import Edit from '../manage/Edit';
import Details from '../manage/Details';
import { saveAs } from 'file-saver';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
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

  // State for filters (temporary and applied)
  const [filters, setFilters] = useState({
    officerName: '',
    metalNo: '',
    rank: '',
    duty: '',
    status: '',
    weaponType: '',
    issueDate: '',
    returned: '',
  });
  const [tempFilters, setTempFilters] = useState({ ...filters });

  // Fetch transactions
  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/transactions/list')
      .then((response) => {
        setTransactions(response.data);
        setFilteredTransactions(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to fetch transactions');
        setIsLoading(false);
      });
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle filter change (update temporary filters)
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
      officerName: '',
      metalNo: '',
      rank: '',
      duty: '',
      status: '',
      weaponType: '',
      issueDate: '',
      returned: '',
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setCurrentPage(1);
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...transactions];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.officer.name.toLowerCase().includes(searchQuery) ||
          item.officer.metalNo.toLowerCase().includes(searchQuery) ||
          item.officer.registerNo.toLowerCase().includes(searchQuery)
      );
    }

    // Apply filters
    filtered = filtered.filter((item) => {
      return (
        (!filters.officerName || item.officer.name.toLowerCase().includes(filters.officerName.toLowerCase())) &&
        (!filters.metalNo || item.officer.metalNo.toLowerCase().includes(filters.metalNo.toLowerCase())) &&
        (!filters.rank || item.officer.rank === filters.rank) &&
        (!filters.duty || item.officer.duty.toLowerCase().includes(filters.duty.toLowerCase())) &&
        (!filters.status || item.officer.status === filters.status) &&
        (!filters.weaponType || item.weapons.some((w) => w.type === filters.weaponType)) &&
        (!filters.issueDate || new Date(item.issueDate).toDateString() === new Date(filters.issueDate).toDateString()) &&
        (!filters.returned || (filters.returned === 'true' ? item.returned : !item.returned))
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a;
        let bValue = b;
        sortConfig.key.split('.').forEach((k) => {
          aValue = aValue[k] || '';
          bValue = bValue[k] || '';
        });
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters, searchQuery, sortConfig]);

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredTransactions.map((item) => item._id);
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
      toast.error('Please select at least one transaction');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedRows.length} transaction(s)?`)) {
          try {
            await Promise.all(
              selectedRows.map((id) =>
                axios.delete(`https://tool-backendf.onrender.com/api/transactions/${id}`)
              )
            );
            setTransactions((prev) => prev.filter((t) => !selectedRows.includes(t._id)));
            setSelectedRows([]);
            toast.success('Transactions deleted successfully');
          } catch (error) {
            console.error('Error deleting transactions:', error);
            toast.error('Failed to delete transactions');
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
    const headers = [
      'Officer Name',
      'Metal No',
      'Rank',
      'Duty',
      'Status',
      'No of Weapons',
      'Register No',
      'Phone Number',
      'Issue Date',
      'Returned',
    ];
    const rows = filteredTransactions
      .filter((t) => selectedRows.includes(t._id))
      .map((t) => [
        t.officer.name,
        t.officer.metalNo,
        t.officer.rank,
        t.officer.duty,
        t.officer.status,
        t.weapons.length,
        t.officer.registerNo,
        t.officer.phonenumber,
        new Date(t.issueDate).toLocaleDateString(),
        t.returned ? 'Yes' : 'No',
      ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
    toast.success('Transactions exported successfully');
  };

  // Handle delete
  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`https://tool-backendf.onrender.com/api/transactions/${transactionId}`);
        setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
        setSelectedRows((prev) => prev.filter((id) => id !== transactionId));
        toast.success('Transaction deleted successfully');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Failed to delete transaction');
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="container-fluid p-3 p-md-5">
      <h1 className="fs-3 fw-normal">Manage Transactions</h1>
      <hr />
      <div className="row">
        <div className="col-md-9">
          {/* Search and Actions */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="primary"
                onClick={() => setShowFilterCanvas(true)}
                className="filter-toggle-btn"
              >
                <i className="bi bi-filter"></i> Filters
              </Button>
              <div className="search d-flex align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Search by Name, Metal No, or Register No"
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{ width: '300px' }}
                />
                <Button variant="outline-secondary" className="ms-2">
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
              style={{ width: '150px' }}
            >
              <option value="" disabled>
                Actions
              </option>
              <option value="delete">Delete</option>
              <option value="export">Export to CSV</option>
            </Form.Select>
          </div>

          {/* Transactions Table */}
          <table className="table table-hover mt-3">
            <thead className="main-btn">
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    id="selectAll"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === currentItems.length &&
                      currentItems.length > 0 &&
                      currentItems.every((item) => selectedRows.includes(item._id))
                    }
                  />
                </th>
                <th onClick={() => handleSort('officer.name')} style={{ cursor: 'pointer' }}>
                  Officer Name {sortConfig.key === 'officer.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('officer.metalNo')} style={{ cursor: 'pointer' }}>
                  Metal No {sortConfig.key === 'officer.metalNo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('officer.rank')} style={{ cursor: 'pointer' }}>
                  Rank {sortConfig.key === 'officer.rank' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('officer.duty')} style={{ cursor: 'pointer' }}>
                  Duty {sortConfig.key === 'officer.duty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('officer.status')} style={{ cursor: 'pointer' }}>
                  Status {sortConfig.key === 'officer.status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>No of Weapons</th>
                <th onClick={() => handleSort('officer.registerNo')} style={{ cursor: 'pointer' }}>
                  Register No {sortConfig.key === 'officer.registerNo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('officer.phonenumber')} style={{ cursor: 'pointer' }}>
                  Phone Number {sortConfig.key === 'officer.phonenumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('issueDate')} style={{ cursor: 'pointer' }}>
                  Issue Date {sortConfig.key === 'issueDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedRows.includes(item._id)}
                        onChange={() => handleRowSelect(item._id)}
                      />
                    </td>
                    <td>{item.officer.name}</td>
                    <td>{item.officer.metalNo}</td>
                    <td>{item.officer.rank}</td>
                    <td>{item.officer.duty}</td>
                    <td>{item.officer.status}</td>
                    <td>{item.weapons.length}</td>
                    <td>{item.officer.registerNo}</td>
                    <td>{item.officer.phonenumber}</td>
                    <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-dark p-0">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Actions</Tooltip>}>
                            <i className="bi bi-gear-fill" style={{ cursor: 'pointer' }}></i>
                          </OverlayTrigger>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => openCanvasHandler('edit', item._id)}>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDelete(item._id)}>Delete</Dropdown.Item>
                          <Dropdown.Item onClick={() => openCanvasHandler('view', item._id)}>View Details</Dropdown.Item>
                          <Dropdown.Item onClick={() => openCanvasHandler('history', item._id)}>View History</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} transactions
            </div>
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
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
            onClick={() => navigate('/return')}
          >
            <i className="bi bi-arrow-left-circle"></i> Return Transaction
          </Button>
          <Button
            className="red-btn w-100 text-start px-3"
            onClick={() => openCanvasHandler('issue', '')}
          >
            <i className="bi bi-plus-lg"></i> New Issue
          </Button>
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
              <Form.Label htmlFor="officerName">Officer Name</Form.Label>
              <Form.Control
                type="text"
                name="officerName"
                id="officerName"
                value={tempFilters.officerName}
                onChange={handleFilterChange}
                placeholder="Enter name"
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="metalNo">Metal No</Form.Label>
              <Form.Control
                type="text"
                name="metalNo"
                id="metalNo"
                value={tempFilters.metalNo}
                onChange={handleFilterChange}
                placeholder="Enter metal no"
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="rank">Rank</Form.Label>
              <Form.Select
                name="rank"
                id="rank"
                value={tempFilters.rank}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="">All Ranks</option>
                <option value="AC/DySP">AC/DySP</option>
                <option value="Inspector">Inspector</option>
                <option value="Sub-Inspector">Sub-Inspector</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="duty">Duty</Form.Label>
              <Form.Control
                type="text"
                name="duty"
                id="duty"
                value={tempFilters.duty}
                onChange={handleFilterChange}
                placeholder="Enter duty"
                size="sm"
              />
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
                <option value="recieved">Received</option>
                <option value="returned">Returned</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="weaponType">Weapon Type</Form.Label>
              <Form.Select
                name="weaponType"
                id="weaponType"
                value={tempFilters.weaponType}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="">All Types</option>
                <option value="7.62mm SLR 1A1">7.62mm SLR 1A1</option>
                <option value="RIFLE 7.62mm AK-47">RIFLE 7.62mm AK-47</option>
                <option value="RIFLE 5.56mm INSAS">RIFLE 5.56mm INSAS</option>
                <option value="9mm BROWNING PISTOL">9mm BROWNING PISTOL</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="issueDate">Issue Date</Form.Label>
              <Form.Control
                type="date"
                name="issueDate"
                id="issueDate"
                value={tempFilters.issueDate}
                onChange={handleFilterChange}
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="returned">Returned</Form.Label>
              <Form.Select
                name="returned"
                id="returned"
                value={tempFilters.returned}
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
          <Offcanvas.Title style={{ textTransform: 'capitalize' }}>{addType || 'Action'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {addType === 'issue' ? (
            <MainIssue C_type="armoury" />
          ) : addType === 'edit' ? (
            <Edit id={updateId} />
          ) : addType === 'view' ? (
            <Details id={updateId} />
          ) : addType === 'history' ? (
            <div>
              <h5>Transaction History for ID: {updateId}</h5>
              <p>History view placeholder - implement API call to fetch history</p>
            </div>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
}

export default Transactions;