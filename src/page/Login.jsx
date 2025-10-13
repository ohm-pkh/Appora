import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';
import Homesvg from '../assets/Home.svg'
import Gbutton from '../component/Googleauth.jsx';
import '../style/Form.css'

export default function Login() {
    const [error, SetError] = useState('');
    const navigate = useNavigate();

    async function SendForm(e) {
        e.preventDefault();
        SetError('');

        try {
            const email = e.target.userEmail.value;
            const password = e.target.password.value;
            const Result = await axios.post(`http://localhost:3000/LogIn`, {
                email,
                password
            });
            console.log(Result.data.token);
            Cookies.set('token', Result.data.token, {expires:7});
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                try{
                    await axios.get('http://localhost:3000/Verify',
                        {
                            params:{email:e.target.userEmail.value}
                        }
                    )
                }catch(Err){
                    SetError(Err.response.data.message);
                }
                alert('Please Verify your restaurant.');
                navigate(`/RestaurantVerify/${e.target.userEmail.value}`);
            } else {
                console.log(err);
                SetError(err.response.data.message);
            }
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
                    <button type="submit">Login</button>
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
        </>
    );
};