import { useState,useEffect } from "react";
import WaitingOverlay from "../component/WaitingOverlay";
import axios from "axios";
import OTPInput from "../component/VerifyCodeCheck";
import { useParams,useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [Npassword, setNpassword] = useState("");
    const [Cpassword, setCpassword] =useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (Cpassword && Cpassword !== Npassword) {
            setError("Password mismatch");
        } else {
            setError("");
        }
    }, [Npassword, Cpassword]);

    async function SendForm(e) {
        e.preventDefault();
        try{
            setStatus("waiting");
            console.log(status);
            const Result = await axios.post('http://localhost:3000/Reset_pass',
                {
                    token,
                    password: Npassword
                }
            );
            console.log(Result);
            if(!Result.data.success){
                setError('Reset fail!');
            }else{
                setStatus("");
                alert("Reset password success.")
                navigate('/Login');
            }
            
        }catch(err){
            setStatus("");
            setError(err.response.data.message);
        }
    }
    
    return (
        <>
            <div className="formContainer">
                <h1>Reset your Password</h1>
                <p style={{ textWrap: 'true', textAlign: 'center', color: '#D9D9D9', fontSize: '1em' }}>We have sent Verification code to your email address.</p>
                <form onSubmit={SendForm}>
                    <input type="password" name="NewPassword" placeholder="New Password" onChange={(e)=>{setNpassword(e.target.value)}}/>
                    <input type="password" name="ConfirmPassword" placeholder="Confirm Password" onChange={(e)=>{setCpassword(e.target.value)}}/>
                    <button type="submit">Reset</button>
                </form>
                <p style={{ color: 'red' }}>{error ? error : ' '}</p>
            </div>

            <WaitingOverlay status={status} />
        </>
    )
}