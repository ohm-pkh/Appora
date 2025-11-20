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
import { OverlayHomePage, FilterOverlay } from '../component/Overlay';
import getTransportTime from '../function/getTransport';

//test

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
    const [isFilter, setIsFilter] = useState(false);
    const [cart, setCart] = useState([]);
    const [isCart, setIsCart] = useState(false);
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
            getLocation();
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
        StartOverlay('Logout');
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
    function saveFilter(new_filter) {
        localStorage.setItem('filter', JSON.stringify(new_filter));
        setFilter(new_filter);
    }

    async function unCart(id) {
        try {
            setStatus('waiting');
            const token = Cookies.get('token');
            const api = createApi('Cart');
            await axios.delete(api, { params: { token, restaurant_id: id } });
            setCart(prev => prev.filter(cartId => cartId.restaurant_id !== id));
        } catch (e) {
            console.log(e);
        } finally {
            setStatus('');
        }
    }

    async function addCart(id) {
        try {
            setStatus('waiting');
            const token = Cookies.get('token');
            const api = createApi('Cart');
            await axios.post(api, { token, restaurant_id: id });
            setCart(prev => [...prev, { restaurant_id: id }]);
        } catch (e) {
            console.log(e);
        } finally {
            setStatus('');
        }
    }

    async function getCart() {
        if (auth === false) return setCart([]);
        try {
            setStatus('waiting');
            const token = Cookies.get('token');
            const api = createApi('Cart');
            const result = await axios.get(api, { params: { token } });
            console.log('cart:', result);
            setCart(result?.data?.cartItems ?? []);
        } catch (e) {
            console.log(e);
        } finally {
            setStatus('');
        }
    }

    async function updateCartWithTransport() {
        setStatus('waiting')
        let Tcart = JSON.parse(localStorage.getItem('Transport') || '[]');
        console.log("Tcart at start", Tcart)

        Tcart = Tcart.filter(tc => Object.keys(tc).length > 0);

        Tcart = Tcart.filter(tc => cart.some(c => c.restaurant_id === tc.id));

        cart.forEach(item => {
            if (!Tcart.find(tc => tc.id === item.restaurant_id)) {
                Tcart.push({ id: item.restaurant_id });
            }
        });

        const itemsNeedingTransport = Tcart.filter(tc => tc.transport_time === undefined);
        if (currentLocation.lat === null) {
            await getLocation();
        }
        console.log("carts", cart);
        console.log('Tcart', Tcart, 'itemsNeedingTransport', itemsNeedingTransport);
        console.log('current', currentLocation)
        if (itemsNeedingTransport.length > 0) {
            const updatedItems = await getTransportTime({
                currentLocation: currentLocation,
                cart: itemsNeedingTransport
            });

            updatedItems.forEach(item => {
                const index = Tcart.findIndex(tc => tc.id === item.id);
                if (index >= 0) {
                    Tcart[index].transport_time = item.transport_time;
                }
            });

            localStorage.setItem('Transport', JSON.stringify(Tcart));
        }
        setStatus('')
        return Tcart;
    }

    useEffect(() => {
        console.log('Cart has been change:', cart);
        if (!cart || cart.length === 0) {
            setIsCart(false);
        } else {
            setIsCart(true)
        }
        updateCartWithTransport();
    }, [cart])

    useEffect(() => {
        if (auth === true) {
            getCart();
        }
    }, [auth])

    useEffect(() => {
        if (filter.type.length === 0 && filter.category.length === 0 && filter.price === null && filter.distance === null) {
            setIsFilter(false);
        } else {
            setIsFilter(true);
        }
    }, [filter]);


    function cartOnClick(restaurant_id, isCarting) {
        if (!auth) return StartOverlay('Unauth');
        if (isCarting) {
            addCart(restaurant_id);
        } else {
            unCart(restaurant_id);
        }
    }
    function onCartClick() {
        if (!auth) return StartOverlay('Unauth');
        navigate('/Cart');
    }

    useEffect(() => {
        CheckAuth();
        getRestaurant();
        getTypes();
        getCategories();
        getFilter();
    }, []);

    return (
        <div className="fullPageContainer" style={{ gap: '0',maxHeight:'100dvh', overflow:'hidden',paddingBottom:'0'}}>
            <Nav auth={auth} doLogout={Logout} openFilter={() => StartOverlay('Filter')} isCart={isCart} isFilter={isFilter} onCartClick={onCartClick} />

            <SearchBar onSearch={onSearch} onChange={(text) => setSearch(text.trim())} />

            <div className='restaurantMainContainer'>
                {

                    restaurants && restaurants.length > 0 ?
                        (
                            restaurants.map(restaurant => (
                                <RestaurantContainer cartOnClick={cartOnClick} data={restaurant} currentLocation={currentLocation} key={restaurant.id} onContainerClick={(id) => navToRestaurantDetail(id)} filter={filter} cart={cart} unCart={unCart} />
                            ))

                        ) :
                        <RestaurantNotFound />
                }

            </div>
            {overlay.status === true && overlay.action === 'Filter' ? <FilterOverlay status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })} Go={(path) => navigate(path)} types={types} categories={categories} filter={filter} onSave={saveFilter} />
                : <OverlayHomePage status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })} Go={(path) => navigate(path)} types={types} categories={categories} filter={filter} onSave={saveFilter} />
            }


            <WaitingOverlay status={status} />
        </div>
    )

}