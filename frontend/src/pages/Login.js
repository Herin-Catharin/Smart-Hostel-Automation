import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });
      let { access_token, role, user } = res.data;

      role = role.toLowerCase();
      login(access_token, role, user);
      navigate(`/${role}`, { replace: true });
    } catch (err) {
      setMsg(err.response?.data?.msg || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Dynamic Animated Background */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={styles.floatingGlow} 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        style={styles.loginCard}
      >
        <div style={styles.headerArea}>
          <motion.div 
            whileHover={{ rotate: 15 }}
            style={styles.logoBox}
          >
            <div style={styles.logoInner} />
          </motion.div>
          <h2 style={styles.title}>Outpass Portal</h2>
          <p style={styles.subtitle}>Enter your credentials to access the system</p>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={styles.errorBox}
            >
              {msg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "#3d9b42" }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading} 
            style={styles.button}
          >
            {loading ? "Authenticating..." : "Continue"}
          </motion.button>
        </form>

        <p style={styles.footerText}>
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  floatingGlow: {
    position: "absolute",
    width: "80vw",
    height: "80vw",
    background: "radial-gradient(circle, rgba(76, 175, 80, 0.05) 0%, rgba(255, 255, 255, 0) 60%)",
    top: "-20%",
    right: "-10%",
    zIndex: 0
  },
  loginCard: {
    zIndex: 1,
    width: "100%",
    maxWidth: "380px",
    padding: "48px",
    backgroundColor: "#ffffff",
    borderRadius: "40px",
    boxShadow: "0 40px 100px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f0",
  },
  headerArea: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    marginBottom: "40px" 
  },
  logoBox: {
    width: "56px",
    height: "56px",
    backgroundColor: "#4CAF50",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    boxShadow: "0 10px 20px rgba(76, 175, 80, 0.2)"
  },
  logoInner: {
    width: "20px",
    height: "20px",
    border: "3px solid white",
    borderRadius: "6px"
  },
  title: { 
    fontSize: "24px", 
    fontWeight: "700", 
    color: "#111", 
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px"
  },
  subtitle: { 
    color: "#888", 
    fontSize: "14px", 
    textAlign: "center", 
    lineHeight: "1.5" 
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  inputContainer: { width: "100%" },
  input: {
    width: "100%",
    padding: "18px 24px",
    backgroundColor: "#f5f5f7",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    color: "#000",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1.5px solid transparent",
  },
  button: {
    width: "100%",
    padding: "18px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "16px",
    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.15)"
  },
  errorBox: {
    padding: "14px",
    backgroundColor: "#fff1f0",
    color: "#ff4d4f",
    borderRadius: "16px",
    fontSize: "13px",
    marginBottom: "20px",
    border: "1px solid #ffa39e",
    textAlign: "center"
  },
  footerText: { 
    marginTop: "40px", 
    textAlign: "center", 
    fontSize: "12px", 
    color: "#bbb",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "1px"
  }
};

export default Login;