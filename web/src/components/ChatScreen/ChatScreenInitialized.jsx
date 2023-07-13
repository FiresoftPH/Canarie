import { useEffect, useState } from "react";
import ChattingCardAI from "../ChattingCard/ChattingCardAI";
import ChattingCardUser from "../ChattingCard/ChattingCardUser";
import styles from "./ChatScreenInitialized.module.css";

const ChatScreenInitialized = (props) => {
  const [update, setUpdate] = useState(false);
  const [prevUpdate, setPrevUpdate] = useState(false);

  if (props.history == undefined) {
    return <div className={styles.wrapper}></div>;
  }

  console.log("I run brfore");

  const ratingHandler = (rate, id) => {
    props.onRate(rate, id);
  };

  return (
    <>
      <div className={styles.topBlur}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div id="chatScroll" className={styles.wrapper}>
        {/* <div className={styles.topBlur}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div> */}
        {props.history.chatHistory.map((message) => {
          if (message.sender === "ai") {
            return (
              <ChattingCardAI
                onRate={ratingHandler}
                rating={message.rating}
                message={message.message}
                id={message.chatId}
              />
            );
          }

          console.log(message);

          return (
            <ChattingCardUser
              message={message.message}
              file_attachment={message.file_attachments}
            />
          );
        })}
      </div>
      <div className={styles.bottomBlur} />
    </>
  );
};

export default ChatScreenInitialized;
