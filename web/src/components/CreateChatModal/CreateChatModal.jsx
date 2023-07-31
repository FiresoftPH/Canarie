import { useRef, useState } from "react";
import styles from "./CreateChatModal.module.css";

const CreateChatModal = (props) => {
  const inputRef = useRef();
  
  const [cla, setCla] = useState()

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>What's going to be the chat name?</div>
        <div className={styles.middle}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputRef.current.value !== "") {
                props.onSubmit(inputRef.current.value);
              }
            }}
          >
            <input ref={inputRef} placeholder="Enter chat name here" />
          </form>
        </div>
        <div className={styles.footer}>
          <button
            onClick={() => {
              props.toggle();
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (inputRef.current.value !== "") {
                props.onSubmit(inputRef.current.value);
              }
              // console.log(inputRef.current.value)
            }}
          >
            Create chat
          </button>
        </div>
      </div>
      <div
        onClick={() => {
          props.toggle();
        }}
        className={styles.backdrop}
      ></div>
    </div>
  );
};

export default CreateChatModal;
