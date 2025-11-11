import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { createApi } from '../function/api';

export default function Home() {
    const [auth, SetAuth] = useState(false);

    const CheckAuth = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error("token not found.");
            }
            const api = createApi('LogIn');
            const Result = await axios.get(api, {
                params: {
                    token
                }
            })

            if (Result.data.role !== 'User') {
                Cookies.remove('token');
                throw new Error("Not user");
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

    return (
        <>
            <h1>On Processing 'See U on Sprint#3'</h1>
            {
                !auth ?<Link to="/Login">
                <button style={{ color: "white" }}>Go to Log In</button>
            </Link> :
            <button style={{ color: "white",width:"100%" }} onClick={Logout} >Log out</button>
            }
            
        </>
    )

}