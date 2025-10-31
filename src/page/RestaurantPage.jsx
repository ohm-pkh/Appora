import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { createApi } from '../function/api';
import '../style/restaurantProfile.css';
import CircularImageInput from '../component/ImgUploader';
import OverlayRestaurantPage from '../component/Overlay';

export default function RestaurantPage() {
    const [auth, SetAuth] = useState(true);
    const [basicInfo, SetInfo] = useState({});
    const [types, setType] = useState([]);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const [overlay, setOverlay] = useState({ status: false });
    const navigate = useNavigate();

    const CheckAuth = async () => {
        try {
            const token = Cookies.get("token");
            if (!token) throw new Error("token not found.");

            const api = createApi("RestaurantPage");
            const Result = await axios.get(api, { params: { token } });

            if (Result.data.role !== "Restaurant") {
                Cookies.remove("token");
                throw new Error("Not Restaurant");
            }

            const newData = Result.data.Data;
            const newType = Result.data.types;
            SetInfo(newData);
            setType(newType);
            SetAuth(true);
        } catch {
            SetAuth(false);
        }
    };

    function Logout() {
        Cookies.remove("token");
        SetAuth(false);
    }

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

    function finishEdit() {
        setEditing(false);
    }

    function cancelEdit() {
        if (inputRef.current) {
            inputRef.current.value = basicInfo.name;
        }
        setEditing(false);
    }

    function handleDescriptionChange(e){
        SetInfo({...basicInfo,description: e.target.value});
    }

    function StartOverlay(act) {
        setOverlay({ status: true, action: act });
    }

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

                <CircularImageInput />
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
                        <div key={index} className="typeContainer">
                            {type.type}
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
                    <textarea   style={{border: 'none',backgroundColor: '#D9D9D9',height: '10em',width: '100%',padding: '0.5em',resize: 'none',outline: 'none', textAlign: 'left',verticalAlign: 'top', }} placeholder='Description' value={basicInfo.description} onChange={handleDescriptionChange}/>
                </div>


            </div>




            <OverlayRestaurantPage
                status={overlay.status} action={overlay.action} onClose={() => setOverlay({ status: false })}
                typeInclude={types} onTypeChange={(data) => setType(data)} />

        </div>
    );
}