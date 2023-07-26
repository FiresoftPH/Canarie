import { useMemo } from "react";
import { useCallback } from "react";
import { memo } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChattingCardAI from "../ChattingCard/ChattingCardAI";
import ChattingCardUser from "../ChattingCard/ChattingCardUser";
import styles from "./ChatScreenInitialized.module.css";

const ChatScreenInitialized = ({ history, onRate }) => {
  // console.log("I run brfore");

  const ratingHandler = useCallback((rate, id) => {
    onRate(rate, id);
  }, []);

  const { subjectId, assignmentId } = useParams();

  // console.log(history);
  
  if (history === undefined) {
    // console.log("Abording")

    return <div id="chatScroll" className={styles.wrapper}></div>;
  }
  
  const optimizedData = useMemo(() => {
    // console.log(history)
    return history.chatHistory;
  }, [history]);
  

  // console.log("Expensive component re rendered")

  return (
    <>
      <div id="chatScroll" className={styles.wrapper}>
        {optimizedData.map((message) => {
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

          // console.log("Mapped");

          return (
            <ChattingCardUser
              message={message.message}
              file_attachment={message.file_attachments}
            />
          );
        })}
      </div>
    </>
  );
};

export default ChatScreenInitialized;
