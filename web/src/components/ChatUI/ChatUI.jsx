import styles from "./ChatUI.module.css";

import ChatIconNoBG from "src/assets/ChatIconNoBG.svg";
import RenameIcon from "src/assets/RenameIcon.svg";
import ClearChatHistoryIcon from "src/assets/ClearChatHistoryIcon.svg";
import ChatInputField from "../ChatInputField/ChatInputField";
import ChatScreenInitalized from "../ChatScreen/ChatScreenInitialized";
import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import userSlice from "../../store/userSlice";

// const DUMMY_TEXT_DATA = [
//   {
//     assignmentId: "w1",
//     chatHistory: [
// { chatId: 0, message: "Hello.", sender: "user" },
// {
//   chatId: 1,
//   message: "Hi, any help u need with assignment 1?",
//   sender: "ai",
//   rating: "none",
// },
//     ],
//   },
// ];

import ChatScreenNotInit from "../ChatScreen/ChatScreenNotInit";
import FileAttachmentModal from "../FileAttachmentModal/FileAttachmentModal";
import { useSelector } from "react-redux";
import { useRef } from "react";

let shouldUpdate = false;
const ChatUI = () => {
  // let chatName = props.mode;

  // Fetch data only once
  const data = useSelector(
    (state) => state.bigData,
    () => true
  );

  // let chatName = useParams().assignmentId;
  // const courseName = useParams().subjectId;
  const { subjectId, assignmentId } = useParams();
  let chatName = assignmentId;
  const courseName = subjectId;

  const nav = useNavigate();

  const location = useLocation();

  const [history, setHistory] = useState(
    // data
    //   .filter((sub) => {
    //     return sub.course == courseName;
    //   })[0]
    //   .assignments.map((ass) => {
    //     const asArray = Object.entries(ass);

    //     const filtered = asArray.filter(([key, value]) => key !== "files");

    //     return Object.fromEntries(filtered);
    //   })
    data.filter((sub) => sub.course === courseName)[0]
  );

  // console.log(history);

  const [topName, setTopName] = useState("-");
  // const topNameRef = useRef()

  const [lock, setLock] = useState(false);
  const [openFiles, setOpenFiles] = useState(false);

  const [fileAttached, setFileAttached] = useState(null);

  const addChatToAssignment = (chatMessage, sender, fileAttach) => {
    // console.log(fileAttached)

    let attachment;
    if (fileAttach === null || fileAttach === undefined) {
      attachment = [];
    } else {
      attachment = fileAttach;
    }

    setHistory((prevState) =>
      prevState.map((assignment) => {
        if (assignment.assignmentId === chatName) {
          return {
            ...assignment,
            chatHistory: [
              ...assignment["chatHistory"],
              {
                chatId: Math.random(),
                message: chatMessage,
                sender: sender,
                rating: "none",
                file_attachments: attachment,
              },
            ],
          };
        } else {
          return assignment;
        }
      })
    );

    setFileAttached(null);
  };

  const askAIHandler = (question) => {
    if (topName !== "-") {
      // For any assignment chat

      console.log(question);
      addChatToAssignment(question, "user", fileAttached);
      addChatToAssignment("No. You do it yourself.", "ai");
    } else {
      // For general chat
      addChatToAssignment(question, "user");

      setHistory((prevState) =>
        prevState.map((assignment) => {
          if (assignment.assignmentId === chatName) {
            return {
              ...assignment,
              chatHistory: [
                ...assignment["chatHistory"],
                {
                  chatId: Math.random(),
                  message: "Which assignment is your question referencing",
                  sender: "ai",
                  rating: "none",
                  assignment: history.map((ass) => {
                    if (ass.name !== "General")
                      return { name: ass.name, id: ass.assignmentId };
                  }),
                },
              ],
            };
          } else {
            return assignment;
          }
        })
      );

      setLock(true);
    }
  };

  const ratingHandler = (rating, id) => {
    shouldUpdate = true;

    setHistory((prevState) =>
      prevState.map((assignment) => {
        if (assignment.assignmentId === chatName) {
          const ratedChat = assignment.chatHistory.map((chat) => {
            if (chat.sender === "ai" && chat.chatId === id) {
              return {
                ...chat,
                rating: rating,
              };
            } else {
              return chat;
            }
          });

          return {
            ...assignment,
            chatHistory: ratedChat,
          };
        } else {
          return assignment;
        }
      })
    );
  };

  // Check if the selected subject is null or not, if it is not, set the subject name to the selected subject
  useEffect(() => {
    if (chatName !== "General") {
      // ScrollBar related code
      if (shouldUpdate === false) {
        const scrollBar = document.getElementById("chatScroll");
        scrollBar.scrollTop = scrollBar.scrollHeight;
      } else {
        shouldUpdate = false;
      }
      setTopName(history.filter((ass) => ass.assignmentId === chatName)[0].name)
    }
  }, [assignmentId])

  // useEffect(() => {
  //   console.log("Initialized chat screen re rendered");

  //   if (chatName !== "General") {
      // if (shouldUpdate === false) {
      //   const scrollBar = document.getElementById("chatScroll");
      //   scrollBar.scrollTop = scrollBar.scrollHeight;
      // } else {
      //   shouldUpdate = false;
      // }
  //     setTopName(
  //       history.filter((ass) => ass.assignmentId === chatName)[0].name
  //     );
  //   }
  // }, [history.filter((ass) => ass.assignmentId === chatName)[0]]);
  // }, [<ChatScreenInitalized onRate={ratingHandler} history={history.filter((ass) => ass.assignmentId === chatName)[0]} />]);

  const fileAttachHandler = () => {
    setOpenFiles(!openFiles);
    // console.log(history)
  };

  useEffect(() => {
    if (location.state !== null) {
      console.log("Adding chat");
      // console.log(location);
      setHistory((prevState) =>
        prevState.map((assignment) => {
          if (assignment.assignmentId === chatName) {
            return {
              ...assignment,
              chatHistory: [...assignment["chatHistory"], location.state],
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
                  message: "No. Do it yourself.",
                  sender: "ai",
                  rating: "none",
                  assignment: history.map((ass) => {
                    if (ass.name !== "General")
                      return { name: ass.name, id: ass.assignmentId };
                  }),
                },
              ],
            };
          } else {
            return assignment;
          }
        })
      );
    }
  }, [chatName]);

  const fileAddHandler = (files) => {
    setFileAttached(files);
  };

  console.log("ChatUI refreshed");

  return (
    <>
      {/* {openFiles ? (
        <FileAttachmentModal
          files={
            data
              .filter((sub) => sub.course === courseName)[0]
              .assignments.filter((ass) => ass.assignmentId === chatName)[0]
              .files
          }
          toggle={() => {
            setOpenFiles(!openFiles);
          }}
          onSubmit={fileAddHandler}
        />
      ) : (
        ""
      )} */}
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.header}>
            <img src={ChatIconNoBG} />
            <p>{topName}</p>
            {/* <img src={RenameIcon} /> */}
            <div />
            <img src={ClearChatHistoryIcon} />
            <div className={styles.sepLine} />
            <div className={styles.topBlur}></div>
          </div>
          <div className={styles.chatting}></div>
          {chatName !== "General" ? (
            <ChatScreenInitalized
              onRate={ratingHandler}
              history={
                history.filter((ass) => ass.assignmentId === chatName)[0]
              }
            />
          ) : (
            <ChatScreenNotInit
              // onRate={ratingHandler}
              // history={
              //   history.filter((ass) => ass.assignmentId === chatName)[0]
              // }
              // onChose={() => {
              //   setLock(false);
              // }}
            />
          )}
          <ChatInputField
            onFileAttach={fileAttachHandler}
            onUploadFile={fileAddHandler}
            onSend={askAIHandler}
            // lock={lock}
          />
        </div>
        <div className={styles.backdrops}>
          <div className={styles.backdrop}>
            <div className={styles.yellowCircle} />
            <div className={styles.redCircle} />
          </div>
          <div className={styles.backdrop1} />
        </div>
      </div>
    </>
  );
};

export default ChatUI;
