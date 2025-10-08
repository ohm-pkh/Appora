import {useState} from 'react'
import {Link} from 'react-router-dom'
import Homesvg from '../assets/Home.svg'
import Gbutton from '../component/Googleauth.jsx';
import '../style/Form.css'

export default function Login(){
    const {error,SetError} = useState('');
    return(
        <>
            <div className="formContainer">
                <Link to='/'>
                    <img src={Homesvg} alt="Home" id='homelink'/>
                </Link>
                
                <h1>Log In</h1>

                <form action="">
                    <input type="email" name="userEmail" id="email" placeholder='Email'/>
                    <input type="password" name="password" id="password" placeholder='Password'/>
                    <button type="submit">Login</button>
                </form>

                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <p style={{color:'red'}}>{error ? error : ' '}</p>
                    <Link to='/ForgotP'>
                        <p style={{textAlign:'end',fontWeight:'bold',color:'#000000'}}>Forgot password?</p>
                    </Link>
                </div>
                
                

                <div className="optionSeparator">
                    <hr />
                    <span>or</span>
                    <hr />
                </div>

                <Gbutton />

                <div className="accountConfirm">
                    <p style={{color:'#D9D9D9'}}>Don't have an account?</p>
                    <Link to='/SignUp' style={{color:'#000000',fontWeight:'bold'}}><p>Sign Up</p></Link>
                </div>
            </div>
        </>
    );
};