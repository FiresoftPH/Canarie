import styles from './Coursecard.module.css'
import { Link } from "react-router-dom";

export default function CourseCard(props) {
  return (
    <>
      {
        props.data.map((post) => (
          <Link to="/Chat" className={styles.container} key={post.id}>
            <p className={styles.text}>{post.course_name1}</p>
          </Link>
        ))
      }
    </>

)}