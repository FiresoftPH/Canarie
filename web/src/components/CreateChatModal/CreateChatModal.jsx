import { useRef, useState, useEffect } from "react";
import styles from "./CreateChatModal.module.css";
import Icon from "../../assets/ParrotIcon.svg";
import UserIcon from "../../assets/UserImage.svg";

const CreateChatModal = (props) => {
  const inputRef = useRef();

  const [anim, setAnim] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (inputRef.current.value !== "") {
      const intances = props.chats.filter(
        (c) => c.name.toLowerCase() === inputRef.current.value.toLowerCase()
      );
      // const intances = props.chats.filter(c => c.name === inputRef.current.value)
      if (intances.length !== 0) {
        setAnim(true);
        return;
      }
      props.onSubmit(inputRef.current.value);
    } else {
      setAnim(true);
      // return(
      //   <p>test</p>
      // )
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (anim == true) {
        setAnim(false);
      }
    }, 820);
  });

  const cssClasses = [styles.middle, anim && styles.shake, props.show === "entering" && styles.jumpUp, props.show === "exiting" && styles.jumpDown];

  // console.log(props.show)

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.content} ${props.show === "entering" && styles.bounceUp} ${props.show === "exiting" && styles.bounceDown}`}>
        <div className={styles.new_chat_title}>
          <p>New Canarie Chat</p>
          <button
            onClick={() => {
              props.toggle();
            }}
          >
            &times;
          </button>
        </div>
        <div className={styles.container}>
          <div className={`${styles.header} ${props.show === "entering" && styles.slideUp} ${props.show === "exiting" && styles.slideDown}`}>
            <img src={Icon} alt="AI" />
            {/* <img src={ChatboxUwU} alt="chatbox" /> */}
            <p className={styles.chat_ai}>Name your new chat here!</p>
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
            <button onClick={submitHandler}>Create</button>
          </div>
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
