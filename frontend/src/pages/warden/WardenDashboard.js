import { useState } from "react";
import Header from "../../components/Header";
import Home from "../warden/Home";
import Requests from "./Requests";
import ActiveOutpasses from "./ActiveOutpasses";
import Alerts from "./Alerts";
import Analytics from "./Analytics";

const WardenDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Overview" },
    { id: "requests", label: "Pending Requests" },
    { id: "active", label: "Active Tracking" },
    { id: "alerts", label: "Late Alerts" },
    { id: "analytics", label: "Analytics" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <Home />;
      case "requests": return <Requests />;
      case "active": return <ActiveOutpasses />;
      case "alerts": return <Alerts />;
      case "analytics": return <Analytics />;
      default: return <Home />;
    }
  };

  return (
    <div style={styles.dashboardWrapper}>
      <Header title="Warden Portal" />

      {/* Modern Tab Navigation */}
      <div style={styles.navContainer}>
        <div style={styles.navBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.navButton,
                color: activeTab === tab.id ? "#4CAF50" : "#95a5a6",
                borderBottom: activeTab === tab.id ? "3px solid #4CAF50" : "3px solid transparent",
                backgroundColor: activeTab === tab.id ? "#f1f8f1" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div style={styles.contentArea}>
        <div style={styles.contentCard}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa", // Light background matching Login/Student/Security
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  navContainer: {
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    padding: "0 20px",
  },
  navBar: {
    display: "flex",
    width: "100%",
    maxWidth: "900px",
    overflowX: "auto",
    scrollbarWidth: "none",
  },
  navButton: {
    flex: 1,
    padding: "18px 12px",
    border: "none",
    outline: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "700",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  contentArea: {
    maxWidth: "1100px", // Wider area for analytics and tables
    margin: "0 auto",
    padding: "30px 20px",
  },
  contentCard: {
    backgroundColor: "transparent", // Let individual components provide cards if needed
    animation: "fadeIn 0.3s ease-in-out",
  }
};

export default WardenDashboard;