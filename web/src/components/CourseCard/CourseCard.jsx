import styles from './Coursecard.module.css'
import { Link } from "react-router-dom";

export default function CourseCard({data}) {
  return (
    <>
      {
        data.map((post) => (
          <Link to={`/Chat/${post.competency_code}/General`} className={styles.card_container} style={post.card_color}>
            <div className={styles.competency_name}>
              <p className={styles.text_code}>{post.competency_code}</p>
              <p className={styles.text_pillar}>{post.pillar}</p>
              <p className={styles.text}>{post.title}</p>
            </div>
          </Link>
        ))
      }
    </>
)}