import styles from "./ChatUI.module.css";

import ChatIconNoBG from "src/assets/ChatIconNoBG.svg";
import RenameIcon from "src/assets/RenameIcon.svg";
import ClearChatHistoryIcon from "src/assets/ClearChatHistoryIcon.svg";
import ChatInputField from "../ChatInputField/ChatInputField";
import ChatScreenInitalized from "../ChatScreen/ChatScreenInitialized";
import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import userSlice, { userActions } from "../../store/userSlice";

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
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import axios from "axios";
import { nanoid } from "@reduxjs/toolkit";
import { bigDataAction } from "../../store/bigDataSlice";

let shouldUpdate = false;
let shouldFetchData = true
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

  const [typing, setTyping] = useState(false);

  const inputRef = useRef();

  const dispatch = useDispatch();

  // console.log(data.filter((sub) => sub.course === courseName)[0].assignments.filter((ass) => ass.assignmentId === chatName)[0])

  const [history, setHistory] = useState(
    data.filter((sub) => sub.course === courseName)[0].assignments
  );

  useEffect(() => {
    console.log(data.filter((sub) => sub.course === courseName)[0].assignments)

    setHistory(data.filter((sub) => sub.course === courseName)[0].assignments);
  }, [data.filter((sub) => sub.course === courseName)[0].assignments]);

  // Fetch recent history data
  useEffect(() => {
    if (shouldFetchData == true) {
      console.log("FETCHING HISTORY");
      console.log({
        username: usrData.username,
        email: usrData.email,
        course: subjectId,
        chatroom_name: assignmentId,
        api_key: usrData.api_key,
      },)
      // console.log(usrData)
  
      const cleanUp = async () => {
        const fetchedHistory = await axios
          .post(
            "https://api.canarie.cmkl.ai/ai/getFullHistory",
            {
              username: usrData.username,
              email: usrData.email,
              course: subjectId,
              chatroom_name: assignmentId,
              api_key: usrData.api_key,
            },
            { headers: { "Access-Control-Allow-Origin": "*" } }
          )
          .then((res) => res.data.content);
  
        if (fetchedHistory != undefined) {
          console.log(fetchedHistory);

          setHistory((prev) =>
            prev.map((ass) => {
              if (ass.name === assignmentId) {
                return {
                  ...ass,
                  chatHistory: fetchedHistory.map((chat) => {
                    return {
                      chatId: nanoid(),
                      message: chat[1],
                      sender: chat[0] === "USER" ? "user" : "ai",
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
    } else {
      shouldFetchData = true
    }
  }, [
    subjectId,
    assignmentId,
    data.filter((sub) => sub.course === courseName)[0].assignments,
  ]);

  // useEffect(() => {
  //   setHistory(data.filter((sub) => sub.course === courseName)[0].assignments);
  // });

  // console.log("REFRESHED");

  // console.log(history);

  const [topName, setTopName] = useState("-");
  // const topNameRef = useRef()

  const [lock, setLock] = useState(false);
  const [openFiles, setOpenFiles] = useState(false);

  const [fileAttached, setFileAttached] = useState([]);

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

    setFileAttached([]);
  };

  const askAIHandler = async (question) => {
    // if (topName !== "-") {
    // For any assignment chat

    console.log(question);
    console.log(fileAttached[0]);
    addChatToAssignment(question, "user", fileAttached);
    // addChatToAssignment("No. You do it yourself.", "ai");
    // const usrData = JSON.parse(localStorage.getItem("data"))[0];

    let codee = "";

    if (fileAttached.length !== 0)
      codee = fileAttached[0].map((f) => [f.name, f.code]);

    console.log({
      username: usrData.username,
      email: usrData.email,
      code: codee,
      course: subjectId,
      chatroom_name: assignmentId,
      api_key: usrData.api_key,
      question: question,
    });

    setLock(true);
    setTyping(true);
    try {
      const res = await axios
        .post("https://api.canarie.cmkl.ai/ai/getResponse", {
          username: usrData.username,
          email: usrData.email,
          code: codee,
          course: subjectId,
          chatroom_name: assignmentId,
          api_key: usrData.api_key,
          question: question,
        })
        .then((res) => res.data);
      console.log(res);
      addChatToAssignment(res.message, "ai", []);
      setLock(false);
      setTyping(false);
    } catch {
      setLock(false);
      setTyping(false);
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
    // if (chatName !== "General") {
    // ScrollBar related code
    setLock(false);
    if (shouldUpdate === false) {
      const scrollBar = document.getElementById("chatScroll");
      scrollBar.scrollTop = scrollBar.scrollHeight;
    } else {
      shouldUpdate = false;
    }
    setTopName(assignmentId);
    // } else {
    //   setLock(true);
    // }

    chatRef.current.textContent = assignmentId;

    // dispatch(bigDataAction.cleanChats({ subjectId, omit: assignmentId }));
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

  const fileAddHandler = (files) => {
    console.log(files);

    setFileAttached((prevState) => [...prevState, files]);
  };

  // console.log("ChatUI refreshed");
  // console.log(history);
  // console.log(history.filter((ass) => ass.name === chatName)[0]);

  const historyDeleteHandler = async () => {
    shouldFetchData = false
    axios.post("https://api.canarie.cmkl.ai/auth/chatroom/reset", {
      username: usrData.username,
      email: usrData.email,
      course: subjectId,
      chatroom_name: assignmentId,
      api_key: usrData.api_key,
    });

    dispatch(bigDataAction.clearChat({ subjectId, assignmentId }));
  };

  // const [editable, setEditable] = useState(false);
  const chatRef = useRef(null);

  const selectTarget = (el) => {
    el.focus();

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const renameHandler = async () => {
    // setEditable(true);
    if (assignmentId === "General") {
      return;
    }

    chatRef.current.contentEditable = true;

    if (chatRef.current) {
      selectTarget(chatRef.current);
    }
  };

  const stopRenameHandler = async (e) => {
    // console.log(e.target.textContent)

    // console.log('thing blured bro')
    if (e.target.textContent == "") {
      console.log("no.");
      e.preventDefault();

      selectTarget(e.target);
      return;
    }

    chatRef.current.contentEditable = false;

    const newName = chatRef.current.textContent;

    console.log({
      username: usrData.username,
      email: usrData.email,
      course: subjectId,
      chatroom_name: assignmentId,
      api_key: usrData.api_key,
      newchatroom_name: newName,
    });

    await axios
      .post(
        "https://api.canarie.cmkl.ai/auth/chatroom/rename",
        {
          username: usrData.username,
          email: usrData.email,
          course: subjectId,
          chatroom_name: assignmentId,
          api_key: usrData.api_key,
          newchatroom_name: newName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => console.log(res.data));
    // .then(() => {
    //   dispatch(
    //     bigDataAction.setChatName({ subjectId, assignmentId, newId: newName })
    //   );
    // })
    // .then(() => {
    //   nav(`/Chat/${subjectId}/${newName}`);
    // });

    dispatch(
      bigDataAction.setChatName({ subjectId, assignmentId, newName: newName })
    );
    nav(`/Chat/${subjectId}/${newName}`);
  };

  const changeRenameHandler = (e) => {
    // console.log(e);

    if (
      e.key === "Enter" &&
      e.target.textContent != "" &&
      e.shiftKey == false
    ) {
      e.target.blur();
    }
  };

  const handlePaste = (event) => {
    // Prevent default paste behavior to handle pasted content manually
    event.preventDefault();

    // Get pasted text from clipboard
    const pastedText = event.clipboardData.getData("text/plain");

    // Insert the pasted text into the contentEditable div as raw string
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(pastedText));
  };

  // useEffect(() => {
  //   dispatch(bigDataAction.addChat({ subjectId, name: assignmentId }));
  // }, []);

  // Note: This function is for a useless purpose (the copying code prevention) by informing the usr of their name. You can delete this if the appication needs performance optimisation
  // useEffect(() => {
  //   dispatch(userActions.setUsername(usrData.username))
  // }, [])

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
            <p
              onBlur={stopRenameHandler}
              ref={chatRef}
              onPaste={handlePaste}
              onKeyDown={changeRenameHandler}
              // role="textbox"
              // contentEditable={editable}
            ></p>
            <img
              onClick={renameHandler}
              src={RenameIcon}
              style={{
                cursor: assignmentId === "General" ? "not-allowed" : "pointer",
              }}
            />
            {/* <div /> */}
            <img onClick={historyDeleteHandler} src={ClearChatHistoryIcon} />
            <div className={styles.sepLine} />
            <div className={styles.topBlur}></div>
          </div>
          <div className={styles.chatting}></div>
          {/* {chatName !== "General" ? ( */}
          <ChatScreenInitalized
            onRate={ratingHandler}
            history={history.filter((ass) => ass.name === chatName)[0]}
          />
          {/* ) : (
            <ChatScreenNotInit
            // onRate={ratingHandler}
            // history={
            //   history.filter((ass) => ass.assignmentId === chatName)[0]
            // }
            // onChose={() => {
            //   setLock(false);
            // }}
            />
          )} */}
          <ChatInputField
            onFileAttach={fileAttachHandler}
            onUploadFile={fileAddHandler}
            onSend={askAIHandler}
            lock={lock}
            inputRef={inputRef}
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
