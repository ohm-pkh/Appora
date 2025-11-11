import { useState, useEffect, useRef, } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { createApi } from '../function/api';
import '../style/restaurantProfile.css';
import ImageInput from '../component/ImgUploader';
import OverlayRestaurantPage from '../component/Overlay';
import WaitingOverlay from '../component/WaitingOverlay';
import DeliveryContainer from '../component/deliveryContainer';
import MenuContainer from '../component/menuContainer';

const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RestaurantPage() {
    const [auth, SetAuth] = useState(true);
    const [basicInfo, SetInfo] = useState({});
    const [types, setType] = useState([]);
    const [days, setDay] = useState([]);
    const [currentDay, setCurrentDay] = useState({});
    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState("");
    const inputRef = useRef(null);
    const [currentLoc, setCurrentLoc] = useState(``);
    const [overlay, setOverlay] = useState({ status: false });
    const [isEmergency, setEmergency] = useState(false);
    const [delivery, setDelivery] = useState([]);
    const [menus, setMenu] = useState([]);
    const [menuEdit, setMenuEdit] = useState([]);
    const [isEditInfo, setIsEditInfo] = useState(false);
    const navigate = useNavigate();
    const originalData = useRef({
        data: null,
        type: null,
        day: null,
        menu: null,
        deli: null,
    });

    let currentNewDeli = useRef(0);
    let currentNewMenu = useRef(0);


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
            const newType = Result.data.types;
            const newDay = Result.data.days;
            const newDeli = Result.data.delivery;
            const newMenu = Result.data.menu;
            console.log(newData);
            originalData.current = {
                data: newData,
                type: newType,
                day: newDay,
                deli: newDeli,
                menu: newMenu,
            };
            setEmergency(newData.emergency || false);
            SetInfo(newData);
            setCurrentLoc(newData.location);
            setType(newType);
            setDay(newDay);
            setDelivery(newDeli);
            setMenu(newMenu)
            console.log('newMenu', newMenu);
            SetAuth(true);
        } catch {
            SetAuth(false);
        } finally {
            setStatus("");
        }
    };

    function Logout() {
        Cookies.remove("token");
        SetAuth(false);
    }

    const handleSelect = ({ lat, lng }) => {
        SetInfo((prev) => ({ ...prev, lat, lon: lng }));
    };

    function startEdit() {
        setEditing(true);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const len = inputRef.current.value.length;
                inputRef.current.setSelectionRange(len, len);
            }
        }, 0);
    }

    function onProfilePicChange(file) {
        SetInfo(prev => ({
            ...prev,
            new_photo_path: 'new_photo',
            photo: file,
        }))
    }


    function finishEdit() {
        setEditing(false);
    }

    function cancelEdit() {
        if (inputRef.current) {
            inputRef.current.value = basicInfo.name;
        }
        setEditing(false);
    }

    function handleDescriptionChange(e) {
        SetInfo({ ...basicInfo, description: e.target.value });
    }

    function StartOverlay(act) {
        setOverlay({ status: true, action: act });
    }

    function addDeli() {
        setDelivery(prev => {
            const hasLink = prev.some(d => d.link === null || d.name === null)

            if (hasLink) return prev
            return [...prev, { id: currentNewDeli.current, name: null, link: null }]
        })
        currentNewDeli.current += 1;
    }

    function updateDeli(obj) {
        setDelivery(prev => {
            return prev.map(d =>
                d.id === obj.id ? obj : d
            )
        })
    }

    function deleteDeli(obj) {
        setDelivery(prev => prev.filter(d => d.id !== obj.id))
    }

    function saveMenu(obj) {
        setMenu((prev) => [...prev, obj]);
    }

    function editMenu(obj) {
        setMenuEdit(obj);
        StartOverlay('menuEdit');
    }

    function updateMenu(obj) {
        setMenu(prev =>
            prev.map(item =>
                item.id === obj.id ? obj : item
            )
        );
    }


    useEffect(() => {
        const d = new Date();
        const day = d.getDay()
        setCurrentDay(days.find(d => d.day === dayArr[day]) ?? null);
    }, [days]);



    useEffect(() => {
        if (!basicInfo.lat || !basicInfo.lon) return;
        async function getlocation() {
            setStatus("waiting");
            const api = createApi('Location');
            const loc = await axios.get(api, {
                params: {
                    lat: basicInfo.lat,
                    lon: basicInfo.lon
                }
            });
            console.log(loc.data);
            setCurrentLoc(loc.data.location);
            setStatus("");
        }
        getlocation();
    }, [basicInfo.lat, basicInfo.lon])

    function cancelPage() {
        SetInfo(originalData.current.data);
        setCurrentLoc(originalData.current.data.location);
        setType(originalData.current.type);
        setDay(originalData.current.day);
        setDelivery(originalData.current.deli);
        setMenu(originalData.current.menu);
    }
    function makeNewMenuId() {
        const id = currentNewMenu.current;
        currentNewMenu.current++;
        return id;
    }

    async function emergencyClick() {
        try {
            setStatus("waiting");
            const token = Cookies.get("token");
            const newStatus = !isEmergency
            setEmergency(newStatus);
            const api = createApi('Emergency');
            await axios.patch(api, { token, emergency: newStatus });
        } catch (err) {
            console.log('Fail to change emergency');
        } finally {
            setStatus("");
        }


    }

    async function savePage() {
        setStatus('waiting');
        const token = Cookies.get("token")
        const form = new FormData()
        let restaurant_status = 'Pending';
        if (basicInfo.name && basicInfo.lat) {
            restaurant_status = 'Available';
        }
        form.append("main_photo", basicInfo.photo)
        menus.forEach((m, i) => {
            if (m.photo instanceof File) {
                form.append(`menu_photo_${i}`, m.photo)
            }
        })
        console.log(basicInfo);
        const data = {
            basicInfo: {
                name: basicInfo.name,
                description: basicInfo.description,
                lat: basicInfo.lat,
                lon: basicInfo.lon,
                location: currentLoc,
                status: restaurant_status,
                photo_path: basicInfo.photo_path,
                public_id: basicInfo.public_id
            },
            token,
            types,
            days,
            delivery,
            menus: menus.map((m, i) => ({
                id: m.id,
                name: m.name,
                photo_path: m.photo_path,
                public_id: m.public_id,
                price: m.price,
                category: m.category
            }))
        }

        form.append("meta", JSON.stringify(data));
        const api = createApi('RestaurantPage')
        const res = await axios.patch(api, form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        setStatus("");
        CheckAuth();
    }

    useEffect(() => {
        const { data, type, day, deli, menu } = originalData.current;

        // Compare current state with original values
        const hasChanges =
            JSON.stringify(basicInfo) !== JSON.stringify(data) ||
            JSON.stringify(types) !== JSON.stringify(type) ||
            JSON.stringify(days) !== JSON.stringify(day) ||
            JSON.stringify(delivery) !== JSON.stringify(deli) ||
            JSON.stringify(menus) !== JSON.stringify(menu);

        setIsEditInfo(hasChanges);
    }, [basicInfo, types, days, delivery, menus]);

    useEffect(() => {
        CheckAuth();
    }, []);

    useEffect(() => {
        if (auth === false) {
            navigate("/Login");
        }
    }, [navigate, auth]);

    useEffect(() => {
        console.log(types);
    }, [types])

    return (
        <div className="fullPageContainer">

            <div className="header">
                <h1>Restaurant Profile</h1>
                <button style={{ color: "white" }} onClick={Logout}>
                    Log out
                </button>
            </div>


            <div style={{ display: "flex", alignItems: 'center', padding: "0 1.5em", gap: "3em" }}>

                <ImageInput initialSrc={originalData.current?.data?.photo_path ?? ''} onChange={onProfilePicChange} />
                {/*Restaurant name session*/}
                {!editing && (
                    <span role="button" tabIndex={0} onClick={startEdit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") startEdit();
                        }}
                        style={{ display: "inline-block", minWidth: 120, padding: "4px 6px", cursor: "text", background: "transparent", fontSize: "1.5em" }}
                    >
                        {basicInfo.name}
                    </span>
                )}

                {editing && (
                    <input ref={inputRef} className="inline-input"
                        style={{ font: "inherit", padding: "4px 6px", minWidth: 120, border: "none", outline: "none", background: "transparent", }}
                        defaultValue={basicInfo.name}
                        onBlur={(e) => {
                            SetInfo((prev) => ({ ...prev, name: e.target.value }));
                            finishEdit();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                SetInfo((prev) => ({ ...prev, name: e.target.value }));
                                finishEdit();
                            }
                            if (e.key === "Escape") {
                                cancelEdit();
                            }
                        }}
                    />
                )}
            </div>

            {/*Restaurant Email*/}
            <div className='infoContainer'>
                <p>Email Address</p>
                <div className='unchangeInfo Info'>{basicInfo.email}</div>
            </div>

            {/*Restaurant type*/}


            <div className="infoContainer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>Restaurant Types</p>
                    <span>
                        <a className='link' onClick={() => StartOverlay('Types')}>Edit Type</a>
                    </span>
                </div>

                <div className='unchangeInfo Info allowOverflow'>
                    {types.length !== 0 ? types.map((type, index) => (
                        <div key={index} className="typeContainer" style={{ height: '1.5em' }}>
                            <p style={{ margin: '0' }}>
                                {type.type}
                            </p>
                        </div>
                    ))
                        : 'Not define'
                    }
                </div>
            </div>

            {/*Restaurant description */}
            <div className="infoContainer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>Restaurant Description</p>
                </div>

                <div className='Info'>
                    <textarea style={{ border: 'none', backgroundColor: '#D9D9D9', height: '10em', width: '100%', padding: '0.5em', resize: 'none', outline: 'none', textAlign: 'left', verticalAlign: 'top', }} placeholder='Description' value={basicInfo.description} onChange={handleDescriptionChange} />
                </div>


            </div>

            {/*Restaurant Location */}
            <div className="infoContainer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>Restaurant Location</p>
                    <span>
                        <a className='link' onClick={() => StartOverlay('Loc')}>Change Location</a>
                    </span>
                </div>

                <div className="unchangeInfo Info allowOverflow">
                    {basicInfo.lat ? currentLoc : "Not defined"}
                </div>


            </div>

            {/*Restaurant active time */}
            <div className="infoContainer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>Opening hours</p>
                    <span>
                        <a className='link' onClick={() => StartOverlay('Day')}>+ Add time</a>
                    </span>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", display: 'flex' }}>
                    <div className="unchangeInfo Info allowOverflow" style={{ width: '100%', alignItems: 'center', justifyContent: 'space-around' }}>
                        {currentDay && !isEmergency ? <><div>Today: {currentDay.day}</div><div>Open: {currentDay.open}</div><div>Close: {currentDay.close}</div></> : "Close"}
                    </div>
                    <button style={{ height: '100%' }} onClick={() => emergencyClick()}>
                        {!isEmergency ? 'Emergency Close' : 'Cancle Emergency'}
                    </button>
                </div>
            </div>

            {/*Delivery app list*/}
            <div className="infoContainer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>Delivery Application list</p>
                    <span>
                        <a className='link' onClick={() => addDeli()}>+ Add Delivery</a>
                    </span>
                </div>


                <div className="unchangeInfo Info allowOverflowy">
                    {delivery.length > 0 ?
                        delivery.map((deli) => (
                            <DeliveryContainer key={deli.id} deli={deli} onUpdate={updateDeli} onDelete={deleteDeli} />
                        ))
                        :
                        "None"
                    }
                </div>
            </div>

            {/*Menu List*/}
            <div className="infoContainer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>Restaurant Menu list</p>
                    <span>
                        <a className='link' onClick={() => StartOverlay('Menu')}>+ Add Menu</a>
                    </span>
                </div>


                <div className="unchangeInfo Info allowOverflowy" >
                    {menus.length > 0 ?
                        menus.map((menu) => (
                            <MenuContainer key={menu.id} menu={menu} deleteMenu={(id) => setMenu(prev => prev.filter(d => d.id !== id))} editMenu={() => editMenu(menu)} />
                        ))
                        :
                        "None"
                    }
                </div>

            </div>

            <div className='btnContainer' style={{ display: 'flex', gap: '2em', justifyContent: 'end', padding: '0 2em' }}>
                {isEditInfo ?
                    <>
                        <button style={{ width: '25%', backgroundColor: 'white', border: '2px solid black', color: 'black' }} onClick={() => cancelPage()}>Cancel</button>
                        <button style={{ width: '25%' }} onClick={() => savePage()}>Save</button>
                    </>
                    :
                    <button style={{ width: '25%' }} onClick={() => navigate('/Preview')}>Show Preview</button>
                }
            </div>

            <OverlayRestaurantPage
                status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })}
                typeInclude={types} onTypeChange={(data) => setType(data)} onLocChange={handleSelect}
                defaultPos={basicInfo.lat && basicInfo.lon ? [basicInfo.lat, basicInfo.lon] : null} day={days} onSaveDay={(newday) => setDay(newday)}
                onSaveMenu={saveMenu} currentNewMenu={{ id: makeNewMenuId() }} currentMenu={menuEdit} menuEdit={menuEdit} onSaveMenuChanage={updateMenu} />

            <WaitingOverlay status={status} />

        </div>
    );
}