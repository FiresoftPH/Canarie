import styles from "./PillarList.module.css";
import { motion } from "framer-motion";
import { useState } from "react";
import pillarList from "src/mockDB/Course.json";
import PillarCourseCard from "../PillarCourseCard/PillarCourseCard";
import { useNavigate, useNavigation, useParams } from "react-router-dom";

function PillarList(props) {
  const [selectedPillar, setSelectedPillar] = useState(null);

  const nav = useNavigate()
  const { pillarName } = useParams()
  // console.log(pillarName)

  const handleClick = (name, index) => {
    setSelectedPillar(index);
    nav(`/AdminCourse/${index}`)
  };

  const pillar_output = pillarList.map((pillar, index) => (
    <div
      key={index}
      className={`${styles.pillar_container} ${
        selectedPillar === index ? styles.clicked : ""
      }`}
      onClick={() => handleClick(pillar.pillar_name, index)}
    >
      <div className={styles.pillar_icon}>
        <img src={pillar.icon} alt="" />
      </div>
      <div className={styles.pillar_name}>
        <p>{pillar.pillar_name}</p>
      </div>
    </div>
  ));

  return (
    <div className={styles.course_content}>
      <div className={styles.course_pillar}>
        <div className={styles.course_pillar_title}>
          <p>Courses</p>
          <p>All courses</p>
        </div>
        <section className={styles.line}></section>
        <div className={styles.pillar}>
          <div className={styles.pillar_title}>
            <section className={styles.pillar_list}>{pillar_output}</section>
          </div>
        </div>
      </div>
      <div className={styles.course_list_container}>
        <div className={styles.course_list_title}>
          {pillarName !== undefined && (
            <div className={styles.pillar_content}>
              {pillarList[pillarName].pillar_name}
              <p>
                Number of courses: {pillarList[pillarName].courses.length}
              </p>
            </div>
          )}
        </div>
        {/* <div className={styles.course_list}>
          {selectedPillar !== null && (
            <div className={styles.pillar_course}>
              {pillarList[selectedPillar].courses.map((course, index) => (
                <div key={index}>{course}</div>
              ))}
            </div>
          )}
        </div> */}
        {pillarName !== undefined && (
          <PillarCourseCard courses={pillarList[selectedPillar].courses} />
        )}
      </div>
    </div>
  );
}

export default PillarList;
