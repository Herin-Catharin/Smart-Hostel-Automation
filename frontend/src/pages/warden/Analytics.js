import { useEffect, useState } from "react";
import API from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const BAR_COLORS = ["#A8E6CF", "#FFB7B2", "#FFE29A"];
const PIE_COLORS = ["#BEE7E8", "#E1C6F3"];

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const res = await API.get("/outpass/all_requests");
      const data = res.data.requests || [];

      let approved = 0, rejected = 0, pending = 0;
      let late = 0, active = 0;

      data.forEach(r => {
        if (r.status === "approved") approved++;
        if (r.status === "rejected") rejected++;
        if (r.status === "pending") pending++;
        if (r.lateReturn) late++;
        if (r.scannedExit && !r.scannedEntry) active++;
      });

      setStats({
        total: data.length,
        approved,
        rejected,
        pending,
        late,
        active
      });
    };

    loadAnalytics();
  }, []);

  if (!stats) return <p style={{ padding: 20 }}>Loading analytics...</p>;

  const statusData = [
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
    { name: "Pending", value: stats.pending }
  ];

  return (
    <div style={page}>
      <h2 style={title}>Outpass Analytics</h2>

      {/* KPI CARDS */}
      <div style={kpiGrid}>
        <KPI title="Total Requests" value={stats.total} />
        <KPI title="Approved" value={stats.approved} color="#7ACFA3" />
        <KPI title="Rejected" value={stats.rejected} color="#F29A94" />
        <KPI title="Pending" value={stats.pending} color="#E6C86A" />
        <KPI title="Students Outside" value={stats.active} color="#8FCFD1" />
        <KPI title="Late Returns" value={stats.late} color="#B8A1D9" />
      </div>

      {/* CHARTS */}
      <div style={chartGrid}>
        <ChartCard title="Request Status Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" tick={{ fill: "#888" }} />
              <YAxis tick={{ fill: "#888" }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Late vs On-Time Returns">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={[
                  { name: "On Time", value: stats.approved - stats.late },
                  { name: "Late", value: stats.late }
                ]}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                label
              >
                <Cell fill={PIE_COLORS[0]} />
                <Cell fill={PIE_COLORS[1]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const KPI = ({ title, value, color = "#555" }) => (
  <div style={kpiCard}>
    <p style={kpiTitle}>{title}</p>
    <h2 style={{ ...kpiValue, color }}>{value}</h2>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div style={chartCard}>
    <h4 style={chartTitle}>{title}</h4>
    {children}
  </div>
);

/* ---------- STYLES ---------- */

const page = {
  padding: "24px",
  background: "#f6f8fc",
  minHeight: "100vh"
};

const title = {
  marginBottom: "20px",
  color: "#333"
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "28px"
};

const kpiCard = {
  background: "#ffffff",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)"
};

const kpiTitle = {
  fontSize: "0.85rem",
  color: "#888"
};

const kpiValue = {
  marginTop: "6px",
  fontSize: "2rem",
  fontWeight: "bold"
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
  gap: "22px"
};

const chartCard = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.08)"
};

const chartTitle = {
  marginBottom: "14px",
  color: "#555"
};

export default Analytics;
