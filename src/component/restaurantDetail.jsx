import { Image } from "./ImgUploader";
import '../style/restaurantDetail.css'

export default function RestaurantDetail({status,info,types,currentDay, location,isEmergency,delivery,menus}){
    console.log(info)
    return(
        <>
            <div className='imgContainerDetail' style={{backgroundImage:`url(${info.photo_path??''})`,display:'flex',justifyContent:'left',alignItems:'end'}}>
                {status==='Preview'?
                <h1>Preview</h1>
                :
                ''
            }
            </div>
            <div className="detailContainer">
                <div style={{backgroundColor:'#D9D9D9', height:'0.3em', width:'3em',placeSelf:'center',margin:'1em 0',borderRadius:'0.2em'}}/>
                <div className="typeDetailContainer">
                    {types.length !== 0 ? types.map((type, index) => (
                        <div key={index} className="typeContainer" style={{ height: '1.5em' }}>
                            {type.type}
                        </div>
                    ))
                        : 'Not define'
                    }
                </div>
            </div>
        </>
    )
}