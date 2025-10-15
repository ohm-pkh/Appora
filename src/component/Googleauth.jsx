import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { createApi } from "../function/api";
import WaitingOverlay from "./WaitingOverlay";
import axios from "axios";
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
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const hasRun = useRef(false); // 👈 prevents running twice

  const handleClick = () => {
    const callbackUrl = `${window.location.origin}/Appora/${
      window.location.href.includes("Login") ? "Login" : "SignUp"
    }`;
    const googleClientId =
      "788574260421-l5081sfbvbop11slc42rtqupor1lbio6.apps.googleusercontent.com";

    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=id_token&client_id=${googleClientId}&scope=openid%20email%20profile`;

    window.location.href = targetUrl;
  };

  useEffect(() => {
    // prevent double execution on re-render or remount
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchUserInfo = async () => {
      const idTokenRegex = /id_token=([^&]+)/;
      const isMatch = window.location.href.match(idTokenRegex);

      if (!isMatch) return; // no token found → skip

      const idToken = isMatch[1];
      try {
        setStatus("waiting");

        const api = createApi("Gauth");
        const result = await axios.post(api, { token: idToken });

        setStatus("");
        Cookies.set("token", result.data.token, { expires: 7 });

        if (result.data.role === "Restaurant") {
          navigate("/RestaurantPage");
        } else {
          navigate("/");
        }
      } catch (err) {
        const email = err.response?.data?.email;
        const status = err.response?.status;

        setStatus("");

        if (email && status === 403) {
          alert("Please verify your account.");
          navigate(`/RestaurantVerify/${email}`);
        } else if (email) {
          alert("Account not found. Please sign up.");
          navigate(`/SignUp/${email}`);
        } else {
          console.error("Failed to fetch user info:", err);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return (
    <>
      <button style={style} onClick={handleClick}>
        <img src={G} alt="Google logo" width={20} height={20} />
        <span>Sign in with Google</span>
      </button>

      <WaitingOverlay status={status} />
    </>
  );
}