import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChattingCardAI from "../ChattingCard/ChattingCardAI";
import ChattingCardUser from "../ChattingCard/ChattingCardUser";
import styles from "./ChatScreenNotInit.module.css";

const ChatScreenNotInit = (props) => {
  // console.log("Nothing to see here ;)")

  return <div className={styles.wrapper}></div>;

  const [update, setUpdate] = useState(false)
  const [prevUpdate, setPrevUpdate] = useState(false)

  const nav = useNavigate()
  const { subjectId } = useParams()

  if (props.history == undefined) {
    return <div className={styles.wrapper}></div>;
  }

  const ratingHandler = (rate, id) => {
    props.onRate(rate, id)
  };

  const choseHandler = (id) => {
    props.onChose()
    nav(`/Chat/${subjectId}/${id}`, { state: props.history.chatHistory[0] });
  }

  return (
    <>
      <div id="chatScroll" className={styles.wrapper}>
        {props.history.chatHistory.map((message) => {
        //   console.log(message.assignment)

          if (message.sender === "ai") {
            console.log(message)

            return (
              <ChattingCardAI
                onRate={ratingHandler}
                rating={message.rating}
                message={message.message}
                id={message.chatId}
                assignments={message.assignment}
                chooseSubject={choseHandler}
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