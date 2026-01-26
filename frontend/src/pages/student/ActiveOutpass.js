import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ActiveOutpass = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update every minute to ensure the 1-hour removal logic is reactive
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchActiveOutpasses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/outpass/status");
      const active = res.data.requests.filter(
        (o) => o.status === "approved" && !o.scannedEntry
      );
      setOutpasses(active);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOutpasses();
  }, []);

  if (loading) return <div style={styles.center}>Loading active outpasses...</div>;

  // 🕒 FILTER LOGIC: 
  // 1. Keep if it's not expired.
  // 2. If expired but they are ALREADY OUT, keep it (so they can scan back in).
  // 3. If expired, they HAVEN'T left, and it's been > 1 hour, remove it.
  const visibleOutpasses = outpasses.filter((o) => {
    const deadline = new Date(o.toTime);
    const isPastDeadline = currentTime > deadline;
    const hasExited = o.scannedExit;
    const oneHourPast = currentTime - deadline > 3600000; // 1 hour in ms

    if (isPastDeadline && !hasExited && oneHourPast) {
      return false; // Automatically hide after 1 hour of missing exit
    }
    return true;
  });

  if (visibleOutpasses.length === 0) 
    return <div style={styles.center}>No active or approved outpasses found.</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Your Active Outpasses</h3>
      <div style={styles.grid}>
        {visibleOutpasses.map((o) => {
          const isPastDeadline = currentTime > new Date(o.toTime);
          const hasExited = o.scannedExit;
          const isInvalidExit = isPastDeadline && !hasExited;

          // DETERMINING DYNAMIC COLORS
          let cardBorder = "1px solid #2e7d3281"; 
          let cardBg = "#f9fff9"; 
          let statusColor = hasExited ? "blue" : "green";

          if (isInvalidExit) {
            cardBorder = "1px solid #ffcccc"; 
            cardBg = "#fffafa";
            statusColor = "#d32f2f";
          } else if (isPastDeadline && hasExited) {
            cardBorder = "1px solid #ffe0b2"; 
            cardBg = "#fffdf9";
            statusColor = "#ef6c00";
          }

          return (
            <div key={o._id} style={{
              ...styles.card,
              border: cardBorder,
              backgroundColor: cardBg
            }}>
              <div style={styles.info}>
                <p><strong>Reason:</strong> {o.reason}</p>
                <p><strong>From:</strong> {new Date(o.fromTime).toLocaleString()}</p>
                <p><strong>To:</strong> {new Date(o.toTime).toLocaleString()}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: statusColor, fontWeight: "bold" }}>
                    {isInvalidExit 
                      ? "EXPIRED (MISSED EXIT)" 
                      : (isPastDeadline && hasExited) 
                        ? "LATE - RETURN IMMEDIATELY" 
                        : hasExited ? "Currently Out" : "Approved - Ready"}
                  </span>
                </p>
              </div>

              <div style={styles.qrContainer}>
                {isInvalidExit ? (
                  <div style={styles.expiredBox}>
                    <span style={{ fontSize: "2rem" }}>🛑</span>
                    <p style={{ fontSize: "0.7rem", color: "#d32f2f", margin: "5px 0 0", fontWeight: "bold" }}>
                      EXIT WINDOW<br/>CLOSED
                    </p>
                  </div>
                ) : o.qrCode ? (
                  <>
                    <img
                      src={`data:image/png;base64,${o.qrCode}`}
                      alt="Outpass QR"
                      style={{
                        ...styles.qrImage,
                        filter: isPastDeadline ? "grayscale(0.5)" : "none",
                        border: isPastDeadline ? "2px solid #ef6c00" : "1px solid #eee"
                      }}
                    />
                    <p style={{
                      ...styles.qrLabel,
                      color: isPastDeadline ? "#ef6c00" : "#2e7d32"
                    }}>
                      {hasExited ? "Scan to Enter" : "Scan to Exit"}
                    </p>
                  </>
                ) : (
                  <p style={styles.warning}>Generating...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ... Styles stay the same as your provided code
const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" },
  title: { textAlign: "center", marginBottom: "20px", color: "#333" },
  center: { textAlign: "center", marginTop: "50px", fontSize: "1.2rem", color: "#666" },
  grid: { display: "flex", flexDirection: "column", gap: "15px" },
  card: {
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  info: { flex: 1 },
  qrContainer: { 
    textAlign: "center", 
    borderLeft: "1px solid #eee", 
    paddingLeft: "20px",
    minWidth: "140px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  qrImage: { width: "110px", height: "110px", display: "block", borderRadius: "4px" },
  qrLabel: { fontSize: "0.75rem", marginTop: "8px", fontWeight: "bold" },
  expiredBox: {
    width: "110px",
    height: "110px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffebee",
    borderRadius: "8px",
    border: "1px dashed #d32f2f"
  },
  warning: { color: "orange", fontSize: "0.8rem" }
};

export default ActiveOutpass;