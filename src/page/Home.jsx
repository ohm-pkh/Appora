import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { createApi } from '../function/api';
import '../style/home.css'
import { Nav } from '../component/nav';
import SearchBar from '../component/searchBar';
import WaitingOverlay from '../component/WaitingOverlay';
import RestaurantNotFound from '../component/restaurantNotFound';
import { RestaurantContainer } from '../component/restaurantContainer';
import { OverlayHomePage,FilterOverlay } from '../component/Overlay';

export default function Home() {
    const [auth, SetAuth] = useState(false);
    const [status, setStatus] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null });
    const [overlay, setOverlay] = useState({ status: false });
    const [search, setSearch] = useState('');
    const [types, setTypes] = useState([]);
    const [categories, setCategory] = useState([]);
    const [filter, setFilter] = useState({ type: [], category: [], price: null, distance: null });
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
            const result = await axios.get(api, { params: { search } });
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
            setCurrentLocation({ lat, lon })
        });
    }

    function navToRestaurantDetail(id) {
        navigate(`/RestaurantDetail/${id}`);
    }

    function StartOverlay(act) {
        setOverlay({ status: true, action: act });
    }

    function onSearch() {
        getRestaurant();
    }

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

    function getFilter() {
        const filterData = localStorage.getItem('filter');

        if (filterData) {
            try {
                const parsed = JSON.parse(filterData);
                setFilter(parsed);
            } catch (e) {
                console.error('filter corrupted', e);
                setFilter({ type: [], category: [] });
            }
        } else {
            setFilter({ type: [], category: [] });
        }
    }

    async function getCategories(){
        try{
            setStatus('waiting');
            const api = createApi('Menu');
            const result = await axios.get(api);
            setCategory(result.data.category);
        }catch(e){
            console.log(e);
        }finally{
            setStatus('');
        }
    }
    function saveFilter(new_filter){
        localStorage.setItem('filter', JSON.stringify(new_filter));
        setFilter(new_filter);
    }

    useEffect(() => {
        CheckAuth();
        getRestaurant();
        getLocation();
        getTypes();
        getCategories();
        getFilter();
    }, []);

    return (
        <div className="fullPageContainer" style={{ gap: '0' }}>
            <Nav auth={auth} doLogout={Logout} openFilter={()=>StartOverlay('Filter')}/>

            <SearchBar onSearch={onSearch} onChange={(text) => setSearch(text.trim())} />

            <div className='restaurantMainContainer'>
                {restaurants && restaurants.length > 0 ? (
                    restaurants.map(restaurant => (
                        <RestaurantContainer auth={auth} data={restaurant} currentLocation={currentLocation} key={restaurant.id} onContainerClick={(id) => navToRestaurantDetail(id)} setOverlay={(act) => StartOverlay(act)} filter={filter}/>
                    ))
                ) :
                    <RestaurantNotFound />
                }

            </div>
            {overlay.status===true&&overlay.action==='Filter'?<FilterOverlay status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })} Go={(path) => navigate(path)} types={types} categories={categories} filter={filter} onSave={saveFilter}/>
                :<OverlayHomePage status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })} Go={(path) => navigate(path)} types={types} categories={categories} filter={filter} onSave={saveFilter}/>
            }
            
            
            <WaitingOverlay status={status} />
        </div>
    )

}