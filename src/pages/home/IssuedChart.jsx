import React from 'react'
import ReactApexChart from 'react-apexcharts';

function IssuedChart({ total = 0, available = 0, issued = 0 }) {
     // Handle edge cases where total is zero or invalid
  if (total <= 0) {
    return <div>Ammunition</div>;
  }

  // Calculate percentages, ensuring no division by zero
  const availablePercentage = Math.round((available / total) * 100) || 0;
  const issuedPercentage = Math.round((issued / total) * 100) || 0;
  const totalPercentage = 100; // This is static since total is always 100%

  // Series data for radial bars
  const series = [availablePercentage, issuedPercentage, totalPercentage];

  const options = {
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        size: 200,
        offsetY: 0,
        hollow: {
          size: '30%',
        },
        dataLabels: {
          name: {
            fontSize: '16px',
            fontWeight: 'bold',
          },
          value: {
            fontSize: '14px',
            fontWeight: 'normal',
            formatter: (val) => `${val}%`,
          },
          total: {
            show: true,
            label: 'Total Weapons',
            formatter: () => `${total}`,
          },
        },
      },
    },
    colors: ['#36A2EB', '#FF9F40', '#4BC0C0'], // Gradient colors for each section
    labels: ['Available', 'Issued', 'Total'],
  };
  return (
    <div className="card rounded-0">
                        <div className="card-header p-2 d-flex gap-2 align-items-center justify-content-end">
                       {/* <div className="icon">
                       <i class="bi bi-arrow-clockwise"></i>
                       </div> */}
                       {/* <div className="icon" onClick={()=>{
                            isOpen?(close()):(open(2))
                       }}>
                       <i class="bi bi-arrows-angle-expand"></i>
                       </div> */}
                        </div>
                        <div className="card-body">
                            <h5 className="fs-5 text-secondary">Available Count</h5>
                            <hr />
                           
                            <ReactApexChart options={options} series={series} type="radialBar" height={350} />
                        </div>
                    </div>
  )
}

export default IssuedChart