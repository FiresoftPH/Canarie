import styles from "./ShortSideBar.module.css";
import Enlarge from "../../assets/Enlarge.svg";
import SearchIcon from "../../assets/Search bar.svg";
import ChatIcon from "../../assets/ChatIcon.svg";
import New_Button from "../../assets/New Button.svg";
import { useNavigate } from "react-router-dom";

const ShortSideBar = (props) => {
  const nav = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <img onClick={() => {
          props.open()
        }} src={Enlarge} />
        {/* <img src={SearchIcon} />
        <img src={ChatIcon} />
        <img src={New_Button} /> */}
      </div>
      <div className={styles.bottom}>
        <p onClick={() => { nav('/Course') }} className={styles.course}>Courses</p>
        <p>AIC-207</p>
      </div>
    </div>
  );
};

export default ShortSideBar;
