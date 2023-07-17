import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AssignmentCard from "../AssignmentCard/AssignmentCard";

import styles from "./CourseSlideUp.module.css";

import DownV from "../../assets/DownV.svg";
import LeftV from "../../assets/LeftV.svg";
import UpV from "../../assets/UpV.svg";
import AssignmentList from "../AssignmentList/AssignmentList";

import BigData from '../ChatUI/BigData.json';

const CourseSlideUp = (props) => {
  const [hideCourse, setHideCourse] = useState(false);
  const [hideAss, setHideAss] = useState(false);

  const [chatSelect, setChatSelect] = useState("General");

  const nav = useNavigate()

  const assginmentListSelectHandler = (id) => {
    setChatSelect("Assignment");
    props.onSelectMode(id)
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
                // props.onSelectMode("Assignment 1")
                // console.log(BigData.filter(sub => sub.course === subjectId)[0].assignments[0].assignmentId)
                nav(`../Chat/${subjectId}/${BigData.filter(sub => sub.course === subjectId)[0].assignments[0].assignmentId}`, {
                  replace: true,
                });
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
                <AssignmentList mh={props.mh} onSelect={assginmentListSelectHandler} />
              </>
            ) : (
              ""
            )}
            <div className={styles.line} />
            <section
              onClick={() => {
                setChatSelect("General");
                setHideAss(false)
                props.onSelectMode("General")
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
