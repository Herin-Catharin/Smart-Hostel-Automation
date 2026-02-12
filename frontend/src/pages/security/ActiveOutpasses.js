import { useEffect, useState } from "react";
import API from "../../services/api";

const ActiveOutpasses = () => {
  const [active, setActive] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await API.get("/outpass/security/active");
        setActive(res.data.active_outpasses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActive();
  }, []);

  if (loading) return <div style={styles.center}>Loading active outpasses…</div>;
  if (active.length === 0)
    return <div style={styles.center}>No students currently out</div>;

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Students Currently Off-Campus</h3>

      <div style={styles.list}>
        {active.map((o) => {
          const isLate = new Date() > new Date(o.toTime);

          return (
            <div
              key={o._id}
              style={{
                ...styles.card,
                borderColor: isLate ? "#ffcdd2" : "#c8e6c9",
                backgroundColor: isLate ? "#fffafa" : "#f9fff9"
              }}
            >
              <div style={styles.left}>
                <p style={styles.name}>{o.studentName}</p>
                <p style={styles.reason}>{o.reason}</p>

                <div style={styles.timeRow}>
                  <span><strong>From:</strong> {new Date(o.fromTime).toLocaleString()}</span>
                  <span><strong>To:</strong> {new Date(o.toTime).toLocaleString()}</span>
                </div>

                <p style={styles.exit}>
                  <strong>Exited At:</strong>{" "}
                  {o.exitTime
                    ? new Date(o.exitTime).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div style={styles.right}>
                <span
                  style={{
                    ...styles.status,
                    backgroundColor: isLate ? "#ffebee" : "#e8f5e9",
                    color: isLate ? "#d32f2f" : "#2e7d32",
                    borderColor: isLate ? "#ffcdd2" : "#c8e6c9"
                  }}
                >
                  {isLate ? "OVERDUE" : "ON TIME"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "800px",
    margin: "30px auto",
    fontFamily: "sans-serif"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2e7d32"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
  },
  left: {
    flex: 1
  },
  name: {
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: "4px"
  },
  reason: {
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "10px"
  },
  timeRow: {
    display: "flex",
    gap: "20px",
    fontSize: "0.8rem",
    marginBottom: "6px",
    color: "#444"
  },
  exit: {
    fontSize: "0.8rem",
    color: "#444"
  },
  right: {
    marginLeft: "15px"
  },
  status: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    border: "1px solid"
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
    color: "#666"
  }
};

export default ActiveOutpasses;
