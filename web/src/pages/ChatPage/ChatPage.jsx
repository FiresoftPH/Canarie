import { useRef, useState } from "react";
import styles from "./ChatPage.module.css";
import LongSidebar from "src/components/Sidebar/LongSidebar";
import ShortSideBar from "../../components/Sidebar/ShortSideBar";
import ChatUI from "../../components/ChatUI/ChatUI";
import IDE from "../../components/IDE/IDE";
import Transition from "react-transition-group/Transition";
import SideBar from '../../components/Sidebar/Sidebar';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { chatAction } from "../../store/chatSlice";

function Chat() {
  const bigDivRef = useRef(null)

  const { subjectId, assignmentId } = useParams()
  const prevParamValueRef = useRef(null);
  const dispatch = useDispatch()

  useEffect(() => {
    // if (prevParamValueRef.current) {
    //   console.log(prevParamValueRef.current)
    // }

    // dispatch(chatAction.setPrevAss(prevParamValueRef.current))
    // prevParamValueRef.current = assignmentId

    dispatch(chatAction.setPrevAss(assignmentId))
  })

  return (
    <div
      className={`${styles.bg_container}`}
      ref={bigDivRef}
    >
      <SideBar bigDivRef={bigDivRef} />
      <div className={styles.right_side}>
        <section id="ChatUI" className={styles.chat}>
          <ChatUI />
        </section>
        <IDE />
      </div>
    </div>
  );
}

export default Chat;
