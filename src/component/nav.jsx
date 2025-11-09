import randomSvg from '../assets/randomSvg.svg'
import cartSvg from '../assets/cartSvg.svg'
import filterSvg from '../assets/filterSvg.svg'
import { useNavigate } from 'react-router-dom'

function IndicatorDot({isDot}){
    if(!isDot) return (<div/>);
    return(
        <div style={{height:'40%',aspectRatio:'1/1',backgroundColor:'red',position:'absolute',top:'0',right:'0',borderRadius:'50%',zIndex:'-1',opacity:'0.6'}}>
        </div>
    )
}

export function Nav({auth = false,doLogout,openFilter,isCart,isFilter}) {
    const navigate = useNavigate();
    
    function Login(){
        navigate('/Login');
    }

    return (
        <div className='navBar'>
            <h1 style={{cursor:'pointer'}} onClick={()=>(!auth?Login():doLogout())}>WNGAD</h1>
            <div>
                <span>
                    <img src={randomSvg} alt="random" />
                </span>
                <span>
                    <img src={cartSvg} alt="cart" />
                    <IndicatorDot isDot={isCart}/>
                </span>
                <span onClick={()=>openFilter()}>
                    <img src={filterSvg} alt="filter" />
                    <IndicatorDot isDot={isFilter}/>
                </span>
            </div>
        </div>
    )
}