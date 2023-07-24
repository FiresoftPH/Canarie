import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Term from "../TermPage/Term";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/userSlice";
import Transition from "react-transition-group/Transition";
import logo from "../../assets/Logo.svg";
import cmkllogo from "../../assets/CMKL logo.svg";
import axios from "axios";

import Cookies from "js-cookie";

import CourseNames from "./CourseNames.json";
// import { loginAction } from "../../store/loginSlice";

function Login() {
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleGoogleLogin = async () => {
    try {
      const googleAuthUrl = "https://accounts.google.com/o/oauth2/auth";
      const redirectUri = "https://parrot.cmkl.ai"; // Replace with your frontend redirect URL
      const clientId =
        "479838750655-1r50o7kf756vv7s0tpbco8uh25g143mr.apps.googleusercontent.com"; // Replace with your actual client ID
      const scope =
        "openid email profile https://www.googleapis.com/auth/contacts.readonly"; // Specify the scopes you need

      // Construct the URL for Google Sign-In
      const authUrl = `${googleAuthUrl}?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
        scope
      )}`;

      // Open Google Sign-In in the same window without a popup
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const getAccessTokenFromUrl = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substr(1));
    return params.get("access_token");
  };

  const handleLoginFlow = async () => {
    const accessToken = getAccessTokenFromUrl();

    if (accessToken) {
      try {
        // Send the access token to the backend for verification and JWT generation
        const res = await axios.post("https://api.parrot.cmkl.ai/auth/login", {
          token: accessToken,
        });

        localStorage.setItem("LOGGED IN", "I TTINK")

        // Store the JWT token in local storage or cookies for subsequent API requests.
        localStorage.setItem("data", JSON.stringify(res.data))
        navigate("/Course");
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      console.error("Access token not found in URL.");
    }
  };

  // const sendDataToBackend = async () => {
  //   try {
  //     const response = await fetch('/logintest', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         message: 'Hello from Frontend!',
  //         timestamp: Date.now(),
  //       }),
  //     });

  //     if (response.ok) {
  //       console.log('Data sent to backend successfully');
  //     } else {
  //       console.log('Error sending data to backend');
  //     }
  //   } catch (error) {
  //     console.log('Error:', error);
  //   }
  // };

  useEffect(() => {
    dispatch(
      userActions.setUser({
        id: 1,
        name: "Napoleon",
        username: "nwagenen0",
        password: "cG5(SH9M",
        courses: CourseNames,
        status: "user",
      })
    );

    Cookies.set("Screen_Width", window.innerWidth);
    Cookies.set("Screen_Height", window.innerHeight);
    if (window.location.hash.includes("access_token")) {
      handleLoginFlow();
    }
  }, []);

  const modalToggle = () => {
    setShow(!show);
  };

  const loginHandler = () => {
    setTouched(true);

    if (agree === true) {
      handleGoogleLogin();
    }
  };

  const agreeHandler = () => {
    setAgree(true);
    setShow(!show);
  };

  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <img className={styles.logo} src={logo} />
        <p className={styles.app_name}>Parrot</p>
        <div className={styles.quote}>
          <section className={styles.left_text}>
            Let us <br />
            be your
            <br />
            coach.
          </section>
        </div>
        <div className={styles.group}>
          <div onClick={loginHandler} className={styles.api_button}>
            <div className={styles.api}>
              <img src={cmkllogo} />
              <p>Sign in with CMKL account</p>
            </div>
          </div>
          <div className={styles.Term}>
            <form className={styles.agree_term}>
              {/* <p
                onClick={() => {
                  navigate("/Course");
                }}
              >
                I agree with
              </p> */}
              <a onClick={modalToggle}>Terms and Conditions</a>
            </form>
            {/* <div className={styles.accept_button}></div> */}
          </div>
          {touched && !agree && (
            <div className={styles.warning}>
              <p>
                *Please{" "}
                <span
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  agree
                </span>{" "}
                to terms and conditions{" "}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.mask}>
        <div className={styles.red_circle}></div>
        <div className={styles.yellow_circle}></div>
      </div>
      <Transition in={show} timeout={300} mountOnEnter unmountOnExit>
        {(state) => (
          <Term
            show={state}
            agree={agree}
            onAgree={agreeHandler}
            toggle={modalToggle}
          />
        )}
      </Transition>
      {/* {show ? <Term agree={agree} onAgree={agreeHandler} toggle={modalToggle} /> : <></>} */}
    </div>
  );
}

export default Login;
