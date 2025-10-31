import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { createApi } from "../function/api";
import OverlayBtn from "./closeSaveOverlay.jsx";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

export function TypeInsert(params) {
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

            <OverlayBtn onClose={params.onClose} onSave={params.onTypeChange} data={currentType} />
        </>

    )
}


export function LocChange({ defaultPos, onSelect, onClose, onLocChange }) {
  // normalize default position
  const initialPos =
    Array.isArray(defaultPos) && defaultPos.length === 2
      ? { lat: defaultPos[0], lng: defaultPos[1] }
      : defaultPos || null;

  const [position, setPosition] = useState(initialPos);

  // map click event handler
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        onSelect?.({ lat, lng });
      },
    });
    return position ? <Marker position={position} /> : null;
  }

  // save and close
  function handleSave() {
    if (position) {
      onLocChange?.(position);
    }
    onClose?.();
  }

  return (
    <div style={{width:'70vh', height:'fit-content'}}>
      <MapContainer
        center={position || [13.736717, 100.523186]}
        zoom={13}
        style={{ height: "300px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapClickHandler />
      </MapContainer>

      <OverlayBtn onClose={onClose} onSave={handleSave} />
    </div>
  );
}