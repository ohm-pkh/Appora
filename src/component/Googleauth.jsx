import { useEffect, useState } from "react";
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
  const [click, setClick] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    const callbackUrl = `${window.location.origin}/Appora/${(window.location.href).includes("Login") ? 'Login' : 'SignUp'}`;
    const googleClientId =
      "788574260421-l5081sfbvbop11slc42rtqupor1lbio6.apps.googleusercontent.com";
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=id_token&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
    setClick(true);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const idTokenRegex = /id_token=([^&]+)/;
      const isMatch = window.location.href.match(idTokenRegex);

      if (isMatch) {
        const idToken = isMatch[1];
        try {
          setStatus("waiting");
          const api = createApi('Gauth');
          const Result = await axios.post(api, {
            token: idToken
          })
          setStatus("");
          Cookies.set('token', Result.data.token, { expires: 7 });
          if (Result.data.role === 'Restaurant') {
            navigate('/RestaurantPage');
          } else {
            navigate('/');
          }
          // const response = await fetch(
          //   `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
          // );
          // const data = await response.json();
          // console.log("Google user info:", data);
        } catch (err) {
          if(err.response.data.email&&err.status == 403){
            alter('Please Verify your account.');
            navigate('/RestaurantVerify/',err.response.data.email);
          }
          console.error("Failed to fetch user info:", err);
          navigate(`/SignUp/${err.response.data.email}`);
        }
      }
    };

    fetchUserInfo();
  }, [navigate, click]);


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
