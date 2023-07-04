import styles from "./Login.module.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className={styles.background}>
      <div className={styles.content}>
        <img className={styles.logo} src="src/assets/Logo.svg" />
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
              <img src="src/assets/CMKL logo.svg" />
              <p>Sign in with CMKL account</p>
            </div>
          </div>
          <div className={styles.Term}>
            <form className={styles.agree_term}>
              <p>I agree with</p>
              <Link to="/Term">Terms and Conditions</Link>
            </form>
            <div className={styles.accept_button}></div>
          </div>
        </div>
      </div>
      <div className={styles.mask}>
        <div className={styles.red_circle}></div>
        <div className={styles.yellow_circle}></div>
      </div>
    </div>
  );
}

export default Login;
