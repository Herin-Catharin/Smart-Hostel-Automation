import { useState } from "react";
import Header from "../../components/Header";
import Home from "./Home";
import RequestForm from "./RequestForm";
import StatusTracking from "./StatusTracking";
import ActiveOutpass from "./ActiveOutpass";
import History from "./History";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home" },
    { id: "request", label: "New Request" },
    { id: "status", label: "Status" },
    { id: "active", label: "Active Outpass" },
    { id: "history", label: "History" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <Home />;
      case "request": return <RequestForm />;
      case "status": return <StatusTracking />;
      case "active": return <ActiveOutpass />;
      case "history": return <History />;
      default: return <Home />;
    }
  };

  return (
    <div style={styles.dashboardWrapper}>
      <Header title="Student Portal" />

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
    backgroundColor: "#f8f9fa",
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
    maxWidth: "800px",
    overflowX: "auto", // Scrollable on mobile
    scrollbarWidth: "none", // Hide scrollbar for clean look
  },
  navButton: {
    flex: 1,
    padding: "16px 12px",
    border: "none",
    outline: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  contentArea: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  fadeSlideIn: {
    animation: "fadeIn 0.4s ease-out",
  }
};

export default StudentDashboard;