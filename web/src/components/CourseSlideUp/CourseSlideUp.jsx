import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AssignmentCard from "../AssignmentCard/AssignmentCard";

import styles from "./CourseSlideUp.module.css";

import DownV from "../../assets/DownV.svg";
import LeftV from "../../assets/LeftV.svg";
import UpV from "../../assets/UpV.svg";
import AssignmentList from "../AssignmentList/AssignmentList";

import BigData from "../ChatUI/BigData.json";
import Transition from "react-transition-group/Transition";
import { useRef } from "react";

const CourseSlideUp = (props) => {
  const [hideCourse, setHideCourse] = useState(false);
  const [hideAss, setHideAss] = useState(false);

  const nodeRef = useRef()

  const [chatSelect, setChatSelect] = useState("General");

  const nav = useNavigate();

  const assginmentListSelectHandler = (id) => {
    setChatSelect("Assignment");
    props.onSelectMode(id);
    console.log(chatSelect);
  };

  const { subjectId } = useParams();

  return (
    <>
      <div className={styles.sidebar_below} id="assignment">
        <div className={styles.allVis}>
          <h2>Courses</h2>
          <img
            onClick={() => {
              setHideCourse(!hideCourse);
              props.re_render()
            }}
            src={DownV}
            style={
              hideCourse
                ? {
                    transition: "300ms",
                    rotate: "180deg",
                  }
                : {
                    transition: "300ms",
                    rotate: "0deg",
                  }
            }
          />
        </div>
        <Transition nodeRef={nodeRef} in={!hideCourse} timeout={0} mountOnEnter unmountOnExit>
          {(state) => {
            const cssClasses = [
              styles.latterHalf,
              // state === "entering"
              //   ? styles.latterHalfOpen
              //   : state === "exiting"
              //   ? styles.latterHalfClose
              //   : null,
            ];

            return (
              <div ref={nodeRef} className={cssClasses.join(" ")}>
                <h3>{subjectId}</h3>
                <div
                  className={`${styles.assignmentNav} ${
                    chatSelect === "Assignment" ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setHideAss(!hideAss);
                    props.re_render();
                    setChatSelect("Assignment");
                    nav(
                      `../Chat/${subjectId}/${
                        BigData.filter((sub) => sub.course === subjectId)[0]
                          .assignments[0].assignmentId
                      }`,
                      {
                        replace: true,
                      }
                    );
                  }}
                >
                  <p className={styles.ass}># Assignments</p>
                  <img
                    className={`${styles.assDropDown}`}
                    style={
                      hideAss
                        ? {
                            transition: "300ms",
                            rotate: "0deg",
                          }
                        : {
                            transition: "300ms",
                            rotate: "90deg",
                          }
                    }
                    src={DownV}
                  />
                </div>
                <Transition
                  in={hideAss}
                  timeout={150}
                  mountOnEnter
                  unmountOnExit
                >
                  {(state) => (
                    <AssignmentList
                      // mh={props.mh}
                      show={state}
                      onSelect={assginmentListSelectHandler}
                    />
                  )}
                </Transition>
                {/* {hideAss ? <></> : ""} */}
                <div className={styles.line} />
                <section
                  onClick={() => {
                    setChatSelect("General");
                    setHideAss(false);
                    props.onSelectMode("General");
                    props.re_render();
                  }}
                  className={`${styles.general} ${
                    chatSelect === "General" ? styles.selected : ""
                  }`}
                >
                  # General
                </section>
              </div>
            );
          }}
        </Transition>
      </div>
    </>
  );
};

export default CourseSlideUp;
