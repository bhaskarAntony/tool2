import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import NoData from "../../components/noData/NoData";

export const MaintenanceTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get("https://tool-backendf.onrender.com/api/maintenance/logs");
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://tool-backendf.onrender.com/api/maintenance/${id}`);
      fetchLogs(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  };

  return (
    <div className="p-3">
      <h5 className="fs-4">
        Maintenance Logs
      </h5>
      <hr />

        {logs.length === 0 ? (
        // Show NoData component if no logs available
        <div className="row">
          <div className="col-md-6 m-auto">
          <NoData />
          </div>
        </div>
      ) : (
        // Render table when data is available
        <table className="w-100 mt-4" align="center">
          <thead>
            <tr>
              <th>Resgister No</th>
              <th>Date</th>
              <th>Status</th>
              <th>Officer</th>
              {/* <th>Cost</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.registerNo}</td>
                <td>{new Date(log.maintenanceDate).toLocaleDateString()}</td>
                <td>{log.status}</td>
                <td>{log.assignedOfficer || "N/A"}</td>
                {/* <td>{log.cost || "N/A"}</td> */}
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(log._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
