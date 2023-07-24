import styles from "./ChattingCardAI.module.css";

import ParrotIcon from "src/assets/ParrotIcon.svg";
import UserImage from "src/assets/UserImage.svg";
import LikeIcon from "src/assets/LikeIcon.svg";
import DislikeIcon from "src/assets/DislikeIcon.svg";
import FileIcon from "src/assets/FileIcon.svg";
import LikeIconFilled from "src/assets/LikeIconFilled.svg";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { memo } from "react";
import { useMemo } from "react";
import ReactMarkdown from 'react-markdown'


const ChattingCardAI = memo(function ChattingCardAI(props) {
  console.log("ChattingCardAI component is called")

  return (
    <div className={styles.wrapper}>
      <img src={ParrotIcon} />
      {/* {props.assignments
        ? props.assignments.map((assignment) => {


            // return <p>{assignment.name}</p>;
          })
        : ""} */}
      <div className={styles.message}>
        <div>
          {/* <p>{props.message}</p> */}
          <ReactMarkdown className={styles.markdown}>{props.message}</ReactMarkdown>
          <div className={styles.assignmentList}>
            {props.assignments
              ? props.assignments.map((assignment) => {
                  if (assignment !== undefined) {
                    return (
                      <>
                        <p
                          onClick={() => {
                            props.chooseSubject(assignment.id);
                          }}
                        >
                          {assignment.name}
                        </p>
                        &nbsp;&nbsp;&nbsp;
                      </>
                    );
                  }
                })
              : ""}
          </div>
        </div>
        {/* <div className={styles.preference}> */}
        {props.rating === "none" ? (
          <div className={styles.preference}>
            <img
              onClick={() => {
                props.onRate("good", props.id);
              }}
              className={styles.like}
              src={LikeIcon}
            />
            <img
              onClick={() => {
                props.onRate("bad", props.id);
              }}
              src={DislikeIcon}
            />
          </div>
        ) : props.rating === "good" ? (
          <div className={styles.preferenceSelected}>
            <img className={styles.likeFilled} src={LikeIconFilled} />
          </div>
        ) : (
          <div className={styles.preference}>
            <img src={DislikeIcon} />
          </div>
        )}
        {/* </div> */}
      </div>
    </div>
  );
});

export default ChattingCardAI;
