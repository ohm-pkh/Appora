import { Image } from "./ImgUploader"
import '../style/restaurantContainer.css'
import { distanceKm } from "../function/distanceCalCir"
import cartAdd from '../assets/cartAdd.svg'
import cartRemove from '../assets/cartRemove.svg'

export function RestaurantContainer({auth,data,currentLocation,onContainerClick,setOverlay}){
    function cartOnClick(){
        if(!auth)return setOverlay('Unauth');
        console.log('on the way');
    }
    return(
        <div className="restaurantContainer" key={data.id}>
            <div onClick={()=>onContainerClick(data.id)}>
                <Image initialSrc={data.photo_path} alt={data.name+' photo'} circular={false}/>
            </div>
            
            <div className="cardInfo" onClick={()=>onContainerClick(data.id)}>
                <div className="namePrice cardInfoDetail">
                    <strong style={{ width: '50%', height: '1em', marginBottom: '0.5em', }}>{data.name}</strong>
                    <div style={{ width: '50%', height: '1em', marginBottom: '0.5em' }}>Price: {data.min_price===data.max_price?data.min_price:data.min_price+' - '+data.max_price} ฿</div>
                    <div style={{ width: '50%', height: '1em', marginBottom: '0.5em' }}>Distance: {currentLocation.lat?parseInt(distanceKm(currentLocation.lat,currentLocation.lon,data.lat,data.lon)):'-'} Km</div>
                </div>

                <div className="cardInfoDetail">
                    Description:&nbsp;
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign:'left' }} title={data.description}>
                        {data.description ?? 'None'}
                    </div>
                </div>
                <div className="cardInfoDetail">
                    Types:&nbsp;
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,textAlign:'left' }} title={data?.type?.join(', ')}>
                        {data?.type?.join(', ')}
                    </div>
                </div>
            </div>

            <div className="cartBtn addCart" onClick={cartOnClick}>
                <img src={cartAdd} alt="cartAdd" />
            </div>
        </div>
    )
}