import { Outlet } from "react-router-dom";
import TopBar from "../../components/AdminComponents/Topbar";
import styles from "./AdminRoot.module.css";

const AdminRoot = () => {
  return (
    <div className={styles.adminWrapper}>
      <div className={styles.background_admin}>
        <div className={styles.mask_A}>
          <div className={styles.red_circle_A}></div>
          <div className={styles.yellow_circle_A}></div>
          <div className={styles.red_circle_B}></div>
          <div className={styles.yellow_circle_B}></div>
        </div>
        <div className={styles.container_admin}>
          <TopBar />
          <Outlet />
        </div>
      </div>
      {/* <TopBar />
      <Outlet /> */}
    </div>
  );
};

export default AdminRoot;
