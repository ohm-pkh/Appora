import randomSvg from '../assets/randomSvg.svg'
import cartSvg from '../assets/cartSvg.svg'
import filterSvg from '../assets/filterSvg.svg'
import { useNavigate } from 'react-router-dom'
import goBackArrow from '../assets/goBackArrow.svg'

function IndicatorDot({isDot}){
    if(!isDot) return (<div/>);
    return(
        <div style={{height:'40%',aspectRatio:'1/1',backgroundColor:'red',position:'absolute',top:'0',right:'0',borderRadius:'50%',zIndex:'-1',opacity:'0.6'}}>
        </div>
    )
}

export function Nav({auth = false,doLogout,openFilter,isCart,isFilter,onCartClick}) {
    const navigate = useNavigate();
    
    function Login(){
        navigate('/Login');
    }

    return (
        <div className='navBar'>
            <h1 style={{cursor:'pointer'}} onClick={()=>(!auth?Login():doLogout())}>WNGAD</h1>
            <div>
                <span onClick={()=>navigate('/Random')}>
                    <img src={randomSvg} alt="random" />
                </span>
                <span onClick={()=>onCartClick()}>
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

export function NavCart({onRandom}) {
    const navigate = useNavigate();
    return (
        <div className='navBar'>
            <div>
                <span onClick={()=>navigate(-1)}>
                    <img src={goBackArrow} alt="goBack" />
                </span>
            </div>
            <h1 style={{margin:'0'}}>Cart</h1>
            <div>
                <span onClick={onRandom}>
                    <img src={randomSvg} alt="random" />
                </span>
            </div>
                
        </div>
    )
}


export function NavRandom() {
    const navigate = useNavigate();
    
    function Login(){
        navigate('/Login');
    }

    return (
        <div className='navBar'>
            <div>
                <span onClick={()=>navigate(-1)}>
                    <img src={goBackArrow} alt="goBack" />
                </span>
            </div>
            <h1 style={{margin:'0'}}>Random</h1>
            <div>
                <span style={{height:'100%',aspectRatio:'1/1'}}>
                    
                </span>
            </div>
                
        </div>
    )
}