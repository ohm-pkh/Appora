import { NavCart } from "../component/nav.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createApi } from "../function/api.js";
import WaitingOverlay from "../component/WaitingOverlay.jsx";
import RestaurantNotFound from "../component/restaurantNotFound.jsx";
import axios from "axios";
import Cookies from "js-cookie";
import { InCartRestaurantContainer } from "../component/restaurantContainer.jsx";
import { distanceKm } from "../function/distanceCalCir.js";
import '../style/Cart.css'
import OverlayRestaurantPage from "../component/Overlay.jsx";

function CompContainer({ data, compareTag }) {
    const [placeOfRestaurant, setPlaceRestaurant] = useState({});

    useEffect(() => {
        let i = 1;
        const newPlaces = {};
        const name = { distance: "Shortest Displacement", price: 'Lowest price', rating: 'Rating', duration: 'ETA' }

        for (const k in compareTag) {
            for (const k2 in compareTag[k]) {
                if (compareTag[k][k2].id === data.id) {
                    newPlaces[name[k2]] = i;
                }
            }
            i += 1;
        }

        setPlaceRestaurant(newPlaces);
    }, [data.id, compareTag]);

    return (
        <div className="CompContainer">
            {placeOfRestaurant ? Object.entries(placeOfRestaurant).map(([field, slot]) => (
                <div key={field}>
                    #{slot} {field}
                </div>
            )) :
                'No ranking'
            }
        </div>
    );
}

export default function CartPage() {
    const [status, setStatus] = useState("");
    const [auth, SetAuth] = useState(true);
    const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null });
    const [restaurants, setRestaurants] = useState([]);
    const [compareTag, setCompTag] = useState({
        st: { distance: { id: null, value: null }, price: { id: null, value: null }, rating: { id: null, value: null }, duration: { id: null, value: null } },
        nd: { distance: { id: null, value: null }, price: { id: null, value: null }, rating: { id: null, value: null }, duration: { id: null, value: null } },
        rd: { distance: { id: null, value: null }, price: { id: null, value: null }, rating: { id: null, value: null }, duration: { id: null, value: null } },
    });
    const [overlay, setOverlay] = useState({ status: false });

    const navigate = useNavigate();


    const CheckAuth = async () => {
        try {
            setStatus('waiting')
            const token = Cookies.get('token');
            if (!token) {
                throw new Error("token not found.");
            }
            const api = createApi('Login');
            const Result = await axios.get(api, {
                params: {
                    token
                }
            })

            if (Result.data.role !== 'User') {
                Cookies.remove('token');
                throw new Error("Not user");
            }
            getLocation();
            SetAuth(true)
        } catch {
            SetAuth(false);
        } finally {
            setStatus("")
        }
    }

    function getLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            setCurrentLocation({ lat, lon })
        });
    }

    async function getCartRestaurant() {
        try {
            setStatus('waiting')
            const token = Cookies.get('token');
            if (!token) {
                throw new Error("token not found.");
            }
            const api = createApi('CartRestaurant');
            const Result = await axios.get(api, {
                params: {
                    token
                }
            })
            console.log(Result.data.cartItems);
            setRestaurants(Result.data.cartItems);
        } catch (e) {
            console.log(e)
        } finally {
            setStatus('')
        }
    }

    function StartOverlay(act) {
        setOverlay({ status: true, action: act });
    }

    useEffect(() => {
        if (auth === false) {
            navigate('/');
        }
    }, [auth, navigate])

    async function unCart(id) {
        try {
            setStatus('waiting');
            const token = Cookies.get('token');
            const api = createApi('Cart');
            await axios.delete(api, { params: { token, restaurant_id: id } });
            setRestaurants(prev => prev.filter(res => res.id !== id));
        } catch (e) {
            console.log(e);
        } finally {
            setStatus('');
        }
    }

    function cartOnClick(restaurant_id) {
        unCart(restaurant_id);
    }

    function navToRestaurantDetail(id) {
        navigate(`/RestaurantDetail/${id}`);
    }

    function getTag() {
        const usedIds = new Set();
        const transport_time_info = JSON.parse(localStorage.getItem('Transport') || '[]');

        const updatedCompareTag = { ...compareTag };

        restaurants.forEach(r => {
            if (usedIds.has(r.id)) return; // skip if already used

            const distance = Math.round(distanceKm(currentLocation.lat, currentLocation.lon, r.lat, r.lon));
            const duration = transport_time_info.find(t => t.id === r.id)?.transport_time ?? 0;
            const rating = r.rating ?? 0;
            const min = parseInt(r.min_price) || 0;
            const max = parseInt(r.max_price) || 0;
            const price = (min + max)/2;

            const consider = {
                distance: { id: r.id, value: distance },
                duration: { id: r.id, value: duration },
                rating: { id: r.id, value: rating },
                price: { id: r.id, value: price }
            };

            for (const slotKey in updatedCompareTag) {
                const place = { ...updatedCompareTag[slotKey] };

                // remove restaurants that no longer exist
                for (const field in place) {
                    if (place[field].id && !restaurants.some(res => res.id === place[field].id)) {
                        place[field] = { id: null, value: null };
                    }
                }

                // skip if this slot already contains this restaurant
                const alreadyExists = Object.values(place).some(field => usedIds.has(field?.id));
                if (alreadyExists) continue;

                // assign values
                for (const field in place) {
                    const current = place[field];
                    if (current.value == null || consider[field].value > current.value) {
                        place[field] = { ...consider[field] };
                    }
                }

                updatedCompareTag[slotKey] = place;
                usedIds.add(r.id); // mark this restaurant as used
                break; // stop after placing in one slot
            }
        });

        setCompTag(updatedCompareTag);
        console.log('Updated compareTag', updatedCompareTag);
    }


    useEffect(() => {
        getTag();
    }, [restaurants])


    useEffect(() => {
        CheckAuth();
        getCartRestaurant();
    }, []);

    return (
        <div className="fullPageContainer" style={{ gap: '0' }}>
            <NavCart onRandom={restaurants && restaurants.length !== 0 ? () => StartOverlay('inCartRandom') : () => setOverlay({ status: false })} />
            <div className='restaurantMainContainer'>
                {restaurants && restaurants.length > 0 ? (
                    restaurants.map(r => (
                        <div className="InCartCardCompContainer" key={r.id}>
                            <InCartRestaurantContainer cartOnClick={cartOnClick} data={r} currentLocation={currentLocation} onContainerClick={(id) => navToRestaurantDetail(id)} />
                            <CompContainer data={r} compareTag={compareTag} />
                        </div>

                    ))
                ) :
                    <RestaurantNotFound />
                }

            </div>
            <OverlayRestaurantPage
                status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })}
                data={restaurants} currentLocation={currentLocation}
            />

            <WaitingOverlay status={status} />
        </div>
    )
}