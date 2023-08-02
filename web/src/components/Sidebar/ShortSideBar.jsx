import styles from "./ShortSideBar.module.css";
import Enlarge from "../../assets/Enlarge.svg";
import { useNavigate } from "react-router-dom";

const ShortSideBar = (props) => {
  const nav = useNavigate();
  const courseID = JSON.parse(localStorage.getItem('course_code')).data
  const cssClasses = [
    styles.container,
    props.show === "entering"
      ? styles.open
      : props.show === "exiting"
      ? styles.close
      : null,
  ];

  return (
    <div className={cssClasses.join(" ")}>
      <div className={styles.top}>
        <img
          onClick={() => {
            props.open();
          }}
          src={Enlarge}
        />
        {/* <img src={SearchIcon} />
        <img src={ChatIcon} />
        <img src={New_Button} /> */}
      </div>
      <div className={styles.bottom}>
        <p
          onClick={() => {
            nav("/Course");
          }}
          className={styles.course}
        >
          Courses
        </p>
        <p>
          { courseID }
        </p>
      </div>
    </div>
  );
};

export default ShortSideBar;
