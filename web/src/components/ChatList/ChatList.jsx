import { useState } from "react";
import ChatCard from "../ChatCard/ChatCard";

import styles from "./ChatList.module.css";

const DUMMY_DATA = [
  { id: 1, assignment: "Chem", sessionName: "organic chem" },
  { id: 2, assignment: "Physics", sessionName: "fluid mechanics" },
  { id: 3, assignment: "Math", sessionName: "calculus" },
];

const ChatList = (props) => {
  const [chats, setChats] = useState(DUMMY_DATA);

  const chatDeleteHandler = (id) => {
    setChats(chats.filter((chat) => {
        return chat.id !== id
    }))
  }

  return (
    <>
      <section
        style={{
          maxHeight: props.maxHeight,
        }}
        className={styles.chatList}
      >
        {/* <ChatCard
          selected
          assignment="chem"
          sessionName="What is equalibrium"
        />
        <ChatCard assignment="physics" sessionName="What is equalibrium" />
        <ChatCard assignment="physics" sessionName="What is equalibrium" /> */}
        {chats.map((chat) => {
          return (
            <ChatCard
              assignment={chat.assignment}
              sessionName={chat.sessionName}
              id={chat.id}
              delete={chatDeleteHandler}
            />
          );
        })}
      </section>
    </>
  );
};

export default ChatList;
