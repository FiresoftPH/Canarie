import { useState } from "react";
import ChatCard from "../ChatCard/ChatCard";

import styles from "./ChatList.module.css";

// const INITAL_STATE = [
//   { id: 1, assignment: "Chem", sessionName: "organic chem" },
//   { id: 2, assignment: "Physics", sessionName: "fluid mechanics" },
//   { id: 3, assignment: "Math", sessionName: "calculus" },
// ];

const DUMMY_DATA = [
  { id: 1, assignment: "Chem", sessionName: "organic chem" },
  { id: 2, assignment: "Physics", sessionName: "fluid mechanics" },
  { id: 3, assignment: "Math", sessionName: "calculus" },
  { id: 4, assignment: "Math", sessionName: "calculus" },
  { id: 5, assignment: "Math", sessionName: "calculus" },
  { id: 6, assignment: "Math", sessionName: "calculus" },
  { id: 7, assignment: "Math", sessionName: "calculus" },
];

const ChatList = (props) => {
  const [chats, setChats] = useState(DUMMY_DATA);
  const [selectedChat, setSelectedChat] = useState(DUMMY_DATA[0].id);

  const chatDeleteHandler = (id) => {
    setChats(
      chats.filter((chat) => {
        return chat.id !== id;
      })
    );
  };

  const selectHandler = (id) => {
    setSelectedChat(id);
  };

  return (
    <>
      <section
        style={{
          maxHeight: props.maxHeight,
        }}
        className={styles.chatList}
      >
        {chats.map((chat) => {
          let selected = false

          if (chat.id === selectedChat) {
            selected = true
          }

          return (
            <ChatCard
              assignment={chat.assignment}
              sessionName={chat.sessionName}
              id={chat.id}
              delete={chatDeleteHandler}
              onSelect={selectHandler}
              selected={selected}
              //   {selectedChat === chat.id ? pressed : ""}
            />
          );
        })}

      </section>
    </>
  );
};

export default ChatList;
