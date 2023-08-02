import styles from "./FileAttachmentModal.module.css";
import FileCard from "../FileCard/FileCard";
import { useState } from "react";
import StaticFileCard from '../FileCard/StaticFileCard.jsx';

const FileAttachmentModal = (props) => {
  return (
    <div className={`${styles.total}`}>
      <div
        className={styles.backdrop}
        onClick={() => {
          props.toggle();
        }}
      />
      <div className={styles.content}>
        <p>
          {props.static ? "The file you asked" : "Please choose which files you want to ask"}
        </p>
        <div className={`${styles.files} ${props.static ? styles.static : ""}`}>
          {props.files[0].map((file) => {
            // console.log(file)

            if (typeof file === "string") {
                return (
                  <StaticFileCard
                    name={file}
                  />
                );
            } else {
                return (
                    <StaticFileCard name={file.name} />
                )
                // console.log(file)
                // return <div></div>
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default FileAttachmentModal;
