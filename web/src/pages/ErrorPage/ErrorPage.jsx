import { Link, useRouteError } from "react-router-dom";
import styles from "./ErrorPage.module.css";

import logo from "../../assets/Logo.svg";

const ErrorPage = (props) => {
  const error = useRouteError();

  return (
    <>
      <div className={styles.background}>
        <div className={styles.content}>
          {/* <div className={styles.left}>
            <img className={styles.parrotLogo} src={logo} />
          </div> */}
          <div className={styles.right}>
            <p>{props.message}</p>
            <Link to={props.back}>Go Back To {props.name}</Link>
          </div>
        </div>
        <div className={styles.mask}>
          <div className={styles.red_circle}></div>
          <div className={styles.yellow_circle}></div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
