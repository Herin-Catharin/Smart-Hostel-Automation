import { useState } from "react";
import API from "../../services/api";

const RequestForm = () => {
  const [reason, setReason] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const reasonsList = [
    "Medical",
    "Personal Work",
    "Family Emergency",
    "Official Work",
    "Other"
  ];

  const submitRequest = async () => {
    if (!reason || !fromTime || !toTime) {
      setMsg("Please select reason and times");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await API.post("/outpass/request", {
        reason,
        fromTime,
        toTime,
        status: "pending"
      });

      if (res.status === 201 || res.status === 200) {
        setMsg("Request submitted successfully!");
        setReason("");
        setFromTime("");
        setToTime("");
      } else {
        setMsg("Failed to submit request");
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>Outpass Request</h3>

      {msg && (
        <div
          style={{
            ...styles.message,
            backgroundColor: msg.includes("success") ? "#e8f5e9" : "#ffebee",
            color: msg.includes("success") ? "#2e7d32" : "#d32f2f",
            borderColor: msg.includes("success") ? "#c8e6c9" : "#ffcdd2"
          }}
        >
          {msg}
        </div>
      )}

      <div style={styles.field}>
        <label style={styles.label}>Reason</label>
        <select
          style={styles.input}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">-- Select Reason --</option>
          {reasonsList.map((r, idx) => (
            <option key={idx} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>From Time</label>
        <input
          type="datetime-local"
          style={styles.input}
          value={fromTime}
          onChange={(e) => setFromTime(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>To Time</label>
        <input
          type="datetime-local"
          style={styles.input}
          value={toTime}
          onChange={(e) => setToTime(e.target.value)}
        />
      </div>

      <button
        style={{
          ...styles.button,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer"
        }}
        onClick={submitRequest}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "420px",
    margin: "30px auto",
    padding: "25px",
    borderRadius: "12px",
    backgroundColor: "#f9fff9",
    border: "1px solid #c8e6c9",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    fontFamily: "sans-serif"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2e7d32"
  },
  field: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.85rem",
    color: "#555",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.9rem"
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2e7d32",
    color: "#fff",
    fontWeight: "bold",
    marginTop: "10px"
  },
  message: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid",
    fontSize: "0.85rem",
    marginBottom: "15px",
    textAlign: "center"
  }
};

export default RequestForm;
