import styles from "./ChatInputField.module.css";

import FileAttachmentIcon from "src/assets/FileAttachmentIcon.svg";
import SendIcon from "src/assets/SendIcon.svg";

const ChatInputField = (props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.attachment}>
        <img src={FileAttachmentIcon} />
      </div>
      <div className={styles.searchBar}>
        <input className={styles.inputField} />
        <img className={styles.send} src={SendIcon} />
      </div>
    </div>
  );
};

export default ChatInputField;
