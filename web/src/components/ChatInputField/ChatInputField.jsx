import styles from "./ChatInputField.module.css";

import FileAttachmentIcon from "src/assets/FileAttachmentIcon.svg";
import SendIcon from "src/assets/SendIcon.svg";
import { useState } from "react";

const ChatInputField = (props) => {
  const [question, setQuestion] = useState("");

  return (
    <div className={styles.wrapper}>
      <div className={styles.attachment}>
        <img src={FileAttachmentIcon} />
      </div>
      <div className={styles.searchBar}>
        <input
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
          value={question}
          className={styles.inputField}
        />
        <img
          onClick={() => {
            if (question === "") {
              return;
            }
            props.onSend(question);
            setQuestion("")
          }}
          className={styles.send}
          src={SendIcon}
        />
      </div>
    </div>
  );
};

export default ChatInputField;
