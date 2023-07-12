import { useEffect, useState } from "react";
import ChattingCardAI from "../ChattingCard/ChattingCardAI";
import ChattingCardUser from "../ChattingCard/ChattingCardUser";
import styles from "./ChatScreenNotInit.module.css";

const ChatScreenNotInit = (props) => {
   const [update, setUpdate] = useState(false)
  const [prevUpdate, setPrevUpdate] = useState(false)

  if (props.history == undefined) {
    return <div className={styles.wrapper}></div>;
  }

  const ratingHandler = (rate, id) => {
    props.onRate(rate, id)
  };

  return (
    <>
      <div id="chatScroll" className={styles.wrapper}>
        {props.history.chatHistory.map((message) => {
        //   console.log(message.assignment)

          if (message.sender === "ai") {
            return (
              <ChattingCardAI
                onRate={ratingHandler}
                rating={message.rating}
                message={message.message}
                id={message.chatId}
                assignments={message.assignment}
                chooseSubject={() => { props.onChose() }}
              />
            );
          }

          return <ChattingCardUser message={message.message} file_attachment />;
        })}
      </div>
    </>
  );
}

export default ChatScreenNotInit;