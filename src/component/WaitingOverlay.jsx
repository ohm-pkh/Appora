
import React from "react";
import '../style/Overlay.css'

const WaitingOverlay = ({ status }) => {
  if (status !== "waiting") return null; // show only when waiting

  return (
    <div className="overlayBackground">
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px 30px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #000000",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            marginBottom: "15px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Loading, please wait...</p>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default WaitingOverlay;

