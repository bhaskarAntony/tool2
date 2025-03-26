import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import NoData from "../../components/noData/NoData";

export const MaintenanceCharts = () => {
  const [data, setData] = useState({
    labels: [],
    series: [],
  });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await axios.get("https://tool-backendf.onrender.com/api/transactions/stats");
      const stats = response.data;

      // Check if stats have valid data
      if (stats && Array.isArray(stats) && stats.length > 0) {
        setHasData(true);
        setData({
          labels: stats.map((stat) => stat.status),
          series: stats.map((stat) => stat.count),
        });
      } else {
        setHasData(false);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!hasData) {
    return<div className="dashboard-card  card mt-3 ">
          <div className=" p-3 main-btn">
          <h5 className="fs-5 mb-0">Maintenance Status</h5>
          </div>
          <div className="card-body">
          <NoData/>
          </div>
  </div>
  }

  return (
    <div className=" p-4 card">
      <div className="card-heading btn-main">
      <h5 className="fs-5 mb-3">Maintenance Status</h5>
      </div>
      <Chart
        type="pie"
        options={{
          labels: data.labels,
        }}
        series={data.series}
        height="300"
      />
    </div>
  );
};
