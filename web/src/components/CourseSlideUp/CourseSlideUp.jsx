import { useState } from "react";


import AssignmentCard from "../AssignmentCard/AssignmentCard";

import styles from "./CourseSlideUp.module.css";

import DownV from "../../assets/DownV.svg";
import LeftV from "../../assets/LeftV.svg";
import UpV from "../../assets/UpV.svg";
import AssignmentList from "../AssignmentList/AssignmentList";

const CourseSlideUp = (props) => {
  const [hideCourse, setHideCourse] = useState(false);
  const [hideAss, setHideAss] = useState(false);

  return (
    <>
      <div
        className={styles.sidebar_below}
        style={
          hideCourse
            ? {
                gap: "0rem",
              }
            : {
                gap: ".8rem",
              }
        }
        id="assignment"
      >
        <h2>Courses</h2>
        <img
          onClick={() => {
            setHideCourse(!hideCourse);
            props.re_render()
          }}
          src={hideCourse ? UpV : DownV}
        />
        {hideCourse ? (
          ""
        ) : (
          <>
            <h3>Discrete Mathematics</h3>
            <p className={styles.ass}># Assignments</p>
            <img
              onClick={() => {
                setHideAss(!hideAss);
                props.re_render()
              }}
              src={hideAss ? DownV : LeftV}
            />
            {hideAss ? (
              <>
                {/* <div className={styles.assignments}>
                  <AssignmentCard pressed name="Thingy" />
                  <AssignmentCard name="Thingy2" />
                  <AssignmentCard name="Thingy3" />
                </div> */}
                <AssignmentList />
              </>
            ) : (
              ""
            )}
            <div className={styles.line} />
            <section className={styles.general}># General</section>
          </>
        )}
      </div>
    </>
  );
};

export default CourseSlideUp;
