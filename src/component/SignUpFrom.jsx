import { useState } from 'react';
import { Link } from 'react-router-dom'
import Homesvg from '../assets/Home.svg'
import Gbutton from './Googleauth';

export default function SignUpform(props) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    function checkPassword(e) {
        setConfirmPassword(e.target.value);

        if (confirmPassword !== password) {
            setError("Password mismatch")
        }
    }
    return (
        <>
            <div className="formContainer">
                <Link to='/'>
                    <img src={Homesvg} alt="Home" id='homelink' />
                </Link>

                <h1 style={{ textAlign: 'center' }}>{props.title === "user" ? 'Sign Up' : 'Restaurant Sign Up'}</h1>

                <form action="">
                    <input type="email" name="userEmail" id="email" placeholder='Email' />
                    <input type="password" name="password" id="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder='Repeat Password' onChange={checkPassword} style={error === "Password mismatch" ? { borderColor: "red" } : {}} />
                    <button type="submit">Sign Up</button>
                </form>

                <div style={{ display: "flex", justifyContent: error ? 'space-between':'end' }}>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {props.title === "user" && (
                        <Link to="/RestaurantSignUp">
                            <p style={{ alignSelf: "end", fontWeight: "bold", color: "#000000" }}>
                                Restaurant Sign Up
                            </p>
                        </Link>
                    )}
                </div>

                {props.title === "user" && (
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
        </>
    )

}