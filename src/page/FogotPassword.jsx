import { useState } from 'react'; 
import axios from 'axios';
import WaitingOverlay from '../component/WaitingOverlay';
import { Link, useNavigate } from 'react-router-dom'
import Homesvg from '../assets/Home.svg'

export default function ForgotPassword() {
    const [status, setStatus] = useState("");
    const [email, setEmail] = useState('');
    const [error, SetError] = useState('');
    const navigate = useNavigate();

    async function handdleSend(e) {
        e.preventDefault();
        try {
            setStatus("waiting");
            console.log(status);
            await axios.get('http://localhost:3000/ForPass', {
                params: { email: email }
            });
            setStatus("");
            navigate(`/VerifyPasswordRecovery/${email}`);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                try{
                    await axios.get('http://localhost:3000/Verify',
                        {
                            params: {email:email}
                        }
                    )
                }catch(Err){
                    SetError(Err.response.data.message);
                }
                setStatus("");
                alert('Please Verify your restaurant.');
                navigate(`/RestaurantVerify/${email}`);
            } else {
                console.log(err);
                SetError(err.response.data.message);
            }
            setStatus("");
        }
    }

    return (
        <>
            <div className="formContainer" style={{ gap: '20px' }}>
                <Link to='/'>
                    <img src={Homesvg} alt="Home" id='homelink' />
                </Link>

                <div>
                    <h1>Forgot Password</h1>
                    <p style={{ textWrap: 'true', textAlign: 'center', color: '#D9D9D9', fontSize: '0.7em' }}>Please enter the email address associated with your account. We'll send you a verification code to reset your password.</p>
                </div>

                <form onSubmit={handdleSend}>
                    <input type="email" id="email" placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
                    <button type="submit">Send Email</button>
                </form>

                <p style={{ color: 'red' }}>{error ? error : ' '}</p>

                <div className="accountConfirm">
                    <p style={{ color: '#D9D9D9' }}>Return to login?</p>
                    <Link to='/Login' style={{ color: '#000000', fontWeight: 'bold' }}><p>Log In</p></Link>
                </div>
            </div>

            <WaitingOverlay status={status} />
        </>

    )

}