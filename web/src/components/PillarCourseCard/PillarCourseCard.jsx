import React from "react";
import styles from "./PillarCourseCard.module.css";

function PillarCourseCard({ courses }) {
  return (
    <div className={styles.container_course}>
      {courses.map((course, index) => (
        <div className={styles.text} key={index}>
          {course}
        </div>
      ))}
    </div>
  );
}

export default PillarCourseCard;
