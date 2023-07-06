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

const DUMMY_TEXT_DATA = [
  { id: 0, sender: "user", message: "i need help with this and stuff and stuff and stuff and stuff and stuff and stuff and stuff and stuff" },
  { id: 1, sender: "ai", message: "ok sure. which one you need help" },
];

const ChatUI = (props) => {
  let chatName = props.mode;

  if (props.mode === "General") {
    chatName = "-";
  }

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [assignment, setAssignment] = useState("-");

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
        <p>{chatName}</p>
        <img src={RenameIcon} />
        <img src={ClearChatHistoryIcon} />
        <div className={styles.sepLine} />
      </div>
      <div className={styles.chatting}></div>
      <ChatScreen history={DUMMY_TEXT_DATA} />
      <ChatInputField />
    </div>
  );
};

export default ChatUI;
