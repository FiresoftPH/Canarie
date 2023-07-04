import CourseCard from "src/components/CourseCard/CourseCard.jsx";
import styles from './CourseList.module.css'

export default function CourseList(props) {
  return (
    <ul className={styles.course_container}>
      <CourseCard data={props.displayData}/>
    </ul>
  );
}