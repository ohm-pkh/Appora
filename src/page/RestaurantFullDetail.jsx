import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createApi } from "../function/api";
import Cookies from "js-cookie";
import axios from "axios";
import WaitingOverlay from "../component/WaitingOverlay";
import RestaurantDetail from "../component/restaurantDetail";
const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RestaurantFullDetail() {
    const [basicInfo, SetInfo] = useState({});
    const [types, setType] = useState([]);
    const [days, setDay] = useState([]);
    const [currentDay, setCurrentDay] = useState(null);
    const [status, setStatus] = useState("");
    const [currentLoc, setCurrentLoc] = useState("");
    const [isEmergency, setEmergency] = useState(false);
    const [delivery, setDelivery] = useState([]);
    const [menus, setMenu] = useState([]);
    const { id } = useParams();

    const getDetail = async () => {
        try {
            setStatus('waiting');
            const api = createApi("RestaurantDetail");
            const Result = await axios.get(api, { params: { id } });

            const newData = Result.data.userData;
            console.log(Result);
            setEmergency(newData.emergency || false);
            SetInfo(newData);
            setCurrentLoc(newData.location);
            setType(Result.data.types);
            setDay(Result.data.days);
            setDelivery(Result.data.delivery);
            setMenu(Result.data.menu);
        } finally {
            setStatus("");
        }
    };

    useEffect(() => {
        getDetail();
    }, []);

    useEffect(() => {
        const d = new Date();
        const day = d.getDay()
        setCurrentDay(days.find(d => d.day === dayArr[day]) ?? null);
    }, [days]);


    return (
        <div className="fullPageContainer">
            <RestaurantDetail
                info={basicInfo}
                days={days}
                types={types}
                currentDay={currentDay}
                location={currentLoc}
                isEmergency={isEmergency}
                delivery={delivery}
                menus={menus}
            />

            <WaitingOverlay status={status} />
        </div>
    )

}
