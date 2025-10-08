import React from 'react'
import { Link } from 'react-router-dom'
import Homesvg from '../assets/Home.svg'

export default function ForgotPassword() {
    return (
        <>
            <div className="formContainer" style={{gap:'20px'}}>
                <Link to='/'>
                    <img src={Homesvg} alt="Home" id='homelink'/>
                </Link>

                <div>
                    <h1>Forgot Password</h1>
                    <p style={{ textWrap: 'true', textAlign:'center', color:'#D9D9D9', fontSize:'0.7em'}}>Please enter the email address associated with your account. We'll send you a verification code to reset your password.</p>
                </div>
                
                <form action="">
                    <input type="email" id="email" placeholder='Email' />
                    <button type="submit">Send Email</button>
                </form>

                <div className="accountConfirm">
                    <p style={{ color: '#D9D9D9' }}>Return to login?</p>
                    <Link to='/Login' style={{ color: '#000000', fontWeight: 'bold' }}><p>Log In</p></Link>
                </div>
            </div>
        </>

    )

}