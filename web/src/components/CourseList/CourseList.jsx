import CourseCard from "src/components/CourseCard/CourseCard.jsx";
import styles from "./CourseList.module.css";

export default function CourseList({displayData}) {
  return (
    <ul className={styles.course_container}>
      <CourseCard data={displayData} />
    </ul>
  );
}
