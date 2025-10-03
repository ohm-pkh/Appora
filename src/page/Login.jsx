import {Link} from 'react-router-dom'
import Homesvg from '../assets/Home.svg'
import Gbutton from '../component/Googleauth.jsx';
import '../style/Form.css'

export default function Login(){
    return(
        <>
            <div className="formContainer">
                <Link to='/'>
                    <img src={Homesvg} alt="Home" id='homelink'/>
                </Link>
                
                <h2>Log In</h2>

                <form action="">
                    <input type="email" name="userEmail" id="email" placeholder='Email'/>
                    <input type="password" name="password" id="password" placeholder='Password'/>
                    <button type="submit">Login</button>
                </form>

                <p style={{textAlign:'end'}}>Forgot password?</p>

                <div className="optionSeparator">
                    <hr />
                    <span>or</span>
                    <hr />
                </div>

                <Gbutton />

                <div className="signUP">
                    <p style={{color:'#D9D9D9'}}>Don't have an account?</p>
                    <Link to='/register' style={{color:'#000000',fontWeight:'bold'}}><p>Sign Up</p></Link>
                </div>
            </div>
        </>
    );
};