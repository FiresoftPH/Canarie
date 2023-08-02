import { useMemo } from "react";
import { useCallback } from "react";
import { memo } from "react";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChattingCardAI from "../ChattingCard/ChattingCardAI";
import ChattingCardUser from "../ChattingCard/ChattingCardUser";
import styles from "./ChatScreenInitialized.module.css";

import lottie from 'lottie-web';
import anim from '../../assets/anim.json';

const ChatScreenInitialized = ({ history, onRate }) => {
  // console.log("I run brfore");
  const scrollRef = useRef(null)
  let temp = false;

  const ratingHandler = useCallback((rate, id) => {
    onRate(rate, id);
  }, []);

  const { subjectId, assignmentId } = useParams();

  // console.log(history);

  // console.log(history);

  const optimizedData = useMemo(() => {
    // console.log(history)
    if (history === undefined) {
      temp = true;
    } else {
      return history.chatHistory;
    }
  }, [history]);

  useEffect(() => {
    // console.log("history changed")

    if (scrollRef.current) {
      const contentElement = scrollRef.current;
      contentElement.scrollTop = contentElement.scrollHeight - contentElement.clientHeight;
    }
  }, [history])

  useEffect(() => {
    
  }, [])

  // useEffect(() => {
  //   const animation = lottie.loadAnimation({
  //     container: scrollRef.current,
  //     animationData: anim,
  //   })
  // }, [])

  if (temp == true) {
    // console.log("QUIT")
    return <div id="chatScroll" className={styles.wrapper} ref={scrollRef}></div>;
  }

  // console.log("Expensive component re rendered")

  return (
    <>
      <div id="chatScroll" className={styles.wrapper} ref={scrollRef}>
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
