import styles from './Coursecard.module.css'
import { Link } from "react-router-dom";

export default function CourseCard(props) {
  return (
    <>
      {
        props.data.map((post) => (
          <Link to={`/Chat/${post}/General`} className={styles.container}>
            <p className={styles.text}>{post}</p>
          </Link>
        ))
      }
    </>

)}