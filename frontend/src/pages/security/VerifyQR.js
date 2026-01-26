import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import API from "../../services/api";

const VerifyQR = () => {
  const videoRef = useRef(null);
  const scanLockRef = useRef(false);
  const controlsRef = useRef(null);

  const [msg, setMsg] = useState("");
  const [scanned, setScanned] = useState(false);
  const [statusType, setStatusType] = useState(""); // 'success', 'error', or 'expired'

  const startScan = async () => {
    const codeReader = new BrowserQRCodeReader();
    setScanned(false);
    setMsg("Align QR code within the frame...");
    setStatusType("");
    scanLockRef.current = false;

    try {
      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      const deviceId = devices[0]?.deviceId;

      const controls = await codeReader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        async (result, err) => {
          if (result && !scanLockRef.current) {
            scanLockRef.current = true; // Prevent double scanning

            try {
              const qrData = JSON.parse(result.text);
              const res = await API.post("/outpass/verify_qr", qrData);
              
              setMsg(res.data.msg || "Verified successfully");
              setStatusType("success");
            } catch (e) {
              const errorMsg = e.response?.data?.msg || "Verification Failed";
              setMsg(errorMsg);
              
              // Highlight if it's specifically an expiry issue
              setStatusType(errorMsg.toLowerCase().includes("expired") ? "expired" : "error");
            } finally {
              setScanned(true);
              if (controls) controls.stop();
            }
          }
        }
      );

      controlsRef.current = controls;
    } catch (e) {
      console.error(e);
      setMsg("Camera access failed. Please check permissions.");
    }
  };

  useEffect(() => {
    startScan();
    return () => {
      if (controlsRef.current) controlsRef.current.stop();
    };
  }, []);

  // Helper to determine text color
  const getMessageStyle = () => {
    if (statusType === "success") return { color: "#2e7d32", backgroundColor: "#e8f5e9" };
    if (statusType === "expired") return { color: "#d32f2f", backgroundColor: "#ffebee", border: "2px solid red" };
    return { color: "#c62828", backgroundColor: "#fff5f5" };
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Gate Security Scanner</h2>

      {!scanned ? (
        <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}>
          <video
            ref={videoRef}
            style={{ width: "100%", height: "auto", display: "block", backgroundColor: "#000" }}
          />
          {/* Scanning Overlay UI */}
          <div style={styles.overlayGuide}></div>
        </div>
      ) : (
        <div style={{ ...styles.resultBox, ...getMessageStyle() }}>
          <h1 style={{ fontSize: "3rem", margin: "0" }}>
            {statusType === "success" ? "✅" : "❌"}
          </h1>
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{msg}</p>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        {scanned ? (
          <button style={styles.button} onClick={startScan}>
            Scan Next Student
          </button>
        ) : (
          <p style={{ color: "#666" }}>Scanning for Outpass QR...</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlayGuide: {
    position: "absolute",
    top: "20%",
    left: "20%",
    right: "20%",
    bottom: "20%",
    border: "2px solid rgba(255,255,255,0.5)",
    boxShadow: "0 0 0 1000px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    pointerEvents: "none"
  },
  resultBox: {
    padding: "30px",
    borderRadius: "12px",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
  }
};

export default VerifyQR;