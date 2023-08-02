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
  const [selectedChat, setSelectedChat] = useState(null);
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
        .post("https://api.canarie.cmkl.ai/auth/chatroom/fetch", {
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
    console.log(
      chats.filter((chat) => {
        return chat.name !== id;
      })
    );
    setChats(
      chats.filter((chat) => {
        return chat.name !== id;
      })
    );
    dispatch(bigDataAction.deleteChat({ id, subjectId, assignmentId }));
    nav(`/Chat/${subjectId}/General`);
    setSelectedChat(null);

    axios.post("https://api.canarie.cmkl.ai/auth/chatroom/delete", {
      username: usrData.username,
      email: usrData.email,
      course: subjectId,
      chatroom_name: id,
      api_key: usrData.api_key,
    });
  };

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

  const [testName, setTestName] = useState("");
  const addChatHandler = async (name) => {
    // console.log(chats)
    // const intances = chats.filter(c => c.name === name)

    // if (intances.length !== 0) {
    //   return;
    // }

    // const fetchedHistory = await axios.post(
    //   "https://api.canarie.cmkl.ai/ai/getFullHistory",
    //   {
    //     username: usrData.username,
    //     email: usrData.email,
    //     course: subjectId,
    //     chatroom_name: name,
    //     api_key: usrData.api_key,
    //   }
    // ).catch(err => console.log(err));
    // console.log('history')
    // console.log(fetchedHistory)

    dispatch(bigDataAction.addChat({ name, subjectId }));
    setTestName(name);
    // console.log(data.filter((sub) => sub.course === subjectId)[0].assignments)
    setToggle(!toggle);
    setSelectedChat(name);
    nav(`/Chat/${subjectId}/${name}`);
    // nav(`/Chat/${subjectId}/${name}`);
    // axios.post('')
  };

  const getChatnameHandler = async () => {
    const testData = await axios
      .post("https://api.canarie.cmkl.ai/auth/chatroom/fetch", {
        username: usrData.username,
        email: usrData.email,
        course: subjectId,
        api_key: usrData.api_key,
      })
      .catch((err) => console.log(err));
    console.log(testData);
  };

  useEffect(() => {
    if (chats.length !== 0 && selectedChat == null) {
      setSelectedChat("General");
    }
  });

  return (
    <>
      <section className={styles.chatList}>
        {chats.length !== 0
          ? chats
              .filter((chat) => chat.name === "General")
              .map((chat) => (
                <ChatCard
                  // assignment={chat.assignment}
                  sessionName={chat.name}
                  id={chat.name}
                  onSelect={selectHandler}
                  selected={chat.name === selectedChat}
                />
              ))
          : ""}
        {chats.length !== 0
          ? chats
              .filter((chat) => chat.name !== "General")
              .map((chat) => (
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
        {/* <button onClick={getChatnameHandler}>test</button> */}
        {toggle && (
          <CreateChatModal chats={chats} onSubmit={addChatHandler} toggle={modalToggle} />
        )}
      </section>
    </>
  );
};

export default ChatList;
