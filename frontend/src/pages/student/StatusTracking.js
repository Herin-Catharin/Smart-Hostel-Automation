import { useEffect, useState } from "react";
import API from "../../services/api";

const StatusTracking = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/outpass/status");
        setRequests(res.data.requests);
      } catch (err) {
        setMsg(err.response?.data?.msg || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Outpass Status Tracking</h3>
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      {requests.length === 0 ? (
        <p>No requests submitted yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Reason</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
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
                  }}
                >
                  {r.status.toUpperCase()}
                </td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StatusTracking;
