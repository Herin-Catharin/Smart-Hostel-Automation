import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ActiveOutpasses = () => {
  const [activeList, setActiveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActiveData = async () => {
    try {
      setLoading(true);
      // We use the security/active endpoint as it already filters for 
      // students who are currently 'OUT'
      const res = await API.get("/outpass/security/active");
      setActiveList(res.data.active_outpasses || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load active students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveData();
    // Auto-refresh every 5 minutes to keep the list current
    const interval = setInterval(fetchActiveData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={styles.center}>Loading active tracking...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Students Currently Off-Campus</h3>
        <button onClick={fetchActiveData} style={styles.refreshBtn}>Refresh List</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {activeList.length === 0 ? (
        <div style={styles.emptyState}>No students are currently out of campus.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Student Name</th>
              <th style={styles.th}>Reason</th>
              <th style={styles.th}>Exit Time</th>
              <th style={styles.th}>Deadline</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {activeList.map((o) => {
              const isLate = new Date() > new Date(o.toTime);
              return (
                <tr key={o._id} style={styles.row}>
                  <td style={styles.td}>
                    <div style={styles.name}>{o.studentName}</div>
                    <div style={styles.email}>{o.studentEmail}</div>
                  </td>
                  <td style={styles.td}>{o.reason}</td>
                  <td style={styles.td}>{new Date(o.exitTime).toLocaleString()}</td>
                  <td style={styles.td}>{new Date(o.toTime).toLocaleString()}</td>
                  <td style={styles.td}>
                    {isLate ? (
                      <span style={styles.lateBadge}>OVERDUE</span>
                    ) : (
                      <span style={styles.onTimeBadge}>ON TIME</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "1000px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  center: { textAlign: "center", marginTop: "50px" },
  refreshBtn: { padding: "8px 16px", cursor: "pointer", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "4px" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  tableHeader: { backgroundColor: "#f8f9fa", textAlign: "left" },
  th: { padding: "12px", borderBottom: "2px solid #eee", fontSize: "0.9rem", color: "#666" },
  td: { padding: "12px", borderBottom: "1px solid #eee", fontSize: "0.95rem" },
  row: { transition: "background 0.2s" },
  name: { fontWeight: "bold" },
  email: { fontSize: "0.8rem", color: "#888" },
  lateBadge: { backgroundColor: "#ffebee", color: "#d32f2f", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" },
  onTimeBadge: { backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" },
  emptyState: { textAlign: "center", padding: "40px", color: "#999", border: "1px dashed #ccc", borderRadius: "8px" },
  error: { color: "red", textAlign: "center" }
};

export default ActiveOutpasses;