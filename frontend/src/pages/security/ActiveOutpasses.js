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

  if (loading) return <p>Loading active outpasses...</p>;
  if (active.length === 0) return <p>No students currently out</p>;

  return (
    <div>
      <h3>Active Outpasses (Students Currently Out)</h3>
      {active.map((o) => (
        <div key={o._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p><strong>Student:</strong> {o.studentName} ({o.studentEmail})</p>
          <p><strong>Reason:</strong> {o.reason}</p>
          <p><strong>From:</strong> {new Date(o.fromTime).toLocaleString()}</p>
          <p><strong>To:</strong> {new Date(o.toTime).toLocaleString()}</p>
          <p><strong>Exited At:</strong> {o.exitTime ? new Date(o.exitTime).toLocaleString() : "N/A"}</p>
          {o.qrCode ? (
            <img
              src={`data:image/png;base64,${o.qrCode}`}
              alt="Outpass QR"
              width={150}
            />
          ) : (
            <p>QR not generated</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActiveOutpasses;
