import styles from "./QuickActions.module.css";
import MacawIcon from "../../assets/Macaw-admin-nav-icon.svg";
import CourseAdminNavIcon from "../../assets/Course-admin-nav-icon.svg";
import StudentAdminNavIcon from "../../assets/Student-admin-nav-icon.svg";

const QuickActions = (props) => {
  const allActions = [
    { imgPath: MacawIcon, title: "Parrot Chat", desc: ["Chat with Parrot"] },
    {
      imgPath: CourseAdminNavIcon,
      title: "Course",
      desc: ["See the insight in", <br />, "each Compentencies"],
    },
    {
      imgPath: StudentAdminNavIcon,
      title: "Student",
      desc: ["See the Activity", <br />, "and Chatlogs"],
      last: true
    },
  ];

  return (
    <>
      <div className={styles.nav_app}>
        {allActions.map((a) => (
          <>
            <section className={styles.macaw_nav}>
              <section className={styles.nav_app_macaw_icon}>
                <img src={a.imgPath} />
              </section>
              <section className={styles.nav_app_macaw_text}>
                <p>{a.title}</p>
                <p>{a.desc.map(d => d)}</p>
                {!a.last && <section className={styles.horizontal_line}></section>}
              </section>
            </section>
          </>
        ))}
      </div>
    </>
  );
};

export default QuickActions;
