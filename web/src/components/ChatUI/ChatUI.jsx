import styles from "./ChatUI.module.css";

import ChatIconNoBG from "src/assets/ChatIconNoBG.svg";
import RenameIcon from "src/assets/RenameIcon.svg";
import ClearChatHistoryIcon from "src/assets/ClearChatHistoryIcon.svg";
import ChatInputField from "../ChatInputField/ChatInputField";
import ChatScreen from "../ChatScreen/ChatScreen";
import { useState } from "react";
import { useParams } from "react-router-dom";
import userSlice from "../../store/userSlice";

function Dimension(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginLeft"]) + parseFloat(styles["marginRight"]);

  return Math.ceil(el.offsetWidth + margin);
}

function Dimension2(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return Math.ceil(el.offsetHeight + margin);
}

const DUMMY_TEXT_DATA = [
  {
    assignmentId: "w1",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need with assignment 1?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    assignmentId: "w2",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need with assignment 2?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    assignmentId: "w3",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need with assignment 3?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    assignmentId: "w4",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need wiht lab 1?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    assignmentId: "w5",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need with lab 2?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    assignmentId: "w6",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need with lab 3?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
];

const ChatUI = (props) => {
  // let chatName = props.mode;
  let chatName = useParams().assignmentId;

  if (chatName === "General") {
    chatName = "-";
  } else {
    chatName = chatName.replace(" ", "_");
  }

  // const [width, setWidth] = useState(0);
  // const [height, setHeight] = useState(0);

  // const [assignment, setAssignment] = useState("-");

  const [history, setHistory] = useState(DUMMY_TEXT_DATA);

  const askAIHandler = (question) => {
    console.log(question);

    setHistory((prevState) =>
      prevState.map((assignment) => {
        if (assignment.assignmentId === chatName) {
          return {
            ...assignment,
            chatHistory: [
              ...assignment["chatHistory"],
              {
                chatId: Math.random(),
                message: question,
                sender: "user",
              },
            ],
          };
        } else {
          return assignment;
        }
      })
    );

    setHistory((prevState) =>
      prevState.map((assignment) => {
        if (assignment.assignmentId === chatName) {
          return {
            ...assignment,
            chatHistory: [
              ...assignment["chatHistory"],
              {
                chatId: Math.random(),
                message: "No. You can do it yourself.",
                sender: "ai",
                rating: "none",
              },
            ],
          };
        } else {
          return assignment;
        }
      })
    );

    const scrollBar = document.getElementById("chatScroll")

    scrollBar.scrollTo()
  };

  const ratingHandler = (rating, id) => {
    // setHistory((prevState) => ({
    //   ...prevState,
    //   [chatName]: [...prevState[chatName], ...prevState[chatName][id] = 1],
    // }));
    // const updatedChat = history.map((assginment) => {
    //   return assginment.map((chat) => {
    //     if (chat.id === id) {
    //       return {
    //         ...chat,
    //         rating: rating,
    //       };
    //     } else {
    //       return chat;
    //     }
    //   });
    // });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.backdrops}>
        <div
          style={{
            width: props.width,
            height: props.height,
          }}
          className={styles.backdrop}
        >
          <div className={styles.yellowCircle} />
          <div className={styles.redCircle} />
        </div>
        <div
          style={{
            width: props.width,
            height: props.height,
          }}
          className={styles.backdrop1}
        />
      </div>
      <div className={styles.header}>
        <img src={ChatIconNoBG} />
        <p>{chatName}</p>
        <img src={RenameIcon} />
        <img src={ClearChatHistoryIcon} />
        <div className={styles.sepLine} />
      </div>
      <div className={styles.chatting}></div>
      <ChatScreen
        onRate={ratingHandler}
        history={history.filter((ass) => ass.assignmentId === chatName)[0]}
      />
      <ChatInputField onSend={askAIHandler} />
    </div>
  );
};

export default ChatUI;
