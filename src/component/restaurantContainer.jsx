import { Image } from "./ImgUploader"
import '../style/restaurantContainer.css'
import { distanceKm } from "../function/distanceCalCir"
import cartAdd from '../assets/cartAdd.svg'
import cartRemove from '../assets/cartRemove.svg'
import { arrInArrCheck } from "../function/arrInArrCheck"
import { useState, useEffect } from "react"


export function BuildContainer({ data, currentLocation, onContainerClick, cartOnClick, isInCart, isEditCartAllow = true }) {
    console.log('isIncart in container', isInCart);
    return (
        <div className="restaurantContainer" key={data.id}>
            <div onClick={() => onContainerClick(data.id)}>
                <Image initialSrc={data.photo_path} alt={data.name + ' photo'} circular={false} />
            </div>

            <div className="cardInfo" onClick={() => onContainerClick(data.id)}>
                <div className="namePrice cardInfoDetail">
                    <strong style={{ width: '50%', height: '1em', marginBottom: '0.5em', }}>{data.name}</strong>
                    <div style={{ width: '50%', height: '1em', marginBottom: '0.5em' }}>Price: {data.min_price === data.max_price ? data.min_price : data.min_price + ' - ' + data.max_price} ฿</div>
                    <div style={{ width: '50%', height: '1em', marginBottom: '0.5em' }}>Distance: {currentLocation.lat ? Math.round(distanceKm(currentLocation.lat, currentLocation.lon, data.lat, data.lon)) : '-'} Km</div>
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
                        {data?.types?.map(t => t.name).join(', ')}
                    </div>
                </div>
            </div>

            {isEditCartAllow ?
                <div className="cartBtn addCart" onClick={() => cartOnClick(data.id, !isInCart)}>
                    {isInCart ?
                        <img src={cartRemove} alt="cartRemove" />
                        :
                        <img src={cartAdd} alt="cartAdd" />
                    }

                </div>
                :
                ''
            }

        </div>
    )
}

function matchFilter(data, filter, currentLocation) {

    // type check
    if (filter.type.length > 0) {
        if (!arrInArrCheck(data.types, filter.type)) return false;
    }

    if (filter.category.length > 0) {
        if (!arrInArrCheck(data.categories, filter.category)) return false;
    }


    if (filter.price !== null && filter.price <= 5 && filter.price > 0) {
        const priceMatch = data.min_price <= parseInt('9'.repeat(parseInt(filter.price)));
        if (!priceMatch) return false;
    }

    // distance check
    if (filter.distance !== null && currentLocation.lat) {
        const dist = distanceKm(currentLocation.lat, currentLocation.lon, data.lat, data.lon);
        if (dist > filter.distance) return false;
    }

    return true;
}

export function RestaurantContainer({ data, currentLocation, onContainerClick, cartOnClick, filter, cart }) {
    const [isInCart, setIsInCart] = useState(cart.some(item => item.restaurant_id === data.id));

    useEffect(() => {
        setIsInCart(cart.some(item => item.restaurant_id === data.id));
        console.log('cart', cart, 'data.id', data.id);
        console.log("isIncart", isInCart)
    }, [cart, data.id]);


    if (!matchFilter(data, filter, currentLocation)) {
        return null;
    }

    return (
        <BuildContainer
            data={data}
            currentLocation={currentLocation}
            onContainerClick={onContainerClick}
            cartOnClick={cartOnClick}
            isInCart={isInCart}
        />
    )

}

export function InCartRestaurantContainer({ data, currentLocation, onContainerClick, cartOnClick,isEditCartAllow }) {
    console.log(data);

    return (
        <>
            <BuildContainer
                data={data}
                currentLocation={currentLocation}
                onContainerClick={onContainerClick}
                cartOnClick={cartOnClick}
                isInCart={true}
                isEditCartAllow={isEditCartAllow??true}
            />
        </>

    )
}