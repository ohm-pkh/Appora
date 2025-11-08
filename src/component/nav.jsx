import randomSvg from '../assets/randomSvg.svg'
import cartSvg from '../assets/cartSvg.svg'
import filterSvg from '../assets/filterSvg.svg'
import { useNavigate } from 'react-router-dom'

export function Nav({auth = false,doLogout,openFilter}) {
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
                </span>
                <span onClick={()=>openFilter()}>
                    <img src={filterSvg} alt="filter" />
                </span>
            </div>
        </div>
    )
}