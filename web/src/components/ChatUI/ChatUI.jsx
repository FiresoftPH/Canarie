import styles from "./ChatUI.module.css";

import ChatIconNoBG from "src/assets/ChatIconNoBG.svg";
import RenameIcon from "src/assets/RenameIcon.svg";
import ClearChatHistoryIcon from "src/assets/ClearChatHistoryIcon.svg";
import ChatInputField from "../ChatInputField/ChatInputField";
import ChatScreen from "../ChatScreen/ChatScreen";
import { useState } from "react";

function Dimension(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginLeft"]) + parseFloat(styles["marginRight"]);

  return Math.ceil(el.offsetWidth + margin);
}

function Dimension2(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return Math.ceil(el.offsetHeight + margin);
}

const ChatUI = (props) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const [assignment, setAssignment] = useState("-")
  
  return (
    <div className={styles.wrapper}>
      <div
        style={{
          width: props.width,
          height: props.height,
        }}
        className={styles.backdrop}
      >
        <div className={styles.yellowCircle} />
        <div className={styles.redCircle} />
      </div>
      <div
        style={{
          width: props.width,
          height: props.height,
        }}
        className={styles.backdrop1}
      />
      <div className={styles.header}>
        <img src={ChatIconNoBG} />
        {/* <p>Permutation and Laplacian (naive)</p> */}
        <p>{}</p>
        <img src={RenameIcon} />
        <img src={ClearChatHistoryIcon} />
        <div className={styles.sepLine} />
      </div>
      <div className={styles.chatting}></div>
      <ChatInputField />
      <ChatScreen />
    </div>
  );
};

export default ChatUI;
