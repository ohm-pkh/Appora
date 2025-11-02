import { TypeInsert, LocChange, DayTable } from "./restaurantInput";

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
    }
    else {
        return null;
    }
}

export default function OverlayRestaurantPage(params) {
    const status = params.status
    const action = params.action
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