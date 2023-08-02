import { useRef } from "react";
import styles from "./CreateChatModal.module.css";
import Icon from "../../assets/ParrotIcon.svg";
import UserIcon from "../../assets/UserImage.svg"

const CreateChatModal = (props) => {
  const inputRef = useRef();
  return (
    <div className={styles.wrapper}>
      <div className={styles.new_chat_title}>
        <p>New Chat</p>
        <button
              onClick={() => {
                props.toggle();
              }}
            >
              &#128473; 
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={Icon} alt="AI" />
          {/* <img src={ChatboxUwU} alt="chatbox" /> */}
          <p className={styles.chat_ai}>
            What name would you like to set?
          </p>
        </div>
        <div className={styles.middle}>
          <form
            className={styles.user_chat}
            onSubmit={(e) => {
              e.preventDefault();
              if (inputRef.current.value !== "") {
                props.onSubmit(inputRef.current.value);
              }
              else {
                console.log('errrrrrrrrrrr')
              }
            }}
          >
            <input ref={inputRef} placeholder="Enter chat name here" autoFocus />
          </form>
          <img src={UserIcon} alt="User" />
        </div>
        <div className={styles.footer}>
          <button
            onClick={() => {
              if (inputRef.current.value !== "") {
                props.onSubmit(inputRef.current.value);
              }
              else {
                console.log('errrrrrrrrrrr')
              }
            }}
          >
            Create
          </button>
        </div>
      </div>
      <div
        onClick={() => {
          props.toggle();
        }}
        className={styles.backdrop}
      />
    </div>
  );
};

export default CreateChatModal;
