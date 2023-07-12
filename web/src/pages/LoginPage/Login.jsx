import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Term from "../TermPage/Term";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/userSlice";

import Cookies from 'js-cookie';

import CourseNames from './CourseNames.json';

function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

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

    Cookies.set("Screen_Width", window.innerWidth)
    Cookies.set("Screen_Height", window.innerHeight)
  }, []);



  const modalToggle = () => {
    setShow(!show);
  };

  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <img className={styles.logo} src="/src/assets/Logo.svg" />
        <p className={styles.app_name}>Macaw</p>
        <div className={styles.quote}>
          <section className={styles.left_text}>
            Let us <br />
            be your
            <br />
            coach.
          </section>
        </div>
        <div className={styles.group}>
          <div className={styles.api_button}>
            <div className={styles.api}>
              <img src="/src/assets/CMKL logo.svg" />
              <p>Sign in with CMKL account</p>
            </div>
          </div>
          <div className={styles.Term}>
            <form className={styles.agree_term}>
              <p
                onClick={() => {
                  navigate("/Course");
                }}
              >
                I agree with
              </p>
              <a onClick={modalToggle}>Terms and Conditions</a>
            </form>
            <div className={styles.accept_button}></div>
          </div>
        </div>
      </div>
      <div className={styles.mask}>
        <div className={styles.red_circle}></div>
        <div className={styles.yellow_circle}></div>
      </div>

      {show ? <Term toggle={modalToggle} /> : <></>}
    </div>
  );
}

export default Login;
