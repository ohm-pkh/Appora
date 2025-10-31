import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { createApi } from "../function/api";
import OverlayBtn from "./closeSaveOverlay.jsx";

export default function TypeInsert(params) {
    const [unUsetype, setUnUseType] = useState([]);
    const [currentType, setCurrentType] = useState(params.typesInclude);
    console.log(params.typesInclude);

    const getOtherType = useCallback(async () => {
        const api = createApi("Type");
        const Result = await axios.get(api, { params: { types: params.typesInclude.map(t => t.id).join(',') } });
        console.log(Result);
        setUnUseType(Result.data.types);
    }, [params.typesInclude]);

    function insertType(type) {
        setCurrentType(prev => [...prev, type]);
        setUnUseType(prev => prev.filter(t => t.id !== type.id));
    }

    function removeType(type) {
        setCurrentType(prev => prev.filter(t => t.id !== type.id));
        setUnUseType(prev => [...prev, type]);
    }

    useEffect(() => {
        getOtherType();
    }, [getOtherType]);



    return (
        <>
            <div className="typeForm">
                <div className="currentType allowOverflow">
                    {currentType.length !== 0 ? currentType.map((type, index) => (
                        <div key={index} className="typeContainer" onClick={() => removeType({ name: type.type, id: type.id })}>
                            {type.type}
                        </div>
                    ))
                        : 'Not define'
                    }
                </div>

                <div className="otherType">
                    {unUsetype.length !== 0 ? unUsetype.map((type, index) => (
                        <div key={index} className="typeContainer" onClick={() => insertType({ type: type.name, id: type.id })}>
                            {type.name}
                        </div>
                    ))
                        : 'Not define'
                    }
                </div>

            </div>

            <OverlayBtn onClose={params.onClose} onSave={params.onTypeChange} data={currentType}/>
        </>

    )
}