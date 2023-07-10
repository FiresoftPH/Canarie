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

// const DUMMY_TEXT_DATA = {
//   w1: [
//     {
//       id: 0,
//       sender: "user",
//       message: "hey",
//     },
//     {
//       id: 1,
//       sender: "ai",
//       message: "hi, any questions?",
//       rating: "none",
//     },
//   ],
//   w2: [],
//   w3: [],
//   w4: [],
//   w5: [],
//   w6: [],
//   General: [
//     // {
//     //   id: 0,
//     //   sender: "user",
//     //   message:
//     //     "i need help with this and stuff and stuff and stuff and stuff and stuff and stuff and stuff and stuff",
//     // },
//     // {
//     //   id: 1,
//     //   sender: "ai",
//     //   message:
//     //     "ok sure. which one you need help. i am here to help na Lorem ipsum fda dfsdsafdsa dfdsfdsa asdfdsafdsa",
//     // },
//   ],
// };

const DUMMY_TEXT_DATA = [
  {
    subjectId: "",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    subjectId: "",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    subjectId: "",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    subjectId: "",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    subjectId: "",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    subjectId: "",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
  {
    subjectId: "",
    chatHistory: [
      { chatId: 0, message: "Hello.", sender: "user" },
      {
        chatId: 1,
        message: "Hi, any help u need?",
        sender: "ai",
        rating: "none",
      },
    ],
  },
];

const DUMMY_DATA = [
  { id: "w1", name: "Assignment 1" },
  { id: "w2", name: "Assignment 2" },
  { id: "w3", name: "Assignment 3" },
  { id: "w4", name: "Lab 1" },
  { id: "w5", name: "Lab 2" },
  { id: "w6", name: "Lab 3" },
];

const ChatUI = (props) => {
  // let chatName = props.mode;
  let chatName = useParams().assignmentId;

  if (props.mode === "General") {
    chatName = "-";
  } else {
    chatName = chatName.replace(" ", "_");
  }

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [assignment, setAssignment] = useState("-");

  const [history, setHistory] = useState(DUMMY_TEXT_DATA);

  const askAIHandler = (question) => {
    console.log(question);

    // console.log(history[chatName][history[chatName].length - 1].id)

    let index = Math.random();

    setHistory((prevState) => ({
      ...prevState,
      [chatName]: [
        ...prevState[chatName],
        {
          id: index + 1,
          sender: "user",
          message: question,
        },
      ],
    }));

    setHistory((prevState) => ({
      ...prevState,
      [chatName]: [
        ...prevState[chatName],
        {
          id: index + 2,
          sender: "ai",
          message: "no. do it urself",
          rating: "none",
        },
      ],
    }));

    console.log(history);
  };

  const ratingHandler = (rating, id) => {
    // setHistory((prevState) => ({
    //   ...prevState,
    //   [chatName]: [...prevState[chatName], ...prevState[chatName][id] = 1],
    // }));
    const updatedChat = history.map((assginment) => {
      return assginment.map((chat) => {
        if (chat.id === id) {
          return {
            ...chat,
            rating: rating,
          };
        } else {
          return chat;
        }
      });
    });
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
      <ChatScreen onRate={ratingHandler} history={history[chatName]} />
      <ChatInputField onSend={askAIHandler} />
    </div>
  );
};

export default ChatUI;
