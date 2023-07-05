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
import ChatCard from "../ChatCard/ChatCard";
import ChatList from "../ChatList/ChatList";
import CourseSlideUp from "../CourseSlideUp/CourseSlideUp";
import FileList from "../FileList/FileList";

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
  // const [hideCourse, setHideCourse] = useState(false);
  // const [hideAss, setHideAss] = useState(false);

  const chatHeight = useRef(null);
  const [cHeight, setCHeight] = useState(0);

  const [change, setChange] = useState(false);

  useEffect(() => {
    const height =
      Dimension(document.getElementById("total")) -
      Dimension(document.getElementById("assignment")) -
      Dimension(document.getElementById("chat")) -
      // Dimension(document.getElementById("newChatBtn")) -
      Dimension(document.getElementById("file-upload"));

    setCHeight(height - 15);

    // console.log(
    //   Dimension(document.getElementById("total")),
    //   Dimension(document.getElementById("assignment")),
    //   Dimension(document.getElementById("chat")),
    //   Dimension(document.getElementById("newChatBtn")),
    //   Dimension(document.getElementById("file-upload"))
    // );
  }, [change]);

  useEffect(() => {
    setTimeout(() => {
      const height =
        Dimension(document.getElementById("total")) -
        Dimension(document.getElementById("assignment")) -
        Dimension(document.getElementById("chat")) -
        // Dimension(document.getElementById("newChatBtn")) -
        Dimension(document.getElementById("file-upload"));

      setCHeight(height - 15);
    }, 1000);
  }, []);

  const onReRender = () => {
    setChange(!change);
  };

  return (
    <div id="total" className={styles.container}>
      <div className={styles.sidebar_top}>
        <div id="chat" className={styles.top}>
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
          {/* <SearchBox dark holder="Search" /> */}
        </div>
        {/* <ChatList maxHeight={cHeight / 2} /> */}
        {/* <section id="newChatBtn" className={styles.new_chat}>
          <img src="src/assets/New button.svg" />
          <p>New Chat</p>
        </section> */}
        <section id="file-upload" className={styles.file_uploaded}>
          <p>File Uploaded</p>
          <img src="src/assets/Upload.svg" />
        </section>
        <FileList mh={cHeight} />
      </div>
      <CourseSlideUp re_render={onReRender} />
    </div>
  );
}

export default LongSidebar;
