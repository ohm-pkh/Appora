import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './page/Home.jsx'
import Login from './page/Login.jsx'
import SignUp from './page/SignUp.jsx'
import RestaurantSingUp from './page/RestaurantSignUp.jsx'
import ForgotPassword from './page/FogotPassword.jsx'
import RestaurantVerify from './page/RestaurantVerify.jsx'
import ResetPassword from './page/ResetPassword.jsx'
import RestaurantPage from './page/RestaurantPage.jsx'
import Preview from './page/Preview.jsx'
import RestaurantFullDetail from './page/RestaurantFullDetail.jsx'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <Router basename="/Appora/">
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/Login' element={<Login />}/>
        <Route path='/SignUp/:Gemail' element={<SignUp />}/>
        <Route path='/RestaurantSignUp/:Gemail' element={<RestaurantSingUp />} />
        <Route path='/SignUp' element={<SignUp />}/>
        <Route path='/RestaurantSignUp' element={<RestaurantSingUp />} />
        <Route path='/ForgotP' element={<ForgotPassword/>}/>
        <Route path='/RestaurantVerify/:email' element={<RestaurantVerify type='Verify_res'/>}/>
        <Route path='/VerifyPasswordRecovery/:email' element={<RestaurantVerify type='Recovery'/>}/>
        <Route path='/ResetPassword/:token' element={<ResetPassword/>}/>
        <Route path='/RestaurantPage' element={<RestaurantPage/>}/>
        <Route path='/Preview' element={<Preview/>}/>
        <Route path='/RestaurantDetail/:id' element={<RestaurantFullDetail/>}/>
      </Routes>
    </Router>
  )
}

export default App
