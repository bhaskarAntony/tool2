import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/loading/Loading';
import Table from './Table';
import * as XLSX from 'xlsx';

function Reports() {
  const [data, setData] = useState({
    armoury: [],
    ammunition: [],
    munition: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://tool-backendf.onrender.com/api/weapons');
      const weapons = response.data;
      setData({
        armoury: weapons.filter((item) => item.category === 'armoury'),
        ammunition: weapons.filter((item) => item.category === 'ammunition'),
        munition: weapons.filter((item) => item.category === 'munition'),
      });
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch weapons data.');
      setIsLoading(false);
    }
  };

  const handleDownloadExcel = (categoryData, categoryName) => {
    const worksheet = XLSX.utils.json_to_sheet(categoryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, categoryName);
    XLSX.writeFile(workbook, `${categoryName}_Report.xlsx`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const renderCategoryCard = (title, dataKey) => (
    <div className="col-md-6 mb-3">
      <div className="card rounded-0 h-100">
        <div className="card-header p-3 d-flex align-items-center justify-content-between">
          <h1 className="fs-4 mb-0">{title}</h1>
          <button
            className="red-btn"
            onClick={() => handleDownloadExcel(data[dataKey], title)}
          >
            Download Excel
          </button>
        </div>
        <div className="card-body">
          <Table data={data[dataKey]} />
        </div>
      </div>
    </div>
  );

  return (
    <section className="container-fluid p-3 p-md-5">
      <div className="row">
        {renderCategoryCard('Armoury', 'armoury')}
        {renderCategoryCard('Ammunition', 'ammunition')}
        {renderCategoryCard('Munition', 'munition')}
      </div>
    </section>
  );
}

export default Reports;
