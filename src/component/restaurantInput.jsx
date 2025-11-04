import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { createApi } from "../function/api";
import OverlayBtn from "./closeSaveOverlay.jsx";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import ToggleSwitch from "./toggleSwitch.jsx";
import ImageInput from "./ImgUploader.jsx";
import DropUp from "../assets/DropUp.svg";
import DropDown from "../assets/DropDown.svg";



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
    <div style={{ Width: '70vw', height: 'fit-content' }}>
      <MapContainer
        center={position || [13.736717, 100.523186]}
        zoom={13}
        style={{ height: "300px", width: "70vw", borderRadius: "8px" }}
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

function getdayTable(days, day, toggleChange, onTimeChange) {
  const shortDay = day.slice(0, 3);
  const dayInfo = days.find(d => d.day === shortDay) ?? null;

  return (
    <tr key={day.id}>
      <td className="dayLabel">{day}</td>
      {dayInfo ? (
        <>
          <td className="timeContainer">
            <input
              type="time"
              className="timeInput"
              defaultValue={dayInfo.open}
              onChange={(e) => onTimeChange({ day: dayInfo.day, open: e.target.value, close: dayInfo.close })}
            />
          </td>
          <td className="timeContainer">
            <input
              type="time"
              className="timeInput"
              defaultValue={dayInfo.close}
              onChange={(e) => onTimeChange({ day: dayInfo.day, open: dayInfo.open, close: e.target.value })}
            />
          </td>
          <td className="statusCell checked"><ToggleSwitch initStatus={true} onSwitch={() => toggleChange(day)} /></td>
        </>
      ) : (
        <>
          <td className="timeContainer">
            Close
          </td>
          <td className="timeContainer">
            Close
          </td>
          <td className="statusCell unchecked"><ToggleSwitch initStatus={false} onSwitch={() => toggleChange(day)} /></td>
        </>
      )}
    </tr>
  );
}

export function DayTable({ days, onClose, onSave }) {
  const [daysI, setDayI] = useState(days);

  function toggleChange(day) {
    setDayI((prev) => {
      // Check if day already exists
      const exists = prev.some(d => d.day === day);

      if (exists) {
        // Remove the existing object
        return prev.filter(d => d.day !== day);
      } else {
        // Add the new object
        return [...prev, { day: day, open: '00:00', close: '00:00' }];
      }
    });
  }

  function onTimeChange(dayObj) {
    setDayI((prev) => prev.map(d => d.day === dayObj.day ? { ...d, ...dayObj } : d))
  }

  return (
    <div className="tableWrapper">
      <div style={{ border: '2px solid #D9D9D9', borderRadius: "10px" }}>
        <table className="dayTable">
          <thead>
            <tr>
              <th>Day</th>
              <th>Open</th>
              <th>Close</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
              "Sun",
            ].map(day => getdayTable(daysI, day, toggleChange, onTimeChange))}
          </tbody>
        </table>

      </div>

      <OverlayBtn onClose={onClose} onSave={() => onSave(daysI)} />
    </div>
  );
}

