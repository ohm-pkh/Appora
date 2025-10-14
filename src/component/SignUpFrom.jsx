import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import WaitingOverlay from './WaitingOverlay';
import axios from "axios";
import Homesvg from '../assets/Home.svg'
import Gbutton from './Googleauth';
import { createApi } from '../function/api';

export default function SignUpform(props) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const { Gemail } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (confirmPassword && confirmPassword !== password) {
            setError("Password mismatch");
        } else {
            setError("");
        }
    }, [password, confirmPassword]);
    async function SendForm(e) {
        e.preventDefault();
        if (!error) {
            try {
                const email = e.target.userEmail.value;
                const password = e.target.password.value;
                setStatus("waiting");
                const api = createApi('Sign_in');
                const res = await axios.post(api, {
                    email,
                    password,
                    role: props.title
                })
                if (res.status !== 200) {
                    throw { message: "Register Fail." };
                } else if (props.title === "Restaurant") {
                    setStatus("");
                    navigate(`/RestaurantVerify/${email}`);
                } else {
                    setStatus("");
                    navigate('/Login');
                }
            } catch (error) {
                setStatus("");
                setError(error.message);
            }
        }

    }

    return (
        <>
            <div className="formContainer">
                <Link to='/'>
                    <img src={Homesvg} alt="Home" id='homelink' />
                </Link>

                <h1>{props.title === "User" ? 'Sign Up' : 'Restaurant Sign Up'}</h1>

                <form onSubmit={SendForm}>
                    <input type="email" name="userEmail" id="email" value={Gemail}  placeholder='Email' />
                    <input type="password" name="password" id="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder='Repeat Password' onChange={(e) => setConfirmPassword(e.target.value)} style={error === "Password mismatch" ? { borderColor: "red" } : {}} />
                    <button type="submit">Sign Up</button>
                </form>

                <div style={{ display: "flex", justifyContent: error ? 'space-between' : 'end' }}>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {props.title === "User" && (
                        <Link to={`/RestaurantSignUp${Gemail ? '/'+Gemail : ''}`}>
                            <p style={{ alignSelf: "end", fontWeight: "bold", color: "#000000" }}>
                                Restaurant Sign Up
                            </p>
                        </Link>
                    )}

                </div>

                {props.title === "User" && (
                    <>
                        <div className="optionSeparator">
                            <hr />
                            <span>or</span>
                            <hr />
                        </div>

                        <Gbutton />
                    </>
                )}



                <div className="accountConfirm">
                    <p style={{ color: '#D9D9D9' }}>Already have an account?</p>
                    <Link to='/Login' style={{ color: '#000000', fontWeight: 'bold' }}><p>Log In</p></Link>
                </div>
            </div>

            <WaitingOverlay status={status} />
        </>
    )

}