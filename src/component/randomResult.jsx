
import { InCartRestaurantContainer } from "./restaurantContainer"
import { useNavigate } from "react-router-dom"
import randomSvg from '../assets/randomSvg.svg'
import confirmSvg from '../assets/confirmSvg.svg'

function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    console.log(randomIndex)
    return arr[randomIndex];
}

function BuildCard({ r, Location, onClose,reRandom }) {
    const navigate = useNavigate();
    return (
        <div style={{ position: 'relative', textAlign: 'left' }}>
            <div style={{ position: "absolute", top: '0', right: '0', cursor: 'pointer' }} onClick={() => onClose()}>
                x
            </div>
            <h3 style={{ marginBottom: '1em' }}>Your Random Restaurant is</h3>
            <div style={{ minWidth: '60vw' }}>
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
    let r = getRandomItem(data);
    console.log(r);
    function reRandom(){
        r = getRandomItem(data)
    }
    return (
        <BuildCard r={r} Location={Location} onClose={onClose} reRandom={reRandom}/>
    )
}


export function NormCart({ data, Location, onClose }) {
    const useData = data.filter(d => d.isUse === true);
    if(useData.length===0){
        alert('No restaurant match your condition, please try again.')
        return onClose();
    }
    let r = getRandomItem(useData);
    console.log(r);
    function reRandom(){
        r = getRandomItem(useData)
    }
    return (
        <BuildCard r={r} Location={Location} onClose={onClose} reRandom={reRandom}/>
    )
}