import {Link} from 'react-router-dom'
import Homesvg from '../assets/Home.svg'
import '../style/Form.css'

export default function Login(){
    return(
        <>
            <div className="formContainer">
                <Link to='/'>
                    <img src={Homesvg} alt="Home" id='homelink'/>
                </Link>
                
                <h1>LOGIN</h1>
                <form action="">
                    <input type="email" name="userEmail" id="email" placeholder='Email'/>
                    <input type="password" name="password" id="password" placeholder='Password'/>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    );
};