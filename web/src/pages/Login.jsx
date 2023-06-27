import { useState } from 'react'
import './Login.css'

function Login() {

  return (
    <>
      <div className="bg-container">
        <div className="glass-layer">
          <div className="logo">logo</div>
          <h1 className="app-name">Macaw</h1>
          <h2 className="quote">Let us be your coach.</h2>
          <div className="api">api</div>
          <form className="agree-term">
            <p>
              I agree with <br /><span>Terms and conditions</span>
            </p> 
          </form>
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
