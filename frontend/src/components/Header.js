import React from "react";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth(); 

  // Map role to Portal Title
  const portalMap = {
    student: "Student Portal",
    warden: "Warden Portal",
    security: "Security Portal"
  };

  const currentRole = user?.role?.toLowerCase();
  const leftTitle = portalMap[currentRole] || "Outpass Portal";
  const displayName = user?.username || "User";

  return (
    <header style={styles.header}>
      <div style={styles.logoSection}>
        <div style={styles.accentBar} />
        <h2 style={styles.title}>{leftTitle}</h2>
      </div>

      <div style={styles.profileSection}>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{displayName}</span>
          <span style={styles.userRole}>{user?.role?.toUpperCase() || "PORTAL"}</span>
        </div>
        
        <img
          src={`https://ui-avatars.com/api/?name=${displayName}&background=4CAF50&color=fff&bold=true`}
          alt="profile"
          style={styles.avatar}
        />
        
        <div style={styles.divider} />
        <LogoutButton />
      </div>
    </header>
  );
};

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 30px", backgroundColor: "#ffffff", borderBottom: "1px solid #edf2f7", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", fontFamily: "'Segoe UI', sans-serif" },
  logoSection: { display: "flex", alignItems: "center", gap: "12px" },
  accentBar: { width: "4px", height: "24px", backgroundColor: "#4CAF50", borderRadius: "2px" },
  title: { margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "#2d3748" },
  profileSection: { display: "flex", alignItems: "center", gap: "15px" },
  userInfo: { display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: "5px" },
  userName: { fontSize: "0.95rem", fontWeight: "600", color: "#2d3748" },
  userRole: { fontSize: "0.7rem", fontWeight: "800", color: "#a0aec0", letterSpacing: "0.5px" },
  avatar: { width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #f7fafc" },
  divider: { width: "1px", height: "28px", backgroundColor: "#edf2f7", margin: "0 5px" },
};

export default Header;