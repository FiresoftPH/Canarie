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
import axios from "axios";
import { nanoid } from "@reduxjs/toolkit";

let shouldUpdate = false;
const ChatUI = () => {
  // let chatName = props.mode;

  // Fetch data only once
  let data = useSelector((state) => state.bigData);

  // let chatName = useParams().assignmentId;
  // const courseName = useParams().subjectId;
  const { subjectId, assignmentId } = useParams();
  let chatName = assignmentId;
  const courseName = subjectId;

  const nav = useNavigate();
  const location = useLocation();
  const usrData = JSON.parse(localStorage.getItem("data"));

  const [typing, setTyping] = useState(false)

  // console.log(data.filter((sub) => sub.course === courseName)[0].assignments.filter((ass) => ass.assignmentId === chatName)[0])

  const [history, setHistory] = useState(
    data.filter((sub) => sub.course === courseName)[0].assignments
  );

  useEffect(() => {
    setHistory(data.filter((sub) => sub.course === courseName)[0].assignments);
  }, [data.filter((sub) => sub.course === courseName)[0].assignments]);

  // Fetch recent history data
  useEffect(() => {
    console.log("FETCHING HISTORY");
    // console.log(usrData)

    const cleanUp = async () => {
      // console.log({
      //   username: usrData.username,
      //   email: usrData.email,
      //   course: subjectId,
      //   chatroom_name: assignmentId,
      //   api_key: usrData.api_key,
      // })
      // const url = 'https://corsproxy.io/?' + encodeURIComponent('https://api.canarie.cmkl.ai/ai/getFullHistory');

      const fetchedHistory = await axios
        .post('https://api.canarie.cmkl.ai/ai/getFullHistory', {
          username: usrData.username,
          email: usrData.email,
          course: subjectId,
          chatroom_name: assignmentId,
          api_key: usrData.api_key,
        })
        .then((res) => res.data.content)
        // .catch((err) => console.log(err));

      // console.log(history);

      // console.log(fetchedHistory);
      // setHistory(fetchedHistory.map(chat => {
      //   return {
      //     chatId: nanoid(),
      //     message: chat[1],
      //     sender: chat[0] === "<|im_start|>user" ? "user" : "ai",
      //     rating: "none",
      //     file_attachments: []
      //   }
      // }))
      // if (fetchedHistory !== undefined) {

      if (fetchedHistory != undefined) {
        setHistory((prev) =>
          prev.map((ass) => {
            if (ass.name === assignmentId) {
              return {
                ...ass,
                chatHistory: fetchedHistory.map((chat) => {
                  return {
                    chatId: nanoid(),
                    message: chat[1],
                    sender: chat[0] === "<|im_start|>user" ? "user" : "ai",
                    rating: "none",
                    file_attachments: [],
                  };
                }),
              };
            } else {
              return ass;
            }
          })
        );
      }
    };

    cleanUp();
  }, [subjectId, assignmentId, data.filter((sub) => sub.course === courseName)[0].assignments]);

  // useEffect(() => {
  //   setHistory(data.filter((sub) => sub.course === courseName)[0].assignments);
  // });

  console.log("REFRESHED")

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
        if (assignment.name === chatName) {
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

  const askAIHandler = async (question) => {
    if (topName !== "-") {
      // For any assignment chat

      console.log(question);
      // console.log(fileAttached[0].code)
      addChatToAssignment(question, "user", fileAttached);
      // addChatToAssignment("No. You do it yourself.", "ai");
      // const usrData = JSON.parse(localStorage.getItem("data"))[0];

      let codee = ""

      if (fileAttached !== null) codee = fileAttached[0].code

      console.log(            {
        username: usrData.username,
        email: usrData.email,
        code: codee,
        course: subjectId,
        chatroom_name: assignmentId,
        api_key: usrData.api_key,
        question: question,
      });

      setLock(true);
      setTyping(true)
      try {
        const res = await axios
          .post(("https://api.canarie.cmkl.ai/ai/getResponse"),
            {
              username: usrData.username,
              email: usrData.email,
              code: codee,
              course: subjectId,
              chatroom_name: assignmentId,
              api_key: usrData.api_key,
              question: question,
            }
          )
          .then((res) => res.data);
        console.log(res);
        addChatToAssignment(res.message, "ai", []);
        setLock(false);
        setTyping(false)
      } catch {
        setLock(false);
        setTyping(false)
      }

      // console.log(res)
    } else {
      // For general chat
      addChatToAssignment(question, "user");

      setHistory((prevState) =>
        prevState.map((assignment) => {
          if (assignment.name === chatName) {
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
        if (assignment.name === chatName) {
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
      setLock(false)
      if (shouldUpdate === false) {
        const scrollBar = document.getElementById("chatScroll");
        scrollBar.scrollTop = scrollBar.scrollHeight;
      } else {
        shouldUpdate = false;
      }
      setTopName(assignmentId);
    } else {
      setLock(true)
    }
  }, [assignmentId]);

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

  // For general to actual chat transition

  // useEffect(() => {
  //   if (location.state !== null) {
  //     console.log("Adding chat");
  //     // console.log(location);
  //     setHistory((prevState) =>
  //       prevState.map((assignment) => {
  //         if (assignment.name === chatName) {
  //           return {
  //             ...assignment,
  //             chatHistory: [...assignment["chatHistory"], location.state],
  //           };
  //         } else {
  //           return assignment;
  //         }
  //       })
  //     );

  //     setHistory((prevState) =>
  //       prevState.map((assignment) => {
  //         if (assignment.name === chatName) {
  //           return {
  //             ...assignment,
  //             chatHistory: [
  //               ...assignment["chatHistory"],
  //               {
  //                 chatId: Math.random(),
  //                 message: "No. Do it yourself.",
  //                 sender: "ai",
  //                 rating: "none",
  //                 assignment: history.map((ass) => {
  //                   if (ass.name !== "General")
  //                     return { name: ass.name, id: ass.assignmentId };
  //                 }),
  //               },
  //             ],
  //           };
  //         } else {
  //           return assignment;
  //         }
  //       })
  //     );
  //   }
  // }, [chatName]);

  const fileAddHandler = (files) => {
    setFileAttached(files);
  };

  // console.log("ChatUI refreshed");
  // console.log(history);
  // console.log(history.filter((ass) => ass.name === chatName)[0]);

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
            <p>{assignmentId === "General" ? "-" : assignmentId}</p>
            <img src={RenameIcon} />
            {/* <div /> */}
            <img src={ClearChatHistoryIcon} />
            <div className={styles.sepLine} />
            <div className={styles.topBlur}></div>
          </div>
          <div className={styles.chatting}></div>
          {chatName !== "General" ? (
            <ChatScreenInitalized
              onRate={ratingHandler}
              history={history.filter((ass) => ass.name === chatName)[0]}
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
            lock={lock}
            typing={typing}
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
