import { useEffect } from "react";
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

  const handleClick = () => {
    const callbackUrl = `${window.location}`;
    const googleClientId =
      "788574260421-l5081sfbvbop11slc42rtqupor1lbio6.apps.googleusercontent.com";
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessTokenRegex = /access_token=([^&]+)/;
      const isMatch = window.location.href.match(accessTokenRegex);

      if (isMatch) {
        const accessToken = isMatch[1];
        try {
          const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
          );
          const data = await response.json();
          console.log("Google user info:", data);
        } catch (err) {
          console.error("Failed to fetch user info:", err);
        }
      }
    };

    fetchUserInfo();
  }, []);


  return (
    <button style={style} onClick={handleClick}>
      <img src={G} alt="Google logo" width={20} height={20} />
      <span>Sign in with Google</span>
    </button>
  );
}
