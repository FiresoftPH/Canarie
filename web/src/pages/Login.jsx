import { useState } from 'react'
import './Login.css'

function Login() {

  return (
    <>
    <div className="bg-container">
      <div className="glass-layer">
        <div className="logo">logo</div>
        <h1>Macaw</h1>
        <h2>Let us be your coach.</h2>
        <div className="api">api</div>
        <div className="agreeTerm"> I agree with <span>Terms and conditions</span></div>
      </div>
      <div className="mask">
        <div className="red-circle"></div>
        <div className="yellow-circle"></div>
      </div>
    </div>
    </>
  )
}

export default Login
