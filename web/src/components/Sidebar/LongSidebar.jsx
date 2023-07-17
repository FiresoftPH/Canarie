import styles from "./LongSidebar.module.css";
import SearchBox from "src/components/SearchBox/SearchBox";
import AssignmentCard from "../AssignmentCard/AssignmentCard";
import FileCard from "../FileCard/FileCard";
import ScrollBar from "../ScrollBar/ScrollBar";

import DownV from "../../assets/DownV.svg";
import LeftV from "../../assets/LeftV.svg";
import UpV from "../../assets/UpV.svg";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ChatCard from "../ChatCard/ChatCard";
import ChatList from "../ChatList/ChatList";
import CourseSlideUp from "../CourseSlideUp/CourseSlideUp";
import FileList from "../FileList/FileList";
import { useSelector } from "react-redux";

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
  const [mode, setMode] = useState("General");

  const [file, setFile] = useState();
  const data = useSelector((state) => state.bigData);
  const code = useSelector((state) => state.chat.code);

  const { subjectId, assignmentId } = useParams();

  useEffect(() => {
    const height =
      Dimension(document.getElementById("total")) -
      Dimension(document.getElementById("assignment")) -
      Dimension(document.getElementById("chat")) -
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
        Dimension(document.getElementById("file-upload"));

      setCHeight(height - 20);
    }, 1000);
  }, []);

  const onReRender = () => {
    setChange(!change);
  };

  const selectModeHandler = (id) => {
    setMode(id);
    console.log(id);
    props.onSelectMode(id);
  };

  const fileDownloadHandler = (f) => {
    console.log(file);
    console.log(data);

    const transformedData = data
      .filter((sub) => sub.course === subjectId)[0]
      .assignments.filter((ass) => ass.assignmentId === assignmentId)[0]
      .files.filter((f) => f.id === file)[0];

    console.log(transformedData);

    let fType = 'text/plain';

    if (fType.includes(".")) {
      fType = { type: `text/${transformedData.name[transformedData.name.length - 1]}` }
    }

    const blob = new Blob([transformedData.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = transformedData.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="total" className={styles.container}>
      <div className={styles.sidebar_top}>
        <div id="chat" className={styles.top}>
          <img
            onClick={() => {
              nav("/Course");
            }}
            src="/src/assets/Back_Button.svg"
          />
          <p>Macaw Chat</p>
          <img
            onClick={() => {
              props.close();
            }}
            src="/src/assets/Collapse.svg"
          />
          <div className={styles.sepLine} />
          {/* <SearchBox dark holder="Search" /> */}
        </div>
        {/* <ChatList maxHeight={cHeight / 2} /> */}
        {/* <section id="newChatBtn" className={styles.new_chat}>
          <img src="src/assets/New button.svg" />
          <p>New Chat</p>
        </section> */}
        <section id="file-upload" className={styles.file_uploaded}>
          <p>File Uploaded</p>
          <img onClick={fileDownloadHandler} src="/src/assets/Upload.svg" />
        </section>
        <FileList
          sf={(f) => {
            setFile(f);
          }}
          mh={cHeight}
        />
      </div>
      <CourseSlideUp mh={cHeight} onSelectMode={selectModeHandler} re_render={onReRender} />
    </div>
  );
}

export default LongSidebar;
