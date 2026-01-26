import { useState } from "react";
import Home from "../security/Home";
import VerifyQR from "./VerifyQR";
import ActiveOutpass from "../security/ActiveOutpasses";
import Header from "../../components/Header";

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Dashboard Home" },
    { id: "verify", label: "Scan & Verify QR" },
    { id: "active", label: "Active Tracking" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "verify":
        return <VerifyQR />;
      case "active":
        return <ActiveOutpass />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={styles.dashboardWrapper}>
      <Header title="Security Portal" />

      {/* Navigation Bar */}
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
        <div style={styles.fadeSlideIn}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa", // Light gray background
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
    maxWidth: "600px", // Smaller max width for security (fewer tabs)
  },
  navButton: {
    flex: 1,
    padding: "18px 12px",
    border: "none",
    outline: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "700",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  contentArea: {
    maxWidth: "1000px", // Wider for data tables
    margin: "0 auto",
    padding: "20px",
  },
  fadeSlideIn: {
    animation: "fadeIn 0.3s ease-in-out",
  }
};

export default SecurityDashboard;