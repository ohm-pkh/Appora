import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import WaitingOverlay from '../component/WaitingOverlay.jsx';
import Cookies from 'js-cookie';
import { createApi } from '../function/api.js';
import Homesvg from '../assets/Home.svg'
import Gbutton from '../component/Googleauth.jsx';
import OverlayHomePage from '../component/Overlay.jsx';
import '../style/Form.css'

export default function Login() {
    const [error, SetError] = useState('');
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    async function SendForm(e) {
        e.preventDefault();
        SetError('');

        try {
            const email = e.target.userEmail.value;
            const password = e.target.password.value;
            setStatus("waiting");
            const api = createApi('LogIn');
            const Result = await axios.post(api, {
                email,
                password
            });
            setStatus("");
            console.log(Result.data.token);
            Cookies.set('token', Result.data.token, {expires:7});
            if(Result.data.role === 'Restaurant'){
                navigate('/RestaurantPage');
            }else{
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 403) {
                try{
                    const api = createApi('Verify');
                    await axios.get(api,
                        {
                            params:{email:e.target.userEmail.value}
                        }
                    )
                }catch(Err){
                    SetError(Err.response.data.message);
                }
                setStatus("");
                alert('Please Verify your restaurant.');
                navigate(`/RestaurantVerify/${e.target.userEmail.value}`);
            } else {
                console.log(err);
                SetError(err.response.data.message);
            }
            setStatus("");
        }


    }

    return (
        <>
            <div className="formContainer">
                <Link to='/'>
                    <img src={Homesvg} alt="Home" id='homelink' />
                </Link>

                <h1>Log In</h1>

                <form onSubmit={SendForm}>
                    <input type="email" name="userEmail" id="email" placeholder='Email' />
                    <input type="password" name="password" id="password" placeholder='Password' />
                    <button type="submit" style={{width:"100%"}}>Login</button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ color: 'red' }}>{error ? error : ' '}</p>
                    <Link to='/ForgotP'>
                        <p style={{ textAlign: 'end', fontWeight: 'bold', color: '#000000' }}>Forgot password?</p>
                    </Link>
                </div>



                <div className="optionSeparator">
                    <hr />
                    <span>or</span>
                    <hr />
                </div>

                <Gbutton />

                <div className="accountConfirm">
                    <p style={{ color: '#D9D9D9' }}>Don't have an account?</p>
                    <Link to='/SignUp' style={{ color: '#000000', fontWeight: 'bold' }}><p>Sign Up</p></Link>
                </div>
            </div>

            <WaitingOverlay status={status} />
        </>
    );
};