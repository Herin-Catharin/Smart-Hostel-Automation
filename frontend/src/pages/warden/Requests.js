import React, { useEffect, useState } from "react";
import API from "../../services/api";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const res = await API.get("/outpass/all_requests"); // backend returns all requests
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  // Approve or Reject a request
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/outpass/update_status/${id}`, { status });
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p>Loading requests...</p>;

  if (requests.length === 0) return <p>No requests found</p>;

  return (
    <div>
      <h3>All Student Requests</h3>
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Student Name</th>
            <th>Reason</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r._id}>
              <td>{r.studentName}</td>
              <td>{r.reason}</td>
              <td>{new Date(r.fromTime).toLocaleString()}</td>
              <td>{new Date(r.toTime).toLocaleString()}</td>
              <td
                style={{
                  color:
                    r.status === "approved"
                      ? "green"
                      : r.status === "rejected"
                      ? "red"
                      : "orange",
                  fontWeight: "bold",
                }}
              >
                {r.status.toUpperCase()}
              </td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>
                {r.status === "pending" ? (
                  <>
                    <button
                      onClick={() => updateStatus(r._id, "approved")}
                      style={{ marginRight: "5px" }}
                    >
                      Approve
                    </button>
                    <button onClick={() => updateStatus(r._id, "rejected")}>Reject</button>
                  </>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Requests;
