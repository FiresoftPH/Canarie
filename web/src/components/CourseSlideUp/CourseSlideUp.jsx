import { useState } from "react";
import { useParams } from "react-router-dom";

import AssignmentCard from "../AssignmentCard/AssignmentCard";

import styles from "./CourseSlideUp.module.css";

import DownV from "../../assets/DownV.svg";
import LeftV from "../../assets/LeftV.svg";
import UpV from "../../assets/UpV.svg";
import AssignmentList from "../AssignmentList/AssignmentList";

const CourseSlideUp = (props) => {
  const [hideCourse, setHideCourse] = useState(false);
  const [hideAss, setHideAss] = useState(false);

  const [chatSelect, setChatSelect] = useState("General");

  const assginmentListSelectHandler = (id) => {
    setChatSelect("Assignment");
    console.log(chatSelect)
  };
  
  const { subjectId } = useParams()

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
                gap: ".5rem",
              }
        }
        id="assignment"
      >
        <h2>Courses</h2>
        <img
          onClick={() => {
            setHideCourse(!hideCourse);
            props.re_render();
          }}
          src={hideCourse ? UpV : DownV}
        />
        {hideCourse ? (
          ""
        ) : (
          <>
            <h3>{subjectId}</h3>
            <div
              className={`${styles.assignmentNav} ${
                chatSelect === "Assignment" ? styles.selected : ""
              }`}
              onClick={() => {
                setHideAss(!hideAss);
                props.re_render();
                setChatSelect("Assignment");
              }}
            >
              <p
                // onClick={() => {
                //   setHideAss(!hideAss);
                //   props.re_render();
                // }}
                className={styles.ass}
              >
                # Assignments
              </p>
              <img
                // onClick={() => {
                //   setHideAss(!hideAss);
                //   props.re_render();
                // }}
                className={styles.assDropDown}
                src={hideAss ? DownV : LeftV}
              />
            </div>
            {hideAss ? (
              <>
                {/* <div className={styles.assignments}>
                  <AssignmentCard pressed name="Thingy" />
                  <AssignmentCard name="Thingy2" />
                  <AssignmentCard name="Thingy3" />
                </div> */}
                <AssignmentList onSelect={assginmentListSelectHandler} />
              </>
            ) : (
              ""
            )}
            <div className={styles.line} />
            <section
              onClick={() => {
                setChatSelect("General");
                setHideAss(false)
                props.re_render()
              }}
              className={`${styles.general} ${
                chatSelect === "General" ? styles.selected : ""
              }`}
            >
              # General
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default CourseSlideUp;
