import React, { useEffect, useState, useMemo } from 'react';
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
import { toast } from 'react-toastify';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

function Ammunition() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
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

  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('ammunitionFilters');
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          title: '',
          description: '',
          status: '',
          category: '',
          createdOn: '',
          quantity: '',
          isIssued: '',
        };
  });
  const [tempFilters, setTempFilters] = useState(filters);

  // Fetch items
  useEffect(() => {
    axios
      .get('https://tool-backendf.onrender.com/api/items')
      .then((response) => {
        const data = response.data;
        setItems(data);
        setFilteredItems(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        toast.error('Failed to fetch items');
        setIsLoading(false);
      });
  }, []);

  // Persist filters
  useEffect(() => {
    localStorage.setItem('ammunitionFilters', JSON.stringify(filters));
  }, [filters]);

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
      title: '',
      description: '',
      status: '',
      category: '',
      createdOn: '',
      quantity: '',
      isIssued: '',
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    setCurrentPage(1);
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...items];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(searchQuery)) ||
          (item.description && item.description.toLowerCase().includes(searchQuery))
      );
    }

    // Apply filters
    filtered = filtered.filter((item) => {
      return (
        (!filters.title || (item.title && item.title.toLowerCase().includes(filters.title.toLowerCase()))) &&
        (!filters.description ||
          (item.description && item.description.toLowerCase().includes(filters.description.toLowerCase()))) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.category || item.category === filters.category) &&
        (!filters.createdOn ||
          new Date(item.createdOn).toDateString() === new Date(filters.createdOn).toDateString()) &&
        (!filters.quantity || item.quantity === parseInt(filters.quantity)) &&
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

    setFilteredItems(filtered);
  }, [items, filters, searchQuery, sortConfig]);

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredItems.map((item) => item._id);
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
      toast.error('Please select at least one item');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedRows.length} item(s)?`)) {
          try {
            await Promise.all(
              selectedRows.map((id) =>
                axios.delete(`https://tool-backendf.onrender.com/api/items/${id}`)
              )
            );
            setItems((prev) => prev.filter((w) => !selectedRows.includes(w._id)));
            setSelectedRows([]);
            toast.success('Items deleted successfully');
          } catch (error) {
            console.error('Error deleting items:', error);
            toast.error('Failed to delete items');
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
    const headers = ['Title', 'Description', 'Category', 'Status', 'Quantity', 'Created On', 'Issued'];
    const rows = filteredItems
      .filter((w) => selectedRows.includes(w._id))
      .map((w) => [
        w.title || '',
        w.description || '',
        w.category || '',
        w.status || '',
        w.quantity || 0,
        w.createdOn ? new Date(w.createdOn).toLocaleDateString() : '',
        w.isIssued ? 'Yes' : 'No',
      ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'ammunition.csv');
    toast.success('Items exported successfully');
  };

  // Handle delete
  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`https://tool-backendf.onrender.com/api/items/${itemId}`);
        setItems((prev) => prev.filter((w) => w._id !== itemId));
        setSelectedRows((prev) => prev.filter((id) => id !== itemId));
        toast.success('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  // Handle print
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Ammunition Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #007bff; color: white; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Ammunition Report</h1>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Issued</th>
              </tr>
            </thead>
            <tbody>
              ${filteredItems
                .map(
                  (item) => `
                    <tr>
                      <td>${item.title || ''}</td>
                      <td>${item.description || ''}</td>
                      <td>${item.category || ''}</td>
                      <td>${item.status || ''}</td>
                      <td>${item.quantity || 0}</td>
                      <td>${item.isIssued ? 'Yes' : 'No'}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
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
  const currentItems = useMemo(
    () => filteredItems.slice(indexOfFirstItem, indexOfLastItem),
    [filteredItems, indexOfFirstItem, indexOfLastItem]
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Chart data
  const statusChartData = {
    labels: ['Available', 'Issued', 'Repair'],
    datasets: [
      {
        label: 'Item Status',
        data: [
          items.filter((w) => w.status === 'available').length,
          items.filter((w) => w.status === 'issued').length,
          items.filter((w) => w.status === 'repair').length,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const categoryChartData = {
    labels: ['Armoury', 'Ammunition', 'Munition'],
    datasets: [
      {
        label: 'Item Categories',
        data: [
          items.filter((w) => w.category === 'armoury').length,
          items.filter((w) => w.category === 'ammunition').length,
          items.filter((w) => w.category === 'munition').length,
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
      <h1 className="fs-3 fw-normal">Manage Ammunition</h1>
      <hr />

      {/* Charts */}
      {/* <div className="row mb-4">
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Item Status Distribution</h5>
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
            <h5>Item Category Breakdown</h5>
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
      </div> */}

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
                  placeholder="Search by Title or Description"
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{ width: '400px' }}
                />
                <Button className="ms-2 red-btn">
                  <i className="bi bi-search"></i>
                </Button>
              </div>
              <Button className="red-btn" onClick={handlePrint}>
                <i className="bi bi-printer"></i> Print
              </Button>
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
                <tr>
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
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>
                    Description {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                    Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                    <tr key={item._id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedRows.includes(item._id)}
                          onChange={() => handleRowSelect(item._id)}
                        />
                      </td>
                      <td>{item.title || '-'}</td>
                      <td>{item.description || '-'}</td>
                      <td>{item.category || '-'}</td>
                      <td>{item.status || '-'}</td>
                      <td>{item.quantity || 0}</td>
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
                            <Dropdown.Item onClick={() => openCanvasHandler('edit', item._id)}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(item._id)}>
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => openCanvasHandler('view', item._id)}>
                              View Details
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => openCanvasHandler('history', item._id)}>
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
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of{' '}
              {filteredItems.length} items
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
            <i className="bi bi-plus-lg"></i> Add New Ammunition
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
              <Form.Label htmlFor="title">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                id="title"
                value={tempFilters.title}
                onChange={handleFilterChange}
                placeholder="Enter title"
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor="description">Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                id="description"
                value={tempFilters.description}
                onChange={handleFilterChange}
                placeholder="Enter description"
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
              <Form.Label htmlFor="quantity">Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                id="quantity"
                value={tempFilters.quantity}
                onChange={handleFilterChange}
                placeholder="Enter quantity"
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
            <NewArmoury C_type="ammunition" />
          ) : addType === 'edit' ? (
            <Edit id={updateId} />
          ) : addType === 'view' ? (
            <Details id={updateId} />
          ) : addType === 'history' ? (
            <div>
              <h5>Item History for ID: {updateId}</h5>
              <p>History view placeholder - implement API call to fetch history</p>
            </div>
          ) : null}
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
}

export default Ammunition;