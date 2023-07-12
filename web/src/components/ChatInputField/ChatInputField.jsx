import styles from "./ChatInputField.module.css";

import FileAttachmentIcon from "src/assets/FileAttachmentIcon.svg";
import SendIcon from "src/assets/SendIcon.svg";
import { useState } from "react";

const ChatInputField = (props) => {
  const [question, setQuestion] = useState("");

  const askHandler = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (question === "") {
      return;
    }
    props.onSend(question);
    setQuestion("");
  };

  return (
    <div className={styles.wrapper}>
      <div
        onClick={() => {
          if (props.lock === false) props.onFileAttach();
        }}
        className={`${styles.attachment} ${props.lock ? styles.locked : ""}`}
      >
        <img src={FileAttachmentIcon} />
      </div>
      <div className={`${styles.searchBar} ${props.lock ? styles.locked : ""}`}>
        <form
          onSubmit={(e) => {
            askHandler(e);
          }}
        >
          {props.lock ? (
            ""
          ) : (
            <input
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              value={question}
              className={styles.inputField}
            />
          )}
        </form>
        <img onClick={askHandler} className={styles.send} src={SendIcon} />
      </div>
    </div>
  );
};

export default ChatInputField;
