import React from "react";
import styles from "./PillarCourseCard.module.css";
import { Link, useParams } from "react-router-dom";

function PillarCourseCard({ courses }) {
  const amount = courses.length % 4;

  const filler = [];

  // console.log(amount);
  for (let i = 0; i < amount; i++) {
    filler.push(<div style={{ width: "1px", height: "1px" }}></div>);
  }

  // console.log(filler);

  // const {  } = useParams()

  return (
    <div
      style={{
        gridTemplateRows: `repeat(${Math.ceil(courses.length / 4)}, 15rem)`,
      }}
      className={styles.container_course}
    >
      {courses.map((course, index) => (
        <Link to={`/AdminCourse/${course}`} style={{ textDecoration: "none" }} className={styles.card} key={index}>
          {/* <img className={styles.photo_cover} src="src/assets/DemoPic.svg" /> */}
          <section className={styles.photo_cover}></section>
          <section className={styles.text}>
            <p className={styles.sub_text}>{course}</p>
          </section>
        </Link>
      ))}
      {filler.map((s) => s)}
    </div>
  );
}

export default PillarCourseCard;
