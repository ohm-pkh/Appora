import '../style/filter.css'
import { SaveBtn, CloseBtn } from './closeSaveOverlay';
import { useEffect, useState } from 'react'


export default function Filter({ types, categories, filter, onSave, onClose, isDistanceNotNeed=false}) {
    const defaultFilter = { type: [], category: [], price: null, distance: isDistanceNotNeed?null:5 };
    console.log('filter distance',filter.distance);
    const [newDistance, setNewDistance] = useState(filter.distance ?? (isDistanceNotNeed?null:5));
    const [currentFilter, setCurrentFilter] = useState({
        ...defaultFilter,
        ...(filter ?? {}),
    });

    function onClear() {
        setCurrentFilter(defaultFilter);
        setNewDistance(isDistanceNotNeed?null:5);
    }

    useEffect(() => {
        setCurrentFilter(prev => ({
            ...prev,
            distance: newDistance
        }))
    }, [newDistance])


    return (
        <>
            <h2 style={{ textAlign: "left", paddingLeft: "1em", maxHeight: "70vh", margin: "0" }}>Filter</h2>

            <div className="optionsContainer">
                {/* TYPE */}
                <div>
                    <h3 style={{ textAlign: "left", paddingLeft: "1.5em" }}>Restaurant Type</h3>
                    <div className="filterOption">
                        {types.map((t) => {
                            const selected = currentFilter?.type?.includes(t.id);
                            return (
                                <div
                                    key={t.id}
                                    className={selected ? "chosenChoice" : "choiceContainer"}
                                    onClick={() =>
                                        setCurrentFilter((prev) => ({
                                            ...prev,
                                            type: selected
                                                ? prev.type.filter((id) => id !== t.id)
                                                : [...prev.type, t.id],
                                        }))
                                    }
                                >
                                    {t.name}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <hr />

                {/* CATEGORY */}
                <div>
                    <h3 style={{ textAlign: "left", paddingLeft: "1.5em" }}>Menu Categories</h3>
                    <div className="filterOption">
                        {categories.map((t) => {
                            const selected = currentFilter?.category?.includes(t.id);
                            return (
                                <div
                                    key={t.id}
                                    className={selected ? "chosenChoice" : "choiceContainer"}
                                    onClick={() =>
                                        setCurrentFilter((prev) => ({
                                            ...prev,
                                            category: selected
                                                ? prev.category.filter((id) => id !== t.id)
                                                : [...prev.category, t.id],
                                        }))
                                    }
                                >
                                    {t.name}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <hr />

                {/* PRICE */}
                <div>
                    <h3 style={{ textAlign: "left", paddingLeft: "1.5em" }}>Price</h3>
                    <div className="filterOption" style={{ justifyContent: "center", gap: "1em" }}>
                        {[1, 2, 3, 4, 5].map((i) => {
                            const selected = currentFilter?.price === i; // check single value
                            return (
                                <div
                                    key={i}
                                    className={selected ? "chosenChoice" : "choiceContainer"}
                                    onClick={() =>
                                        setCurrentFilter((prev) => ({
                                            ...prev,
                                            price: prev.price === i ? null : i
                                        }))
                                    }
                                >
                                    {"฿".repeat(i)}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <hr />

                {/* DISTANCE */}
                <div>
                    <h3 style={{ textAlign: "left", paddingLeft: "1.5em" }}> Distance {newDistance || newDistance >= 0 ? newDistance : "undefine"} km
                    </h3>
                    <input
                        type="range"
                        name="distance"
                        id="distanceInput"
                        value={newDistance * 20}
                        onChange={(e) => setNewDistance(Math.ceil(e.target.value / 20))}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', paddingBottom: '1em' }}>
                    {onClose?CloseBtn(onClose):''}
                    {SaveBtn(onSave,onClose??null, currentFilter)}
                    <button onClick={onClear}>Clear</button>
                </div>
            </div>

        </>
    );
}

// export default function Filter({ types, categories, filter }) {
//     const [newDistance, setNewDistance] = useState()
//     const [currentFilter, setCurrentFilter] = useState(filter ?? { type: [], category: [], price: [], distance: null })
//     return (
//         <>
//             <h2 style={{ textAlign: 'left', paddingLeft: '1em', maxHeight: '70vh', margin: '0' }}>Filter</h2>
//             <div className='optionsContainer'>
//                 <div>
//                     <h3 style={{ textAlign: 'left', paddingLeft: '1.5em' }}>Restaurant Type</h3>
//                     <div className="filterOption">
//                         {types.map(t => {
//                             const selected = currentFilter?.type?.includes(t.id);
//                             return (
//                                 <div key={t.id} className={selected ? 'chosenChoice' : 'choiceContainer'} onClick={() => setCurrentFilter(prev => ({ ...prev, type: selected ? prev.type.filter(id => id !== t.id) : [...prev.type, t.id] }))}>
//                                     {t.name}
//                                 </div>
//                             )
//                         })}
//                     </div>
//                 </div>
//                 <hr />
//                 <div>
//                     <h3 style={{ textAlign: 'left', paddingLeft: '1.5em' }}>Menu Categories</h3>
//                     <div className="filterOption">
//                         {categories.map(t => {
//                             const selected = currentFilter?.category?.includes(t.id);
//                             return (
//                                 <div key={t.id} className={selected ? 'chosenChoice' : 'choiceContainer'} onClick={() => setCurrentFilter(prev => ({ ...prev, category: selected ? prev.category.filter(id => id !== t.id) : [...prev.category, t.id] }))}>
//                                     {t.name}
//                                 </div>
//                             )
//                         }
//                         )}
//                     </div>
//                 </div>
//                 <hr />
//                 <div>
//                     <h3 style={{ textAlign: 'left', paddingLeft: '1.5em' }}>Price</h3>
//                     <div className="filterOption" style={{ justifyContent: 'center', gap: '1em' }}>
//                         {[1, 2, 3, 4, 5].map(i => {
//                             const selected = currentFilter?.price?.includes(i);
//                             return (
//                                 <div key={i} className={selected ? 'chosenChoice' : 'choiceContainer'} onClick={() => setCurrentFilter(prev => ({ ...prev, price: selected ? prev.price.filter(id => id !== i) : [...prev.price, i] }))}>
//                                     {'฿'.repeat(i)}
//                                 </div>
//                             )
//                         })
//                         }
//                     </div>
//                 </div>
//                 <hr />
//                 <div>
//                     <h3 style={{ textAlign: 'left', paddingLeft: '1.5em' }}>Distance ({newDistance || newDistance >= 0 ? newDistance : 'undefine'}) km</h3>
//                     <input type="range" name="distance" id="distanceInput" onChange={(e) => setNewDistance(Math.ceil(e.target.value / 20))} />
//                 </div>
//             </div>

//         </>
//     )
// }