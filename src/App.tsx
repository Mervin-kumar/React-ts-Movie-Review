import { Route, Routes } from "react-router-dom"
import LoginPage from "./LoginPage"
import SignupPage from "./SignupPage"
import Content from "./components/Content"
import { useState } from "react"


const App = () => {
  const [temp,setTemp]=useState<boolean>(false)
  const handleChange=(val:boolean)=>{
    setTemp(val)
  }
  return (
    <div>
      <Routes>
        <Route path="/" element={ <LoginPage onChange={handleChange}/>}/>
        <Route path="/Signup" element={  <SignupPage />}/>
        <Route path="/main" element={<Content  val={temp} onVal={handleChange}/>}/>
        </Routes>       
      
    </div>
  )
}

export default App