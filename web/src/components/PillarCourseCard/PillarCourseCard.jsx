import React from "react";
import styles from "./PillarCourseCard.module.css";

function PillarCourseCard({ courses }) {
  return (
    <div className={styles.container_course}>
      {courses.map((course, index) => (
        <div className={styles.card} key={index}>
          {/* <img className={styles.photo_cover} src="src/assets/DemoPic.svg" /> */}
          <section className={styles.photo_cover}></section>
          <section className={styles.text}>
            <p className={styles.sub_text}>{course}</p>
          </section>
        </div>
      ))}
    </div>
  );
}

export default PillarCourseCard;
