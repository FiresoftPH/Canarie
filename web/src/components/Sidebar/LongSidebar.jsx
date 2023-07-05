import styles from "./LongSidebar.module.css";
import SearchBox from "src/components/SearchBox/SearchBox";
import AssignmentCard from "../AssignmentCard/AssignmentCard";
import FileCard from "../FileCard/FileCard";
import ScrollBar from "../ScrollBar/ScrollBar";

import DownV from "../../assets/DownV.svg";
import LeftV from "../../assets/LeftV.svg";
import UpV from "../../assets/UpV.svg";

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Dimension(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return Math.ceil(el.offsetHeight + margin);
}

function LongSidebar(props) {
  const nav = useNavigate();
  const [hideCourse, setHideCourse] = useState(false);

  const chatHeight = useRef(null);
  const [cHeight, setCHeight] = useState(0);

  const [hideAss, setHideAss] = useState(false);

  useEffect(() => {
    setCHeight(chatHeight.current.height);
    console.log(chatHeight.current.height);

    // const viewHeight = window.innerHeight;

    const height =
      Dimension(document.getElementById("total")) -
      Dimension(document.getElementById("assignment")) -
      Dimension(document.getElementById("chat")) -
      Dimension(document.getElementById("newChatBtn")) -
      Dimension(document.getElementById("file-upload"));

    setCHeight(height);

    console.log(
      Dimension(document.getElementById("total")),
      Dimension(document.getElementById("assignment")),
      Dimension(document.getElementById("chat")),
      Dimension(document.getElementById("newChatBtn")),
      Dimension(document.getElementById("file-upload"))
    );

    // const fileHeight =
    //   document.getElementById("total").offsetHeight -
    //   document.getElementById("assignment").offsetHeight -
    //   document.getElementById("chat").offsetHeight -
    //   document.getElementById("newChatBtn").offsetHeight -
    //   document.getElementById("file-upload").offsetHeight;

    // console.log(fileHeight);
  });

  return (
    <div id="total" className={styles.container}>
      <div className={styles.sidebar_top}>
        <div ref={chatHeight} id="chat" className={styles.top}>
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
        <section id="newChatBtn" className={styles.new_chat}>
          <img src="src/assets/New button.svg" />
          <p>New Chat</p>
        </section>
        <section id="file-upload" className={styles.file_uploaded}>
          <p>File Uploaded</p>
          <img src="src/assets/Upload.svg" />
        </section>
        <section
          style={{
            maxHeight: cHeight,
          }}
          className={styles.file_status}
        >
          <FileCard selected name="Untitled-1" />
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
        id="assignment"
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
