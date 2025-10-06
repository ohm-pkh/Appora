import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './page/Home.jsx'
import Login from './page/Login.jsx'
import SignUp from './page/SignUp.jsx'
import RestaurantSingUp from './page/RestaurantSignUp.jsx'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <Router basename="/Appora/">
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/Login' element={<Login />}/>
        <Route path='/SignUp' element={<SignUp />}/>
        <Route path='/RestaurantSignUp' element={<RestaurantSingUp />} />
      </Routes>
    </Router>
  )
}

export default App
