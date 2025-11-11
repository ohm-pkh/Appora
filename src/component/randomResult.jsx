
import { InCartRestaurantContainer } from "./restaurantContainer"
import { useNavigate } from "react-router-dom"
import randomSvg from '../assets/randomSvg.svg'
import confirmSvg from '../assets/confirmSvg.svg'
import { useState } from "react"

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    console.log(randomIndex)
    return arr[randomIndex];
}

function BuildCard({ r, Location, onClose, reRandom }) {
    const navigate = useNavigate();
    return (
        <div style={{ position: 'relative', textAlign: 'left' }}>
            <div style={{ position: "absolute", top: '0', right: '0', cursor: 'pointer' }} onClick={() => onClose()}>
                x
            </div>
            <h3 style={{ marginBottom: '1em' }}>Your Random Restaurant is</h3>
            <div className="randomCardContainer">
                <InCartRestaurantContainer data={r} currentLocation={Location} isEditCartAllow={false} />
            </div>

            <button style={{ width: '100%', marginTop: '1em', display: 'flex', justifyContent: 'center' }} onClick={() => navigate(`/RestaurantDetail/${r.id}`)}>
                <span style={{ display: "flex", justifyContent: 'center' }}>
                    <img src={confirmSvg} alt="confirm" />
                </span>
                Confirm result
            </button>

            <button style={{ backgroundColor: 'white', color: 'black', borderColor: 'black', width: '100%', marginTop: '0.5em', display: 'flex', justifyContent: 'center' }} onClick={() => reRandom()}>
                <span style={{ display: "flex", justifyContent: 'center' }}>
                    <img src={randomSvg} alt="random" />
                </span>
                Random Again
            </button>


        </div>
    )
}

export function InCart({ data, Location, onClose }) {
    console.log(data);
    const [r, setR] = useState(() => getRandomItem(data));
    console.log(r);
    function reRandom() {
        console.log(data);
        setR(getRandomItem(data))
    }
    return (
        <BuildCard r={r} Location={Location} onClose={onClose} reRandom={reRandom} />
    )
}


export function NormCart({ data, Location, onClose }) {
    const useData = data.filter(d => d.isUse === true);
    const [r, setR] = useState(() => getRandomItem(data));
    if (useData.length === 0) {
        alert('No restaurant match your condition, please try again.')
        return onClose();
    }
    
    console.log(r);
    function reRandom() {
        setR(getRandomItem(useData))
    }
    return (
        <BuildCard r={r} Location={Location} onClose={onClose} reRandom={reRandom} />
    )
}