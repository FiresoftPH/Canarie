import styles from './Coursecard.module.css'
import { useEffect } from 'react';
import { Link } from "react-router-dom";

export default function CourseCard({data}) {
  return (
    <>
      {
        data.map((post) => (
          <Link to={`/Chat/${post.title}/General`} className={styles.container}>
            <div className={styles.competency_name}>
              <p className={styles.text}>{post.competency_code}</p>
              <p className={styles.text}>{post.title}</p>
              <p className={styles.text}>{post.pillar}</p>
            </div>
          </Link>
        ))
      }
    </>

)}