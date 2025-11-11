import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createApi } from "../function/api";
import Cookies from "js-cookie";
import axios from "axios";
import WaitingOverlay from "../component/WaitingOverlay";
import RestaurantDetail from "../component/restaurantDetail";
const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Preview() {
  const [auth, SetAuth] = useState(null); // null first
  const [basicInfo, SetInfo] = useState({});
  const [types, setType] = useState([]);
  const [days, setDay] = useState([]);
  const [currentDay, setCurrentDay] = useState(null);
  const [status, setStatus] = useState("");
  const [currentLoc, setCurrentLoc] = useState("");
  const [isEmergency, setEmergency] = useState(false);
  const [delivery, setDelivery] = useState([]);
  const [menus, setMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth === false) navigate("/Login");
  }, [navigate, auth]);

  const CheckAuth = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("token not found.");

      setStatus('waiting');
      const api = createApi("RestaurantPage");
      const Result = await axios.get(api, { params: { token } });

      if (Result.data.role !== "Restaurant") {
        Cookies.remove("token");
        throw new Error("Not Restaurant");
      }

      const newData = Result.data.userData;
      setEmergency(newData.emergency || false);
      SetInfo(newData);
      setCurrentLoc(newData.location);
      setType(Result.data.types);
      setDay(Result.data.days);
      setDelivery(Result.data.delivery);
      setMenu(Result.data.menu);

      SetAuth(true);
    } catch {
      SetAuth(false);
    } finally {
      setStatus("");
    }
  };

  useEffect(() => {
    CheckAuth();
  }, []);

  useEffect(() => {
    const d = new Date();
    const day = d.getDay()
    setCurrentDay(days.find(d => d.day === dayArr[day]) ?? null);
  }, [days]);
 

  return (
    <div className="fullPageContainer">
      {auth === true ? (
        <RestaurantDetail
          status="Preview"
          info={basicInfo}
          days={days}
          types={types}
          currentDay={currentDay}
          location={currentLoc}
          isEmergency={isEmergency}
          delivery={delivery}
          menus={menus}
        />
      ) : null}

      <WaitingOverlay status={status} />
    </div>
  )

}
