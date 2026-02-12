import { useEffect, useState } from "react";
import API from "../../services/api";
import { FaUsers, FaDoorOpen, FaBuilding, FaClock } from "react-icons/fa";

const Home = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    studentsOut: 0,
    studentsIn: 0,
    pendingRequests: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const allReqRes = await API.get("/outpass/all_requests");
      const requests = allReqRes.data.requests || [];

      const uniqueStudents = new Set(
        requests.map((r) => r.studentId).filter(Boolean)
      );

      const pending = requests.filter((r) => r.status === "pending");

      const activeRes = await API.get("/outpass/security/active");
      const activeOut = activeRes.data.active_outpasses || [];

      setStats({
        totalStudents: uniqueStudents.size,
        studentsOut: activeOut.length,
        studentsIn: uniqueStudents.size - activeOut.length,
        pendingRequests: pending.length,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Warden Dashboard Overview</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>Quick stats and pending actions</p>

      <div style={styles.grid}>
        {/* Total Students */}
        <div style={{ ...styles.card, backgroundColor: "#e6f4ea" }}>
          <FaUsers size={28} color="#2e7d32" />
          <h3 style={styles.cardValue}>{stats.totalStudents}</h3>
          <p style={styles.cardLabel}>Total Students</p>
        </div>

        {/* Students Inside */}
        <div style={{ ...styles.card, backgroundColor: "#fff4e1" }}>
          <FaBuilding size={28} color="#f57c00" />
          <h3 style={styles.cardValue}>{stats.studentsIn}</h3>
          <p style={styles.cardLabel}>Students Inside</p>
        </div>

        {/* Students Outside */}
        <div style={{ ...styles.card, backgroundColor: "#ffe6e6" }}>
          <FaDoorOpen size={28} color="#d32f2f" />
          <h3 style={styles.cardValue}>{stats.studentsOut}</h3>
          <p style={styles.cardLabel}>Students Outside</p>
        </div>

        {/* Pending Requests – The Trigger Card */}
        <div
          style={{ 
            ...styles.card, 
            ...styles.clickableCard,
            backgroundColor: "#fff9e6", 
          }}
          onClick={() => setActiveTab && setActiveTab("requests")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <FaClock size={28} color="#fbc02d" />
          <h3 style={styles.cardValue}>{stats.pendingRequests}</h3>
          <p style={styles.cardLabel}>Pending Requests</p>
          <small style={styles.clickHint}>Click to review →</small>
        </div>
      </div>

      {/* Alert if pending requests exist */}
      {stats.pendingRequests > 0 && (
        <div 
            style={styles.alert} 
            onClick={() => setActiveTab("requests")}
        >
          ⚠️ You have <strong>{stats.pendingRequests}</strong> outpass request(s) waiting for approval.
        </div>
      )}
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    padding: "25px 15px",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s ease",
  },
  clickableCard: {
    cursor: "pointer",
    border: "1px solid #fbc02d",
  },
  cardValue: {
    fontSize: "1.8rem",
    margin: "10px 0 5px 0",
    color: "#333",
  },
  cardLabel: {
    fontSize: "0.9rem",
    color: "#555",
    margin: 0,
  },
  clickHint: {
    marginTop: "10px",
    color: "#856404",
    fontWeight: "600",
  },
  alert: {
    marginTop: "30px",
    padding: "15px 20px",
    background: "#fff3cd",
    borderRadius: "10px",
    color: "#856404",
    borderLeft: "5px solid #fbc02d",
    cursor: "pointer",
  },
};

export default Home;