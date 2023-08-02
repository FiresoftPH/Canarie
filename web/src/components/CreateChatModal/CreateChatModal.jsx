import { useRef } from "react";
import styles from "./CreateChatModal.module.css";
import Icon from "../../assets/ParrotIcon.svg";
import UserIcon from "../../assets/UserImage.svg";
import { useState } from "react";
import { useEffect } from "react";

const CreateChatModal = (props) => {
  const inputRef = useRef();

  const [anim, setAnim] = useState(false)

  const submitHandler = (e) => {
    e.preventDefault();
    if (inputRef.current.value !== "") {
      const intances = props.chats.filter(c => c.name.toLowerCase() === inputRef.current.value.toLowerCase())
      // const intances = props.chats.filter(c => c.name === inputRef.current.value)

      if (intances.length !== 0) {
        setAnim(true)
        return;
      }

      props.onSubmit(inputRef.current.value);
    } else {
      console.log("errrrrrrrrrrr");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (anim == true) {
        setAnim(false)
      }
    }, 820)
  })

  const cssClasses = [
    styles.middle,
    anim && styles.shake
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.new_chat_title}>
        <p>New Chat</p>
        <button
          onClick={() => {
            props.toggle();
          }}
        >
          &times;
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={Icon} alt="AI" />
          {/* <img src={ChatboxUwU} alt="chatbox" /> */}
          <p className={styles.chat_ai}>What name would you like to set?</p>
        </div>
        <div className={cssClasses.join(" ")}>
          <form className={styles.user_chat} onSubmit={submitHandler}>
            <input
              ref={inputRef}
              placeholder="Enter chat name here"
              autoFocus
            />
          </form>
          <img src={UserIcon} alt="User" />
        </div>
        <div className={styles.footer}>
          <button
            onClick={submitHandler}
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
