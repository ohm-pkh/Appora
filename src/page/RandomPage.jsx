
import { NavRandom } from "../component/nav"
import randomSvg from '../assets/randomSvg.svg'
import Filter from '../component/filter'
import { useState, useEffect } from "react"
import { createApi } from "../function/api"
import WaitingOverlay from "../component/WaitingOverlay"
import axios from "axios"
import { distanceKm } from "../function/distanceCalCir"
import OverlayRestaurantPage from "../component/Overlay"

export default function RandomPage() {
    const defaultFilter = { type: [], category: [], price: null, distance: 5 };
    const [currentFilter, setCurrentFilter] = useState(() => {
        const saved = localStorage.getItem('filter');
        return saved ? JSON.parse(saved) : defaultFilter;
    });
    const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null });
    const [types, setTypes] = useState([]);
    const [overlay,setOverlay] = useState({status:false})
    const [categories, setCategory] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!currentFilter.distance) {
            setCurrentFilter(prev => ({ ...prev, distance: 5 }));
        }
    }, [currentFilter]);

    async function getTypes() {
        try {
            setStatus('waiting');
            const api = createApi('Type');
            const result = await axios.get(api, { params: { types: '' } });
            setTypes(result.data.types);
        } finally {
            setStatus('');
        }
    }
    async function getRestaurant() {
        try {
            setStatus('waiting')
            const api = createApi('Restaurants');
            const result = await axios.get(api, { params: { search: '' } });
            console.log(result.data);
            adjustRestaurant(result.data)
        } catch {
            console.log('get restaurant fail.');
        } finally {
            setStatus("")
        }
    }
    async function getCategories() {
        try {
            setStatus('waiting');
            const api = createApi('Menu');
            const result = await axios.get(api);
            setCategory(result.data.category);
        } catch (e) {
            console.log(e);
        } finally {
            setStatus('');
        }
    }

    function adjustRestaurant(data) {
        setStatus('waiting');
        try {
            const newRestaurants = data.map(res => {
                const d = distanceKm(currentLocation.lat, currentLocation.lon, res.lat, res.lon);
                console.log("cf",currentFilter)
                const filterPrice = parseInt('9'.repeat(currentFilter.price));
                console.log(filterPrice);
                const isUse = [
                    () => currentFilter.type.length === 0 || currentFilter.type.some(t => res.types.some(x => x.id === t)),

                    () => currentFilter.category.length === 0 || currentFilter.category.some(t => res.categories.some(x => x.id === t)),

                    () => !currentFilter.price || (Number(res.min_price) <= filterPrice),

                    () => !currentFilter.distance || d <= currentFilter.distance,

                    () => d <= 5
                ].every(fn => fn());

                return { ...res, isUse };
            });
            setRestaurants(newRestaurants);
        }finally{
            setStatus('')
        }
        
    }

    function StartOverlay(act) {
        if(!currentLocation){
            alert(`We can't track your location. please try again.`);
            getLocation();
            return;
        }
        setOverlay({ status: true, action: act });
    }

    function getLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            setCurrentLocation({ lat, lon })
        });
    }





    useEffect(() => {
        adjustRestaurant(restaurants)
    }, [currentFilter])

    useEffect(() => {
        getLocation();
        getRestaurant();
        getTypes();
        getCategories();
    }, []);
    return (
        <div className="fullPageContainer" style={{ gap: '0' }}>
            <NavRandom />
            <button style={{ backgroundColor: 'white', color: 'black', borderColor: 'black', width: '95vw', margin: '0.5em auto', display: 'flex', justifyContent: 'center', justifySelf: 'center' }} 
            onClick={()=>StartOverlay('allRandom')}>
                <span style={{ display: "flex", justifyContent: 'center' }}>
                    <img src={randomSvg} alt="random" />
                </span>
                <h3 style={{ margin: '0' }}>Random</h3>
            </button>
            <Filter filter={currentFilter} types={types} categories={categories} onSave={(data) => setCurrentFilter(data)} />
            <OverlayRestaurantPage
                status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })}
                data={restaurants} currentLocation={currentLocation}
            />
            <WaitingOverlay status={status} />
        </div>
    )
}