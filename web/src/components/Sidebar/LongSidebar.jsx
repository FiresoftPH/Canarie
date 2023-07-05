import styles from "./LongSidebar.module.css";
import SearchBox from "src/components/SearchBox/SearchBox";
import AssignmentCard from "../AssignmentCard/AssignmentCard";
import FileCard from "../FileCard/FileCard";
import ScrollBar from "../ScrollBar/ScrollBar";

import DownV from "../../assets/DownV.svg";
import LeftV from "../../assets/LeftV.svg";
import UpV from "../../assets/UpV.svg";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LongSidebar(props) {
  const nav = useNavigate();
  const [hideCourse, setHideCourse] = useState(false);
  const [hideAss, setHideAss] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar_top}>
        <div className={styles.top}>
          <img
            onClick={() => {
              nav("/Course");
            }}
            src="src/assets/Back_Button.svg"
          />
          <p>Macaw Chat</p>
          <img
            onClick={() => {
              props.close();
            }}
            src="src/assets/Collapse.svg"
          />
          <SearchBox dark holder="Search" />
        </div>
        <section className={styles.new_chat}>
          <img src="src/assets/New button.svg" />
          <p>New Chat</p>
        </section>
        <section className={styles.file_uploaded}>
          <p>File Uploaded</p>
          <img src="src/assets/Upload.svg" />
        </section>
        <section className={styles.file_status}>
          <FileCard name="Untitled-1" />
          <FileCard name="Untitled-2" />
          <FileCard name="Untitled-3" />
        </section>
      </div>
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
      >
        <h2>Courses</h2>
        <img
          onClick={() => {
            setHideCourse(!hideCourse);
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
              }}
              src={hideAss ? DownV : LeftV}
            />
            {hideAss ? (
              <>
                <div className={styles.assignments}>
                  <AssignmentCard pressed name="Thingy" />
                  <AssignmentCard name="Thingy2" />
                  <AssignmentCard name="Thingy3" />
                </div>
              </>
            ) : (
              ""
            )}
            <div className={styles.line} />
            <section className={styles.general}># General</section>
          </>
        )}
      </div>
    </div>
  );
}

export default LongSidebar;