export function MenuForm({ onClose, onSave, currentNewMenu }) {
  const [menu, setMenu] = useState(currentNewMenu);
  const [Uncategory, setUncategory] = useState([]);
  const [Usecategory, setUseCategory] = useState(currentNewMenu.category?? []);
  const [error, setError] = useState('');
  const [isDrop, setIsDrop] = useState(false);
  const [initPhoto, setInitPhoto] = useState();

  const getMenuCategories = useCallback(async () => {
    try {
      const api = createApi("Menu");
      const result = await axios.get(api);

      const allCategories = result.data.category; // should be an array
      const unUsed = allCategories.filter(
        item => !(Usecategory ?? []).some(u => u.id === item.id)
      );

      setUncategory(
        Usecategory && Usecategory.length > 0
          ? unUsed
          : result.data.category
      );
    } catch (error) {
      console.error("Error fetching menu categories:", error);
    }
  }, [Usecategory, setUncategory]);

  function checkNumber(value) {
    const onlyDigits = value.replace(/\D/g, '')
    setMenu(prev => ({ ...prev, price: onlyDigits }));
  }
  function removeCategory(obj) {
    setUseCategory(prev => prev.filter(c => c.id !== obj.id));
    setUncategory(prev => [...prev, obj]);
  }

  function addCategory(obj) {
    setUncategory(prev => prev.filter(c => c.id !== obj.id));
    setUseCategory(prev => [...prev, obj]);
  }

  function goTosave(updateMenu) {
    if (menu.name && menu.price) {
      onSave(updateMenu)
    } else {
      setError('Form not finish');
      return false;
    }
  }

  const tranferInit = useCallback(async () => {
    if (currentNewMenu.photo) {
      console.log('photofound')
      const reader = new FileReader();
      reader.onload = () => setInitPhoto(reader.result);
      reader.readAsDataURL(currentNewMenu.photo);
    } else if (currentNewMenu.photo_path && !currentNewMenu.photo_path.startsWith('newMenu')) {
      console.log(currentNewMenu.photo_path)
      console.log('path_found')
      setInitPhoto(currentNewMenu.photo_path);
    }
  }, [currentNewMenu]);

  useEffect(() => {
    getMenuCategories();
  }, [getMenuCategories])

  useEffect(() => {
    tranferInit();
  }, [tranferInit])

  return (
    <>
      <div className="menuFormContainer">
        {/* === Left Column === */}
        <div className="leftColumn">
          {/* Image Upload */}
          <div className="formGroup" style={{ alignItems: 'center' }}>
            <ImageInput circular={false} initialSrc={initPhoto} onChange={(file, result) => setMenu(prev => ({ ...prev, photo_path: 'newMenu', photo: file }))} />
          </div>

          {/* Menu Name */}
          <div className="formGroup">
            <label htmlFor="MenuName">Menu Name</label>
            <input
              type="text"
              id="MenuName"
              placeholder="Name"
              className="inputBox"
              value={menu.name ? menu.name : ''}
              onChange={(e) => setMenu(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Price */}
          <div className="formGroup">
            <label htmlFor="MenuPrice">Price</label>
            <input
              type="text"
              className="inputBox"
              placeholder="Price"
              value={menu.price ? menu.price : ''}
              onChange={(e) => checkNumber(e.target.value)}
            />
          </div>
        </div>

        {/* === Right Column === */}
        <div className="rightColumn">
          {/* Description */}
          <div className="formGroup">
            <label htmlFor="Menu_description">Description</label>
            <textarea
              name="Menu_description"
              id="Menu_description"
              placeholder="Description"
              className="textareaBox"
              value={menu.description ?? ''}
              onChange={(e) => setMenu(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
          </div>

          {/* Categories */}
          <div className="formGroup">
            <label htmlFor="MenuCategory">Menu Category</label>

            {/* Selected Categories */}
            <div style={{ display: 'flex', backgroundColor: '#D9D9D9', borderRadius: '10px' }}>
              <div id="MenuCategory" className="allowOverflowUCA" style={{ width: '100%' }}>
                {Usecategory && Usecategory.length > 0
                  ? Usecategory.map((Category, index) => (
                    <div
                      key={index}
                      className="categoryContainer selectedCategory"
                      onClick={() =>
                        removeCategory({
                          name: Category.name,
                          id: Category.id
                        })
                      }
                    >
                      {Category.name}
                    </div>
                  ))
                  : 'None'}
              </div>
              <span>
                <img src={isDrop ? DropUp : DropDown} alt="Drop" style={{ width: '30px', cursor: 'pointer', height: '100%' }} onClick={() => setIsDrop(!isDrop)} />
              </span>
            </div>


            {/* Unselected Categories */}
            <div className="otherCategory allowOverflowCA" style={{ display: isDrop ? 'flex' : 'none' }}>
              {Uncategory && Uncategory.length > 0
                ? Uncategory.map((Category, index) => (
                  <div
                    key={index}
                    className="categoryContainer"
                    onClick={() =>
                      addCategory({ name: Category.name, id: Category.id })
                    }
                  >
                    {Category.name}
                  </div>
                ))
                : 'None'}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: 'space-between', width: '100%' }}>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) :
          (
            <p style={{ width: '1px' }}> </p>
          )
        }
        <OverlayBtn onClose={onClose} onSave={goTosave} data={{ ...menu, category: Usecategory }} error={error} />
      </div>

    </>
  );


}