import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/loading/Loading';
import CategoryTable from './Table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
import { Button, Form, Row, Col } from 'react-bootstrap';
import './style.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

function Reports() {
  const [data, setData] = useState({
    armoury: [],
    ammunition: [],
    munition: [],
  });
  const [filteredData, setFilteredData] = useState({
    armoury: [],
    ammunition: [],
    munition: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterCanvas, setShowFilterCanvas] = useState({
    armoury: false,
    ammunition: false,
    munition: false,
  });
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('reportsFilters');
    return saved
      ? JSON.parse(saved)
      : {
          armoury: { type: '', status: '', createdOn: '', registerNumber: '', coy: '', isIssued: '' },
          ammunition: { type: '', status: '', createdOn: '', registerNumber: '', coy: '', isIssued: '' },
          munition: { type: '', status: '', createdOn: '', registerNumber: '', coy: '', isIssued: '' },
        };
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [weaponTypes, setWeaponTypes] = useState([]);

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get('https://tool-backendf.onrender.com/api/weapons');
      const weapons = response.data;
      const categorized = {
        armoury: weapons.filter((item) => item.category === 'armoury'),
        ammunition: weapons.filter((item) => item.category === 'ammunition'),
        munition: weapons.filter((item) => item.category === 'munition'),
      };
      setData(categorized);
      setFilteredData(categorized);
      // Mock weapon types (replace with API if available)
      const types = [...new Set(weapons.map((item) => item.type))];
      setWeaponTypes(types);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch weapons data.');
      toast.error('Failed to fetch weapons data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Persist filters
  useEffect(() => {
    localStorage.setItem('reportsFilters', JSON.stringify(filters));
  }, [filters]);

  // Handle global search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const newFiltered = {};
    Object.keys(data).forEach((category) => {
      newFiltered[category] = data[category].filter(
        (item) =>
          item.type.toLowerCase().includes(query) ||
          item.registerNumber.toLowerCase().includes(query) ||
          item.coy.toLowerCase().includes(query)
      );
      // Apply existing filters
      newFiltered[category] = newFiltered[category].filter((item) =>
        applyFilterLogic(item, filters[category])
      );
    });
    setFilteredData(newFiltered);
  };

  // Filter logic
  const applyFilterLogic = (item, filter) => {
    return (
      (!filter.type || item.type === filter.type) &&
      (!filter.status || item.status === filter.status) &&
      (!filter.createdOn ||
        new Date(item.createdOn).toDateString() === new Date(filter.createdOn).toDateString()) &&
      (!filter.registerNumber ||
        item.registerNumber.toLowerCase().includes(filter.registerNumber.toLowerCase())) &&
      (!filter.coy || item.coy.toLowerCase().includes(filter.coy.toLowerCase())) &&
      (!filter.isIssued || (filter.isIssued === 'true' ? item.isIssued : !item.isIssued))
    );
  };

  // Handle filter change
  const handleFilterChange = (category, e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      [category]: { ...prev[category], [name]: value },
    }));
  };

  // Apply filters
  const applyFilters = (category) => {
    setFilters((prev) => ({
      ...prev,
      [category]: tempFilters[category],
    }));
    setShowFilterCanvas((prev) => ({ ...prev, [category]: false }));
    const filtered = data[category].filter((item) => applyFilterLogic(item, tempFilters[category]));
    setFilteredData((prev) => ({ ...prev, [category]: filtered }));
  };

  // Clear filters
  const clearFilters = (category) => {
    const reset = { type: '', status: '', createdOn: '', registerNumber: '', coy: '', isIssued: '' };
    setTempFilters((prev) => ({ ...prev, [category]: reset }));
    setFilters((prev) => ({ ...prev, [category]: reset }));
    setFilteredData((prev) => ({
      ...prev,
      [category]: searchQuery
        ? data[category].filter(
            (item) =>
              item.type.toLowerCase().includes(searchQuery) ||
              item.registerNumber.toLowerCase().includes(searchQuery) ||
              item.coy.toLowerCase().includes(searchQuery)
          )
        : data[category],
    }));
  };

  // Export to Excel (single category)
  const handleDownloadExcel = (categoryData, categoryName) => {
    const worksheet = XLSX.utils.json_to_sheet(
      categoryData.map((item) => ({
        Type: item.type,
        Category: item.category,
        'Register No': item.registerNumber,
        Coy: item.coy,
        Status: item.status,
        'Created On': new Date(item.createdOn).toLocaleDateString(),
        Issued: item.isIssued ? 'Yes' : 'No',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, categoryName);
    XLSX.writeFile(workbook, `${categoryName}_Report.xlsx`);
    toast.success(`${categoryName} exported to Excel`);
  };

  // Export all categories to Excel
  const handleDownloadAllExcel = () => {
    const workbook = XLSX.utils.book_new();
    Object.keys(filteredData).forEach((category) => {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredData[category].map((item) => ({
          Type: item.type,
          Category: item.category,
          'Register No': item.registerNumber,
          Coy: item.coy,
          Status: item.status,
          'Created On': new Date(item.createdOn).toLocaleDateString(),
          Issued: item.isIssued ? 'Yes' : 'No',
        }))
      );
      XLSX.utils.book_append_sheet(workbook, worksheet, category.charAt(0).toUpperCase() + category.slice(1));
    });
    XLSX.writeFile(workbook, 'All_Categories_Report.xlsx');
    toast.success('All categories exported to Excel');
  };

  // Export to PDF
  const handleDownloadPDF = (categoryData, categoryName) => {
    const doc = new jsPDF();
    doc.text(`${categoryName} Report`, 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Type', 'Category', 'Register No', 'Coy', 'Status', 'Created On', 'Issued']],
      body: categoryData.map((item) => [
        item.type,
        item.category,
        item.registerNumber,
        item.coy,
        item.status,
        new Date(item.createdOn).toLocaleDateString(),
        item.isIssued ? 'Yes' : 'No',
      ]),
    });
    doc.save(`${categoryName}_Report.pdf`);
    toast.success(`${categoryName} exported to PDF`);
  };

  // Print view
  const handlePrint = (categoryData, categoryName) => {
    const printContent = `
      <html>
        <head>
          <title>${categoryName} Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #007bff; color: white; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>${categoryName} Report</h1>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Register No</th>
                <th>Coy</th>
                <th>Status</th>
                <th>Issued</th>
              </tr>
            </thead>
            <tbody>
              ${categoryData
                .map(
                  (item) => `
                    <tr>
                      <td>${item.type}</td>
                      <td>${item.category}</td>
                      <td>${item.registerNumber}</td>
                      <td>${item.coy}</td>
                      <td>${item.status}</td>
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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Chart data
  const getStatusChartData = (category) => ({
    labels: ['Available', 'Issued', 'Repair'],
    datasets: [
      {
        label: `${category} Status`,
        data: [
          filteredData[category].filter((w) => w.status === 'available').length,
          filteredData[category].filter((w) => w.status === 'issued').length,
          filteredData[category].filter((w) => w.status === 'repair').length,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  });

  const getTypeChartData = (category) => {
    const types = [...new Set(filteredData[category].map((item) => item.type))].slice(0, 5); // Limit to 5 for readability
    return {
      labels: types,
      datasets: [
        {
          label: `${category} Types`,
          data: types.map((type) => filteredData[category].filter((w) => w.type === type).length),
          backgroundColor: ['#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB'],
        },
      ],
    };
  };

  const renderCategoryCard = (title, dataKey) => (
    <div className="col-md-12 mb-4">
      <div className="card rounded-0 h-100">
        <div className="card-header p-3 d-flex align-items-center justify-content-between">
          <h1 className="fs-4 mb-0">{title}</h1>
          <div className="d-flex gap-2">
            <Button
              className="red-btn"
              onClick={() => setShowFilterCanvas((prev) => ({ ...prev, [dataKey]: true }))}
            >
              <i className="bi bi-filter"></i> Filters
            </Button>
            <Button
              className="red-btn"
              onClick={() => handleDownloadExcel(filteredData[dataKey], title)}
            >
              Excel
            </Button>
            <Button
              className="red-btn"
              onClick={() => handleDownloadPDF(filteredData[dataKey], title)}
            >
              PDF
            </Button>
            <Button
              className="red-btn"
              onClick={() => handlePrint(filteredData[dataKey], title)}
            >
              Print
            </Button>
          </div>
        </div>
        <div className="card-body">
          {/* Summary Stats */}
          <div className="mb-3 d-flex gap-2">
            <p className='main-btn' style={{flex:'1'}}><strong>Total Items:</strong> {filteredData[dataKey].length}</p>
            <p className='main-btn'><strong>Issued:</strong> {filteredData[dataKey].filter((w) => w.isIssued).length}</p>
            <p className='main-btn'><strong>Available:</strong> {filteredData[dataKey].filter((w) => w.status === 'available').length}</p>
          </div>
          {/* Charts */}
          
          {/* Table */}
          <CategoryTable
            data={filteredData[dataKey]}
            category={dataKey}
            filters={filters[dataKey]}
            tempFilters={tempFilters[dataKey]}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            showFilterCanvas={showFilterCanvas[dataKey]}
            setShowFilterCanvas={(show) =>
              setShowFilterCanvas((prev) => ({ ...prev, [dataKey]: show }))
            }
            weaponTypes={weaponTypes}
          />

<Row className="mb-4">
            <Col md={6}>
             <div className="card">
             <h5 className='main-btn fs-6 p-3'>Status Distribution</h5>
              <div style={{ height: '200px' }}>
                <Bar
                  data={getStatusChartData(dataKey)}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              </div>
             </div>
            </Col>
            <Col md={6}>
           <div className="card">
           <h5 className='main-btn fs-6 p-3'>Top Types</h5>
              <div style={{ height: '200px' }}>
                <Pie
                  data={getTypeChartData(dataKey)}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } },
                  }}
                />
              </div>
           </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );

  return (
    <section className="container-fluid p-3 p-md-5">
      <h1 className="fs-3 fw-normal">Reports</h1>
      <hr />
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            placeholder="Search by Type, Reg. No, or Coy"
            value={searchQuery}
            onChange={handleSearch}
            style={{ width: '400px' }}
          />
          <Button className="red-btn">
            <i className="bi bi-search"></i>
          </Button>
        </div>
        <Button className="red-btn" onClick={handleDownloadAllExcel}>
          Export All to Excel
        </Button>
      </div>
      <div className="row">
        {renderCategoryCard('Armoury', 'armoury')}
        {renderCategoryCard('Ammunition', 'ammunition')}
        {renderCategoryCard('Munition', 'munition')}
      </div>
    </section>
  );
}

export default Reports;