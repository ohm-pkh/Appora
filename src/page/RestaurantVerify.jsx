import { useState } from "react";
import axios from "axios";
import OTPInput from "../component/VerifyCodeCheck";
import { useParams,useNavigate } from "react-router-dom";

export default function RestaurantVerify() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const { email } = useParams();
    const navigate = useNavigate();
    async function SendForm(e) {
        e.preventDefault();
        try {
            const Result = await axios.post('http://localhost:3000/Verify_Res',
                {
                    Verifycode: code,
                    email
                }
            );
            if(!Result.data.success){
                throw new Error('Verify fail');
            }
            navigate('/Login')
        } catch (err) {
            setError(err.response.data.message);
        }
    }

    async function Resend() {
        try{
            await axios.post('http://localhost:3000/Resend_code',
                {
                    email
                }
            );
        }catch(err){
            setError(err.response.data.message);
        }
    }

    return (
        <>
            <div className="formContainer" style={{ alignItems: "center" }}>
                <h1>Verification Code</h1>
                <p style={{ textWrap: 'true', textAlign: 'center', color: '#D9D9D9', fontSize: '1em' }}>We have sent Verification code to your email address.</p>
                <OTPInput onChangeOTP={(otp) => setCode(otp)} />
                <p style={{color:'#D9D9D9'}}>I didn't receive a code <span style={{fontWeight:'bold',color:'#000000',cursor:'pointer'}} onClick={Resend}>Resend</span></p>
                <p style={{ color: 'red' }}>{error ? error : ' '}</p>
                <button onClick={SendForm}>Verify</button>
            </div>

        </>
    )
}