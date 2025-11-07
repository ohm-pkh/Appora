import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom'
import { createApi } from '../function/api';
import '../style/home.css'
import { Nav } from '../component/nav';
import SearchBar from '../component/searchBar';
import WaitingOverlay from '../component/WaitingOverlay';
import RestaurantNotFound from '../component/restaurantNotFound';
import { RestaurantContainer } from '../component/restaurantContainer';
import { OverlayHomePage } from '../component/Overlay';

export default function Home() {
    const [auth, SetAuth] = useState(false);
    const [status, setStatus] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({lat:null,lon:null});
    const [overlay, setOverlay] = useState({ status: false });
    const navigate = useNavigate();

    const CheckAuth = async () => {
        try {
            setStatus('waiting')
            const token = Cookies.get('token');
            if (!token) {
                throw new Error("token not found.");
            }
            const api = createApi('LogIn');
            const Result = await axios.get(api, {
                params: {
                    token
                }
            })

            if (Result.data.role !== 'User') {
                Cookies.remove('token');
                throw new Error("Not user");
            }
            SetAuth(true)
        } catch {
            SetAuth(false);
        } finally {
            setStatus("")
        }
    }

    async function getRestaurant() {
        try {
            setStatus('waiting')
            const api = createApi('Restaurants');
            const result = await axios.get(api);
            console.log(result.data);
            setRestaurants(result.data);
        } catch {
            console.log('get restaurant fail.');
        } finally {
            setStatus("")
        }
    }

    function Logout() {
        Cookies.remove('token');
        SetAuth(false);
    }

    function getLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            setCurrentLocation({lat,lon})
        });
    }

    function navToRestaurantDetail(id){
        navigate(`/RestaurantDetail/${id}`);
    }

    function StartOverlay(act) {
        setOverlay({ status: true, action: act });
    }

    useEffect(() => {
        CheckAuth();
        getRestaurant();
        getLocation();
    }, []);

    return (
        <div className="fullPageContainer" style={{ gap: '0' }}>
            <Nav auth={auth} doLogout={Logout} />

            <SearchBar />

            <div className='restaurantMainContainer'>
                {restaurants && restaurants.length > 0 ? (
                    restaurants.map(restaurant => (
                        <RestaurantContainer auth={auth} data={restaurant} currentLocation={currentLocation} key={restaurant.id} onContainerClick={(id)=>navToRestaurantDetail(id)} setOverlay={(act)=>StartOverlay(act)}/>
                    ))
                ) :
                    <RestaurantNotFound />
                }

            </div>

            <OverlayHomePage status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })} Go={(path)=>navigate(path)}/>
            <WaitingOverlay status={status} />
        </div>
    )

}