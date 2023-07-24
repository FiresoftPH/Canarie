import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ChatCard from "../ChatCard/ChatCard";
import New_Button from "../../assets/New button.svg";

import styles from "./ChatList.module.css";
import CreateChatModal from "../CreateChatModal/CreateChatModal";
import { bigDataAction } from "../../store/bigDataSlice";

// const INITAL_STATE = [
//   { id: 1, assignment: "Chem", sessionName: "organic chem" },
//   { id: 2, assignment: "Physics", sessionName: "fluid mechanics" },
//   { id: 3, assignment: "Math", sessionName: "calculus" },
// ];

// const DUMMY_DATA = [
//   { id: 1, assignment: "Chem", sessionName: "organic chem" },
//   { id: 2, assignment: "Physics", sessionName: "fluid mechanics" },
//   { id: 3, assignment: "Math", sessionName: "calculus" },
//   { id: 4, assignment: "Math", sessionName: "calculus" },
//   { id: 5, assignment: "Math", sessionName: "calculus" },
//   { id: 6, assignment: "Math", sessionName: "calculus" },
//   { id: 7, assignment: "Math", sessionName: "calculus" },
// ];

let shouldUpdate = true;
const ChatList = (props) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.bigData);

  const { subjectId, assignmentId } = useParams();
  const nav = useNavigate();

  const transformedData = data.filter((sub) => sub.course === subjectId)[0]
    .assignments;

  const [chats, setChats] = useState(transformedData);
  const [selectedChat, setSelectedChat] = useState();

  const [toggle, setToggle] = useState(false);

  // console.log(data.filter((sub) => sub.course === subjectId)[0].assignments);
  useEffect(() => {
    setChats(data.filter((sub) => sub.course === subjectId)[0].assignments);
  }, [data.filter((sub) => sub.course === subjectId)[0].assignments]);

  // Check if chat is empty, if not, do it
  useEffect(() => {
    if (transformedData.length !== 0 && selectedChat === null) {
      setSelectedChat(transformedData[0].id);
    }
  });

  console.log(selectedChat);

  const chatDeleteHandler = (id) => {
    shouldUpdate = false;

    setChats(
      chats.filter((chat) => {
        return chat.id !== id;
      })
    );

    dispatch(bigDataAction.deleteChat({ id, subjectId, assignmentId }));
  };

  // console.log("I updated")

  const selectHandler = (id) => {
    if (shouldUpdate === true) {
      // console.log("I have been selected")
      nav(
        `/Chat/${subjectId}/${id}`,
        data
          .filter((sub) => sub.course === subjectId)[0]
          .assignments.filter((chat) => chat.assignmentId === id)[0]
      );
      setSelectedChat(id);
    } else {
      shouldUpdate = true;
    }
  };

  const modalToggle = () => {
    setToggle(!toggle);
  };

  const addChatHandler = (name) => {
    dispatch(bigDataAction.addChat({ name, subjectId }));
    setToggle(!toggle);
  };

  return (
    <>
      <section
        className={styles.chatList}
      >
        {chats.length !== 0
          ? chats.map((chat) => (
              <ChatCard
                // assignment={chat.assignment}
                sessionName={chat.name}
                id={chat.assignmentId}
                delete={chatDeleteHandler}
                onSelect={selectHandler}
                selected={chat.assignmentId === selectedChat}
              />
            ))
          : "Please create a chat to proceed"}
        <div onClick={modalToggle} className={styles.new_chat}>
          <img src={New_Button} />
          <p>New Chat</p>
        </div>
        {toggle ? (
          <CreateChatModal onSubmit={addChatHandler} toggle={modalToggle} />
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default ChatList;
