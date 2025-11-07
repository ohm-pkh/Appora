import { TypeInsert, LocChange, DayTable,MenuForm } from "./restaurantInput";
import { CloseBtn } from "./closeSaveOverlay";

function overlayType(type, params) {

    if (type === 'Types') {
        return (
            <>
                <h2>Edit Type</h2>
                <TypeInsert typesInclude={params.typeInclude} onTypeChange={params.onTypeChange} onClose={params.onClose} />
            </>
        )
    } else if (type === 'Loc') {
        return (
            <>
                <h3>Select Location</h3>
                <LocChange onLocChange={params.onLocChange} defaultPos={params.defaultPos} onClose={params.onClose} />
            </>
        )
    } else if (type === 'Day') {
        return (
            <>
                <h3>Opening hours</h3>
                <DayTable days={params.day} onClose={params.onClose} onSave={params.onSaveDay}/>

            </>

        )
    }else if(type === 'Menu'){
        return(
            <>
                <h3>Add menu</h3>
                <MenuForm onClose={params.onClose} onSave={params.onSaveMenu} currentNewMenu={params.currentNewMenu}/>
            </>
        )
    }else if(type=== 'menuEdit'){
        return(
            <>
                <h3>Edit menu</h3>
                <MenuForm onClose={params.onClose} onSave={params.onSaveMenuChanage} currentNewMenu={params.currentMenu} ></MenuForm>
            </>
        )
    }else if(type === 'Unauth'){
        return(
            <>
                <h3 style={{marginBottom:'0'}}>Please Login</h3>
                <p style={{marginTop:'0'}}>You must Login before use this function</p>
            </>
        )
    }
    else {
        return null;
    }
}

export default function OverlayRestaurantPage(params) {
    const status = params.status
    const action = params.action
    console.log(params);
    if (status !== true) return null; // show only when waiting

    return (
        <div className="overlayBackground">
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px 30px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: '70%',
                    alignItems: "center",
                }}
            >

                {overlayType(action, params)}


            </div>
        </div>
    );
}

export function OverlayHomePage(params) {
    const status = params.status
    const action = params.action
    console.log(params);
    if (status !== true) return null; // show only when waiting

    return (
        <div className="overlayBackground">
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "10px 0 0 0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: '50vw',
                    alignItems: "center",
                }}
            >
                <div style={{margin:'0 2em'}}>
                    {overlayType(action, params)}
                </div>
                
                <div className="homeOverlay">
                    {CloseBtn(params.onClose)}
                    <div className="verticalLine"/>
                    <button onClick={()=>params.Go('/Login')}>Login</button>
                </div>
                

            </div>
        </div>
    );
}