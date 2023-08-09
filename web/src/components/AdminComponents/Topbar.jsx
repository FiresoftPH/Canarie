import styles from "./TopBar.module.css";
import Linkto from "../../assets/Linkto.svg";
import Logo from "../../assets/Logo.svg";
import { Link, useLocation } from "react-router-dom";

const TopBar = (props) => {
  const curPath = useLocation().pathname;

//   console.log(curPath);

  const paths = [
    { path: "/Admin", name: "Analytics" },
    { path: "/AdminCourse", name: "Courses" },
    { path: "/Student", name: "Student" },
  ];

  return (
    <>
      <div className={styles.nav_bar}>
        <div className={styles.logo_admin}>
          <img src={Logo} />
          <div className={styles.name_admin}>
            <p>Parrot</p>
            <p>Admin</p>
          </div>
        </div>
        <div className={styles.navigation}>
          {paths.map((p) => (
            <Link
              style={{
                textDecoration: "none",
                color: curPath === p.path && "white",
              }}
              to={p.path}
            >
              {p.name}
            </Link>
          ))}
        </div>
        <div className={styles.chat_page}>
          <p>Parrot Chat</p>
          <img src={Linkto} />
        </div>
      </div>
    </>
  );
};

export default TopBar;
