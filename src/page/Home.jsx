import React from 'react'
import {Link} from 'react-router-dom'

export default function Home() {
    return(
        <>
            <h1>On Processing 'ไปทำ Login ก่อน'</h1>
            <Link to="/Login">
                <button style={{ color: "white" }}>Go to Login</button>
            </Link>
        </>
    )
     
}