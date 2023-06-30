import { useState } from "react";
import "./Login.css";

function Login() {
  return (
    <>
      <div className="background">
        <div className="content">
          <div className="logo">
            <img src="src/assets/Logo.svg" />
          </div>
          <h1 className="app-name">Macaw</h1>
          <div className="quote">
            <section className="left-text">
              Let us <br />
              be your
              <br />
              coach.
            </section>
          </div>
          <div className="group">
            <div className="api-button">
              <div className="api">
                <img src="src/assets/CMKL logo.svg" />
                <p>Sign in with CMKL account</p>
              </div>
            </div>
            <div className="Term">
              <form className="agree-term">
                <p>I agree with</p>
                <a>Terms and Conditions</a>
              </form>
              <div className="accept-button"></div>
            </div>
          </div>
        </div>
        <div className="mask">
          <div className="red-circle"></div>
          <div className="yellow-circle"></div>
        </div>
      </div>
    </>
  );
}

export default Login;
