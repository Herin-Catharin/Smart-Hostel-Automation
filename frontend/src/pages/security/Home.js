import { useEffect, useState } from "react";
import API from "../../services/api";

const Home = () => {
  const [stats, setStats] = useState({
    outNow: 0,
    overdue: 0,
    returningSoon: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/outpass/security/active");
        const active = res.data.active_outpasses || [];

        const now = new Date();

        let overdue = 0;
        let returningSoon = 0;

        active.forEach((o) => {
          const toTime = new Date(o.toTime);
          const diffMinutes = (toTime - now) / 60000;

          if (now > toTime) overdue++;
          else if (diffMinutes <= 30) returningSoon++;
        });

        setStats({
          outNow: active.length,
          overdue,
          returningSoon
        });
      } catch (err) {
        console.error("Error fetching security stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={styles.center}>Loading security dashboard…</div>;
  }

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Security Dashboard</h3>
      <p style={styles.subtitle}>
        Live campus outpass monitoring
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Students Out Now</p>
          <h2 style={styles.cardValue}>{stats.outNow}</h2>
        </div>

        <div style={{ ...styles.card, ...styles.warning }}>
          <p style={styles.cardLabel}>Returning Soon</p>
          <h2 style={styles.cardValue}>{stats.returningSoon}</h2>
          <p style={styles.hint}>≤ 30 mins</p>
        </div>

        <div style={{ ...styles.card, ...styles.danger }}>
          <p style={styles.cardLabel}>Overdue</p>
          <h2 style={styles.cardValue}>{stats.overdue}</h2>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "sans-serif"
  },
  title: {
    textAlign: "center",
    color: "#2e7d32",
    marginBottom: "5px"
  },
  subtitle: {
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  },
  card: {
    backgroundColor: "#f9fff9",
    border: "1px solid #c8e6c9",
    borderRadius: "14px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
  },
  cardLabel: {
    fontSize: "0.85rem",
    color: "#555",
    marginBottom: "10px"
  },
  cardValue: {
    fontSize: "2.2rem",
    color: "#2e7d32",
    margin: 0
  },
  warning: {
    backgroundColor: "#fffdf9",
    borderColor: "#ffe0b2"
  },
  danger: {
    backgroundColor: "#fffafa",
    borderColor: "#ffcdd2"
  },
  hint: {
    fontSize: "0.7rem",
    color: "#ef6c00",
    marginTop: "5px"
  },
  center: {
    textAlign: "center",
    marginTop: "60px",
    color: "#666"
  }
};

export default Home;
