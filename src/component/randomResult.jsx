
import { InCartRestaurantContainer } from "./restaurantContainer"
import { useNavigate } from "react-router-dom"
import randomSvg from '../assets/randomSvg.svg'
import confirmSvg from '../assets/confirmSvg.svg'
import { useState } from "react"
import '../style/randomResult.css'

// ──────────────────────────────
// Utility function
// ──────────────────────────────
function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

// ──────────────────────────────
// UI for showing result + controls
// ──────────────────────────────
function BuildCard({ r, data, Location, onClose, reRandom, isSpinning }) {
    const navigate = useNavigate();

    return (
        <div style={{ position: "relative", textAlign: "left" }}>
            {/* Close button */}
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    cursor: "pointer",
                    fontSize: "1.2em",
                }}
                onClick={onClose}
            >
                ×
            </div>

            <h3 style={{ marginBottom: "1em" }}>Your Random Restaurant is</h3>

            <div
                className="randomCardContainer"
            // style={{
            //   height: "220px",
            //   overflow: "hidden",
            //   display: "flex",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   borderRadius: "12px",
            //   border: "2px solid black",
            //   background: "white",
            // }}
            >
                {isSpinning ? (
                    <div className="slotContainer">
                        <div className="slotScroll">
                            {Array.from({ length: 100 }).map(() => {
                                const randomItem = getRandomItem(data ?? []);
                                return (
                                    <InCartRestaurantContainer
                                        data={randomItem}
                                        currentLocation={Location}
                                        isEditCartAllow={false}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <InCartRestaurantContainer
                        data={r}
                        currentLocation={Location}
                        isEditCartAllow={false}
                    />
                )}
            </div>

            {/* Confirm Button */}
            <button
                style={{
                    width: "100%",
                    marginTop: "1em",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5em",
                    fontWeight: "600",
                }}
                onClick={() => navigate(`/RestaurantDetail/${r.id}`)}
                disabled={isSpinning}
            >
                <img src={confirmSvg} alt="confirm" />
                Confirm Result
            </button>

            {/* Random Again Button */}
            <button
                style={{
                    backgroundColor: "white",
                    color: "black",
                    border: "2px solid black",
                    width: "100%",
                    marginTop: "0.5em",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5em",
                    fontWeight: "600",
                }}
                onClick={reRandom}
                disabled={isSpinning}
            >
                <img src={randomSvg} alt="random" />
                Random Again
            </button>
        </div>
    );
}

// ──────────────────────────────
// For "InCart" mode
// ──────────────────────────────
export function InCart({ data, Location, onClose }) {
    const [r, setR] = useState(() => getRandomItem(data));
    const [isSpinning, setIsSpinning] = useState(false);

    function reRandom() {
        setIsSpinning(true);

        // Spin for 2–3 seconds
        const duration = 2000 + Math.random() * 1000;

        setTimeout(() => {
            setR(getRandomItem(data));
            setIsSpinning(false);
        }, duration);
    }

    return (
        <BuildCard
            r={r}
            data={data}
            Location={Location}
            onClose={onClose}
            reRandom={reRandom}
            isSpinning={isSpinning}
        />
    );
}

// ──────────────────────────────
// For "NormCart" mode (filtered data)
// ──────────────────────────────
export function NormCart({ data, Location, onClose }) {
    const useData = data.filter((d) => d.isUse === true);
    const [r, setR] = useState();
    const [isSpinning, setIsSpinning] = useState(false);

    if (useData.length === 0) {
        alert("No restaurant matches your condition, please try again.");
        return onClose();
    }

    function reRandom() {
        setIsSpinning(true);
        const duration = 2000 + Math.random() * 1000;

        setTimeout(() => {
            setR(getRandomItem(useData));
            setIsSpinning(false);
        }, duration);
    }

    return (
        <BuildCard
            r={r}
            data={useData}
            Location={Location}
            onClose={onClose}
            reRandom={reRandom}
            isSpinning={isSpinning}
        />
    );
}


// function getRandomItem(arr) {
//     const randomIndex = Math.floor(Math.random() * arr.length);
//     console.log(randomIndex)
//     return arr[randomIndex];
// }

// function BuildCard({ r, Location, onClose, reRandom }) {
//     const navigate = useNavigate();
//     return (
//         <div style={{ position: 'relative', textAlign: 'left' }}>
//             <div style={{ position: "absolute", top: '0', right: '0', cursor: 'pointer' }} onClick={() => onClose()}>
//                 x
//             </div>
//             <h3 style={{ marginBottom: '1em' }}>Your Random Restaurant is</h3>
//             <div className="randomCardContainer">
//                 <InCartRestaurantContainer data={r} currentLocation={Location} isEditCartAllow={false} />
//             </div>

//             <button style={{ width: '100%', marginTop: '1em', display: 'flex', justifyContent: 'center' }} onClick={() => navigate(`/RestaurantDetail/${r.id}`)}>
//                 <span style={{ display: "flex", justifyContent: 'center' }}>
//                     <img src={confirmSvg} alt="confirm" />
//                 </span>
//                 Confirm result
//             </button>

//             <button style={{ backgroundColor: 'white', color: 'black', borderColor: 'black', width: '100%', marginTop: '0.5em', display: 'flex', justifyContent: 'center' }} onClick={() => reRandom()}>
//                 <span style={{ display: "flex", justifyContent: 'center' }}>
//                     <img src={randomSvg} alt="random" />
//                 </span>
//                 Random Again
//             </button>


//         </div>
//     )
// }

// export function InCart({ data, Location, onClose }) {
//     console.log(data);
//     const [r, setR] = useState(() => getRandomItem(data));
//     console.log(r);
//     function reRandom() {
//         console.log(data);
//         setR(getRandomItem(data))
//     }
//     return (
//         <>
//             <BuildCard r={r} Location={Location} onClose={onClose} reRandom={reRandom} />
//         </>

//     )
// }

//


// export function NormCart({ data, Location, onClose }) {
//     const useData = data.filter(d => d.isUse === true);
//     const [r, setR] = useState(() => getRandomItem(data));
//     const [isSpinning, setIsSpinning] = useState(false);
//     if (useData.length === 0) {
//         alert('No restaurant match your condition, please try again.')
//         return onClose();
//     }

//     console.log(r);
//     function reRandom() {
//         setIsSpinning(true);
//         // Show multiple fast flickers before final result
//         let count = 0;
//         const interval = setInterval(() => {
//             setR(getRandomItem(UseData));
//         }, 100);

//         // stop after ~1 second
//         setTimeout(() => {
//             clearInterval(interval);
//             setR(getRandomItem(data));
//             setIsSpinning(false);
//         }, 1000);
//     }
//     // function reRandom() {
//     //     setR(getRandomItem(useData))
//     // }
//     return (
//         <BuildCard r={r} Location={Location} onClose={onClose} reRandom={reRandom} />
//     )
// }

// export function NormCart({ data, Location, onClose }) {
//     const useData = data.filter(d => d.isUse === true);
//     const [r, setR] = useState(() => getRandomItem(useData));
//     const [isSpinning, setIsSpinning] = useState(false);

//     if (useData.length === 0) {
//         alert('No restaurant matches your condition, please try again.');
//         return onClose();
//     }

//     function reRandom() {
//         setIsSpinning(true);

//         const interval = setInterval(() => {
//             setR(getRandomItem(useData));
//         }, 100);

//         setTimeout(() => {
//             clearInterval(interval);
//             setR(getRandomItem(useData));
//             setIsSpinning(false);
//         }, 1000);
//     }

//     return (
//         <BuildCard
//             r={r}
//             Location={Location}
//             onClose={onClose}
//             reRandom={reRandom}
//             isSpinning={isSpinning}
//         />
//     );
// }
