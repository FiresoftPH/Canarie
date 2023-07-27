import styles from './Coursecard.module.css'
import { Link } from "react-router-dom";

export default function CourseCard({data}) {
  return (
    <>
      {
        data.map((post) => (
          <Link to={`/Chat/${post.competency_code}/General`} className={styles.container}>
            <div className={styles.competency_name}>
              <p className={styles.text}>{post.pillar} {post.competency_code}</p>
              <p className={styles.text}>{post.title}</p>
            </div>
          </Link>
        ))
      }
    </>

)}