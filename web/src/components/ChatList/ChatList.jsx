import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ChatCard from "../ChatCard/ChatCard";
import New_Button from "../../assets/New button.svg";

import styles from "./ChatList.module.css";
import CreateChatModal from "../CreateChatModal/CreateChatModal";
import { bigDataAction } from "../../store/bigDataSlice";
import axios from "axios";

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

  const usrData = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    const cleanUp = async () => {
      // console.log(usrData)


      const chatRooms = await axios
        .post("https://api.parrot.cmkl.ai/auth/chatroom/fetch", {
          username: usrData.username,
          email: usrData.email,
          course: subjectId,
          api_key: usrData.api_key,
        })
        .then((res) => res.data.chatrooms);

      console.log(chatRooms);
      dispatch(bigDataAction.setChats({ subjectId, chats: chatRooms }));
      setChats(chatRooms);
    };

    cleanUp();
  }, [subjectId]);

  // console.log(selectedChat);

  const chatDeleteHandler = (id) => {
    shouldUpdate = false;

    console.log(chats.filter((chat) => {
      return chat.name !== id;
    }))

    setChats(
      chats.filter((chat) => {
        return chat.name !== id;
      })
    );

    dispatch(bigDataAction.deleteChat({ id, subjectId, assignmentId }));
    nav(`/Chat/${subjectId}/General`)

    axios.post("https://api.parrot.cmkl.ai/auth/chatroom/delete", {
      username: usrData.username,
      email: usrData.email,
      course: subjectId,
      chatroom_name: id,
      api_key: usrData.api_key,
    });
  };

  // console.log("I updated")

  const selectHandler = (id) => {
    if (shouldUpdate === true) {
      // console.log("I have been selected")
      nav(`/Chat/${subjectId}/${id}`);
      setSelectedChat(id);
    } else {
      shouldUpdate = true;
    }
  };

  const modalToggle = () => {
    setToggle(!toggle);
  };

  const addChatHandler = async (name) => {
    // const fetchedHistory = await axios.post(
    //   "https://api.parrot.cmkl.ai/ai/getFullHistory",
    //   {
    //     username: usrData.username,
    //     email: usrData.email,
    //     course: subjectId,
    //     chatroom_name: name,
    //     api_key: usrData.api_key,
    //   }
    // ).catch(err => console.log(err));

    // // console.log(history)

    // console.log(fetchedHistory)
    dispatch(bigDataAction.addChat({ name, subjectId }));
    // console.log(data.filter((sub) => sub.course === subjectId)[0].assignments)
    setToggle(!toggle);
    // nav(`/Chat/${subjectId}/${name}`);

    // axios.post('')
  };

  // console.log(chats)

  return (
    <>
      <section className={styles.chatList}>
        {chats.length !== 0
          ? chats.map((chat) => (
              <ChatCard
                // assignment={chat.assignment}
                sessionName={chat.name}
                id={chat.name}
                delete={chatDeleteHandler}
                onSelect={selectHandler}
                selected={chat.name === selectedChat}
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
