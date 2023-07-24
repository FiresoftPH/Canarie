import { useState, useCallback, useEffect } from "react";
import styles from "./ChatPage.module.css";
import LongSidebar from "src/components/Sidebar/LongSidebar";
import ShortSideBar from "../../components/Sidebar/ShortSideBar";
import ChatUI from "../../components/ChatUI/ChatUI";
import IDE from "../../components/IDE/IDE";
import Transition from "react-transition-group/Transition";

function Chat() {
  const [close, setClose] = useState(false);

  const [mode, setMode] = useState("General");

  const toggleClose = (val) => {
    setClose(!close);
  };

  // IDE stuff //
  return (
    // <div className={`styles.bg_container ` + (close ? "close" : "open")}>
    <div
      className={`${styles.bg_container} ${close ? styles.close : styles.open}`}
    >
      <Transition in={close} timeout={300} mountOnEnter unmountOnExit>
        {(state) => <ShortSideBar open={toggleClose} show={state} />}
      </Transition>
      <Transition in={!close} timeout={300} mountOnEnter unmountOnExit>
        {(state) => (
          <LongSidebar
            onSelectMode={(id) => {
              // setMode(id);
              console.log("ID: ", id);
            }}
            close={toggleClose}
            show={state}
          />
        )}
      </Transition>
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
