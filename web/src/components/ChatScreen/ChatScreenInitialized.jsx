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
  let temp = false;

  const ratingHandler = useCallback((rate, id) => {
    onRate(rate, id);
  }, []);

  const { subjectId, assignmentId } = useParams();

  // console.log(history);

  console.log(history);

  const optimizedData = useMemo(() => {
    // console.log(history)
    if (history === undefined) {
      temp = true;
    } else {
      return history.chatHistory;
    }
  }, [history]);

  if (temp == true) {
    console.log("QUIT")
    return <div id="chatScroll" className={styles.wrapper}></div>;
  }

  // console.log("Expensive component re rendered")

  return (
    <>
      <div id="chatScroll" className={styles.wrapper}>
        {optimizedData !== undefined ? optimizedData.map((message) => {
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
        }) : ""}
      </div>
    </>
  );
};

export default ChatScreenInitialized;
