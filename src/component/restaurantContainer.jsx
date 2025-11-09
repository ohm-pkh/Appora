import { Image } from "./ImgUploader"
import '../style/restaurantContainer.css'
import { distanceKm } from "../function/distanceCalCir"
import cartAdd from '../assets/cartAdd.svg'
import cartRemove from '../assets/cartRemove.svg'
import { arrInArrCheck } from "../function/arrInArrCheck"

export function BuildContainer({data, currentLocation, onContainerClick,cartOnClick}){
    return(
        <div className="restaurantContainer" key={data.id}>
                <div onClick={() => onContainerClick(data.id)}>
                    <Image initialSrc={data.photo_path} alt={data.name + ' photo'} circular={false} />
                </div>

                <div className="cardInfo" onClick={() => onContainerClick(data.id)}>
                    <div className="namePrice cardInfoDetail">
                        <strong style={{ width: '50%', height: '1em', marginBottom: '0.5em', }}>{data.name}</strong>
                        <div style={{ width: '50%', height: '1em', marginBottom: '0.5em' }}>Price: {data.min_price === data.max_price ? data.min_price : data.min_price + ' - ' + data.max_price} ฿</div>
                        <div style={{ width: '50%', height: '1em', marginBottom: '0.5em' }}>Distance: {currentLocation.lat ? parseInt(distanceKm(currentLocation.lat, currentLocation.lon, data.lat, data.lon)) : '-'} Km</div>
                    </div>

                    <div className="cardInfoDetail">
                        Description:&nbsp;
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }} title={data.description}>
                            {data.description ?? 'None'}
                        </div>
                    </div>
                    <div className="cardInfoDetail">
                        Types:&nbsp;
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }} title={data?.type?.join(', ')}>
                            {data?.types?.map(t=>t.name).join(', ')}
                        </div>
                    </div>
                </div>

                <div className="cartBtn addCart" onClick={()=>cartOnClick()}>
                    <img src={cartAdd} alt="cartAdd" />
                </div>
            </div>
    )
}

function matchFilter(data, filter, currentLocation){

    // type check
    if(filter.type.length > 0){
        if(!arrInArrCheck(data.types, filter.type)) return false;
    }

    if(filter.category.length > 0){
        if(!arrInArrCheck(data.categories, filter.category)) return false;
    }


    if(filter.price !== null && filter.price <=5 && filter.price > 0){
        const priceMatch = data.min_price <= parseInt('9'.repeat(parseInt(filter.price)));
        if(!priceMatch) return false;
    }

    // distance check
    if(filter.distance !== null && currentLocation.lat){
        const dist = distanceKm(currentLocation.lat,currentLocation.lon,data.lat,data.lon);
        if(dist > filter.distance) return false;
    }

    return true;
}

export function RestaurantContainer({ auth, data, currentLocation, onContainerClick, setOverlay, filter }) {
    console.log(data, filter);
    function cartOnClick() {
        if (!auth) return setOverlay('Unauth');
        console.log('on the way');
    }

    if(!matchFilter(data,filter,currentLocation)){
        return null;
    }

    return (
        <BuildContainer
            data={data}
            currentLocation={currentLocation}
            onContainerClick={onContainerClick}
            cartOnClick={cartOnClick}
        />
    )

}