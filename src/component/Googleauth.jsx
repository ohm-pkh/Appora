import { useEffect, useState } from "react";
import G from "../assets/G_logo.svg";

const style = {
  backgroundColor: "white",
  border: "1px solid #D9D9D9",
  color: "#000000",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  padding: "8px 16px",
  cursor: "pointer",
};

export default function GButton() {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // โหลด Google Identity SDK และ initialize แค่ครั้งเดียว
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        setSdkLoaded(true);
        window.google.accounts.id.initialize({
          client_id:
            "788574260421-l5081sfbvbop11slc42rtqupor1lbio6.apps.googleusercontent.com", // ใส่ Client ID ของคุณ
          callback: (response) => {
            console.log("Google ID Token:", response.credential);
            alert("Signed in successfully!");
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = () => {
    if (!sdkLoaded || !window.google) {
      alert("Google SDK ยังโหลดไม่เสร็จ!");
      return;
    }

    // แสดง popup login
    window.google.accounts.id.prompt();
  };

  return (
    <button style={style} onClick={handleGoogleSignIn}>
      <img src={G} alt="Google logo" width={20} height={20} />
      <span>Sign in with Google</span>
    </button>
  );
}
