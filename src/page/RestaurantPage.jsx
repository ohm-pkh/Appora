import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom'

export default function RestaurantPage(){
    const [auth, SetAuth] = useState(true);
    const navigate = useNavigate();

    const CheckAuth = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error("token not found.");
            }
            const Result = await axios.get("http://localhost:3000/LogIn", {
                params: {
                    token
                }
            })

            if (Result.data.role !== 'Restaurant') {
                Cookies.remove('token');
                throw new Error("Not Restaurant");
            }
            SetAuth(true)
        } catch {
            SetAuth(false);
        }
    }

    function Logout(){
        Cookies.remove('token');
        SetAuth(false);
    }

    useEffect(() => {
        CheckAuth();
    }, []);

    useEffect(() => {
        if(auth == false){
            navigate('/Login');
        }
    }, [auth]);

    return (
        <>
            <h1>Now you are on Restaurant Page -- On Processing 'See U on Sprint#3'</h1>
            <button style={{ color: "white" }} onClick={Logout}>Log out</button>
            
        </>
    )
}