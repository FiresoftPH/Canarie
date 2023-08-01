import { useRef, useState } from "react";
import styles from "./CreateChatModal.module.css";

const CreateChatModal = (props) => {
  const inputRef = useRef();
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}></div>
        <div className={styles.middle}>
          <form
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
            <input ref={inputRef} placeholder="Enter chat name here" />
          </form>
        </div>
        <div className={styles.footer}>
          <button
            onClick={() => {
              props.toggle();
            }}
          >
            &#128473; 
          </button>
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
            &#10003;
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
