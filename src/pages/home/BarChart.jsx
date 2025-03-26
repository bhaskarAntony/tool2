import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = ({ transactions = [] }) => {
  // Ensure transactions is always an array
  if (!Array.isArray(transactions)) {
    return <div>No data available</div>;
  }

  // Safe processing of transaction data
  const returnedData = transactions
    .filter((txn) => txn?.returned)
    .map((txn) => (Array.isArray(txn?.weapons) ? txn?.weapons?.length : 0));

  const notReturnedData = transactions
    .filter((txn) => !txn?.returned)
    .map((txn) => (Array.isArray(txn?.weapons) ? txn?.weapons?.length : 0));

  const options = {
    chart: {
      type: 'bar',
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    colors: ['#AA00FF', '#FF4081'], // Gradient colors
    xaxis: {
      categories: transactions.length
        ? transactions.map((txn, index) => `Transaction ${index + 1}`)
        : [],
      labels: {
        rotate: -45,
      },
    },
    legend: {
      position: 'top',
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [
    {
      name: 'Returned',
      data: returnedData,
    },
    {
      name: 'Not Returned',
      data: notReturnedData,
    },
  ];

  // Check if data is empty and return a message
  if (transactions?.length === 0) {
    return <div>No transactions available</div>;
  }

  return (
    <div className="card rounded-0">
                        <div className="card-header p-2 d-flex gap-2 align-items-center justify-content-end">
                       <div className="icon">
                       <i class="bi bi-arrow-clockwise"></i>
                       </div>
                       {/* <div className="icon" onClick={()=>{
                            isOpen?(close()):(open(2))
                       }}>
                       <i class="bi bi-arrows-angle-expand"></i>
                       </div> */}
                        </div>
                        <div className="card-body">
                            <h5 className="fs-5 text-secondary">Weapons per Transaction</h5>
                            <hr />
                         <ReactApexChart options={options} series={series} type="bar" height={350} />
                           
                        </div>
                    </div>
    
  );
};

export default BarChart;
