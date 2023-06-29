import { useState } from 'react'
import './Login.css'

function Login() {

  return (
    <>
      <div className="bg-container">
        <div className="glass-layer">
          <div className="logo">
            <img src="src/assets/Logo.svg"/>
          </div>
          <h1 className="app-name">Macaw</h1>
          <div className= "quote">
            <h2>Let us <br />be your<br />coach.</h2>
          </div>
          <div className="api">
          <img src="src/assets/CMKL logo.svg"/>
            <p>Sign in with CMKL account</p>
            </div>
          <div className="Term">
            <form className="agree-term">
             <p>I agree with</p> 
             <a>Terms and Conditions</a>
            </form>
            <div className="accept-button"></div>
          </div>
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
