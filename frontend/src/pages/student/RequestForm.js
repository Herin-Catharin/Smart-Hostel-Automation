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
        status: "pending" // default status for warden approval
      });

      if (res.status === 201 || res.status === 200) {
        setMsg("Request submitted successfully!");
        // Reset form
        setReason("");
        setFromTime("");
        setToTime("");
      } else {
        setMsg("Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", marginTop: "20px" }}>
      <h3>Outpass Request Form</h3>

      {msg && <p style={{ color: msg.includes("success") ? "green" : "red" }}>{msg}</p>}

      <div style={{ marginBottom: "10px" }}>
        <label>Reason:</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">-- Select Reason --</option>
          {reasonsList.map((r, idx) => (
            <option key={idx} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>From Time:</label>
        <input
          type="datetime-local"
          value={fromTime}
          onChange={(e) => setFromTime(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>To Time:</label>
        <input
          type="datetime-local"
          value={toTime}
          onChange={(e) => setToTime(e.target.value)}
        />
      </div>

      <button onClick={submitRequest} disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
};

export default RequestForm;
