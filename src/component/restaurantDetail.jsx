import { Image } from "./ImgUploader";
import '../style/restaurantDetail.css';
import { useNavigate } from "react-router-dom";
import goBackArrow from '../assets/goBackArrow.svg';
import emailSvg from '../assets/emailSvg.svg';
import locationSvg from '../assets/locationSvg.svg';
import timeSvg from '../assets/timeSvg.svg';
import deliverySvg from '../assets/deliverySvg.svg'
import MenuContainer from "./menuContainer";

export default function RestaurantDetail({ status, info, types, currentDay, location, days, isEmergency, delivery, menus }) {
    console.log(currentDay)
    const navigate = useNavigate();

    function GetDay() {
        if (isEmergency) return (<p style={{ color: 'red' }}>Temporary Close</p>);
        return (
            <table className="dayDetailTable">
                <tbody>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                        const d = days.find(x => x.day === day) // <--- get data once

                        return (
                            <tr key={day}>
                                <td className="dayDetailLabel">{day}</td>
                                <td className="OpenToClose">
                                    {d ? `${d.open} - ${d.close}` : "close"}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    }

    function ListDelivery() {
        return (
            <table>
                <tbody>
                    {delivery ? delivery.map(deli => {
                        return (
                            <tr key={deli.name}>
                                <td style={{ width: '5.5em', maxWidth: '5.5em' }}><h4 style={{ margin: '0' }}>{deli.name}:</h4></td>
                                <td onClick={() => { window.open(deli.link, "_blank"); }} style={{ cursor: 'pointer', wordWrap: 'break-word' }}>{deli.link}</td>
                            </tr>
                        )
                    }) :
                        'None'
                    }
                </tbody>
            </table>
        )
    }

    return (
        <>
            <div className='imgContainerDetail' style={{ backgroundImage: `url(${info.photo_path ?? ''})`, display: 'flex', justifyContent: 'left', alignItems: 'end', position: 'relative' }}>
                <button onClick={() => navigate(-1)} className="goBackButton">
                    <img src={goBackArrow} alt="go back" />
                    <span> Go Back </span>
                </button>
                {status === 'Preview' ?
                    <h2>Preview</h2>
                    :
                    ''
                }
            </div>
            <div className="detailContainer">
                <div style={{ backgroundColor: '#D9D9D9', height: '0.3em', width: '3em', placeSelf: 'center', margin: '1em 0', borderRadius: '0.2em' }} />
                <div className="typeDetailContainer allowOverflow">
                    {types.length !== 0 ? types.map((type, index) => (
                        <div key={index} className="typeContainer" style={{ height: '2.5em', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', backgroundColor: '#D9D9D9' }}>
                            <h3 style={{ margin: '0' }}>
                                {type.type}
                            </h3>
                        </div>
                    ))
                        : 'Not define'
                    }
                </div>
                <h1 style={{ textAlign: 'left', margin: '1em 0.2em', display: 'flex', flexWrap: 'wrap' }}>
                    {info.name ?? 'Undefine'}
                </h1>
                <hr />
                <div style={{ textAlign: 'left', margin: '0 0.2em', wordWrap: 'break-word', maxWidth: '95vw' }}>
                    <h3>About</h3>
                    <p>
                        {info.description ?? 'None'}
                    </p>
                    <div style={{ alignItems: 'left', width: 'fit-content', margin: '0.5em 0.5em' }}>
                        <span style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', gap: '0.5em' }}>
                            <img src={emailSvg} alt="email" />
                            <h4>Email:</h4>
                        </span>
                        <p style={{ margin: '0 2em' }}>
                            {info.email}
                        </p>
                    </div>
                    <div style={{ alignItems: 'left', width: 'fit-content', margin: '0.5em 0.5em' }}>
                        <span style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', gap: '0.5em' }}>
                            <img src={locationSvg} alt="email" />
                            <h4>Location:</h4>
                        </span>
                        <p
                            style={{ margin: '0 2em', cursor: 'pointer' }}
                            onClick={() => {
                                if (!info?.lat || !info?.lon) return alert("no dest");

                                // ask browser geolocation
                                navigator.geolocation.getCurrentPosition(pos => {
                                    const { latitude, longitude } = pos.coords;

                                    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${info.lat},${info.lon}`;

                                    window.open(url, "_blank"); // open new tab
                                });
                            }}
                        >
                            {location}</p>
                    </div>
                    <div style={{ alignItems: 'left', width: 'fit-content', margin: '0.5em 0.5em', rowGap: '0' }}>
                        <span style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', gap: '0.5em' }}>
                            <img src={timeSvg} alt="email" />
                            <h4>Opening hours:</h4>
                        </span>
                        <div style={{ margin: '0 2em' }}>
                            <GetDay />
                        </div>

                    </div>
                    <div style={{ alignItems: 'left', width: 'fit-content', margin: '0.5em 0.5em', rowGap: '0' }}>
                        <span style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', gap: '0.5em' }}>
                            <img src={deliverySvg} alt="email" />
                            <h4>Delivery Application List:</h4>
                        </span>
                        <div style={{ margin: '0 2em' }}>
                            <ListDelivery />
                        </div>

                    </div>
                </div>
                <hr />
                <div className="menuList" style={{textAlign:'left',margin:'0 0.2em'}}>
                    <h3>Menu List</h3>
                    {menus.length > 0 ?
                        menus.map((menu) => (
                            <MenuContainer key={menu.id} menu={menu} allowEdit={false}/>
                        ))
                        :
                        "None"
                    }
                </div>

            </div>
        </>
    )
}