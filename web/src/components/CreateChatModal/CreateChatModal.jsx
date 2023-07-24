import { useRef } from "react";
import styles from "./CreateChatModal.module.css";

const CreateChatModal = (props) => {
  const inputRef = useRef()

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>What's going to be the chat name?</div>
        <div className={styles.middle}>
          <input ref={inputRef} placeholder="Enter chat name here" />
        </div>
        <div className={styles.footer}>
          <button
            onClick={() => {
              props.toggle();
            }}
          >
            Cancel
          </button>
          <button onClick={() => {
            props.onSubmit(inputRef.current.value)
            // console.log(inputRef.current.value)
          }}>Create chat</button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;
