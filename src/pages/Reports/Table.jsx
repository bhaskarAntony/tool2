import React, { useState, useMemo } from 'react';
import { Form, Pagination, Offcanvas, Button } from 'react-bootstrap';

function CategoryTable({
  data,
  category,
  filters,
  tempFilters,
  handleFilterChange,
  applyFilters,
  clearFilters,
  showFilterCanvas,
  setShowFilterCanvas,
  weaponTypes,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Sorted and paginated data
  const sortedData = useMemo(() => {
    let result = [...data];
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="main-btn">
            <tr>
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
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item._id}>
                  <td className="d-flex gap-2 align-items-center">{item.type}</td>
                  <td>{item.category.toUpperCase()}</td>
                  <td>{item.registerNumber}</td>
                  <td>{item.coy}</td>
                  <td>{item.status}</td>
                  <td>{item.isIssued ? 'Yes' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
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
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of{' '}
          {sortedData.length} items
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

      {/* Filter Offcanvas */}
      <Offcanvas
        show={showFilterCanvas}
        onHide={() => setShowFilterCanvas(false)}
        placement="start"
        style={{ width: '300px' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{category.charAt(0).toUpperCase() + category.slice(1)} Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="filter-container p-3">
            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor={`type-${category}`}>Type</Form.Label>
              <Form.Select
                name="type"
                id={`type-${category}`}
                value={tempFilters.type}
                onChange={(e) => handleFilterChange(category, e)}
                size="sm"
              >
                <option value="">All Types</option>
                {weaponTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor={`status-${category}`}>Status</Form.Label>
              <Form.Select
                name="status"
                id={`status-${category}`}
                value={tempFilters.status}
                onChange={(e) => handleFilterChange(category, e)}
                size="sm"
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
                <option value="repair">Repair</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor={`createdOn-${category}`}>Created On</Form.Label>
              <Form.Control
                type="date"
                name="createdOn"
                id={`createdOn-${category}`}
                value={tempFilters.createdOn}
                onChange={(e) => handleFilterChange(category, e)}
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor={`registerNumber-${category}`}>Register Number</Form.Label>
              <Form.Control
                type="text"
                name="registerNumber"
                id={`registerNumber-${category}`}
                value={tempFilters.registerNumber}
                onChange={(e) => handleFilterChange(category, e)}
                placeholder="Enter register no"
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor={`coy-${category}`}>Coy</Form.Label>
              <Form.Control
                type="text"
                name="coy"
                id={`coy-${category}`}
                value={tempFilters.coy}
                onChange={(e) => handleFilterChange(category, e)}
                placeholder="Enter coy"
                size="sm"
              />
            </Form.Group>

            <Form.Group className="filter-item mb-3">
              <Form.Label htmlFor={`isIssued-${category}`}>Issued</Form.Label>
              <Form.Select
                name="isIssued"
                id={`isIssued-${category}`}
                value={tempFilters.isIssued}
                onChange={(e) => handleFilterChange(category, e)}
                size="sm"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={() => applyFilters(category)}
                className="w-100"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => clearFilters(category)}
                className="w-100"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default CategoryTable;