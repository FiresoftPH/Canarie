import { useState } from "react";
import styles from "./ChatPage.module.css";
import LongSidebar from "src/components/Sidebar/LongSidebar";
import ShortSideBar from "../../components/Sidebar/ShortSideBar";
import ChatUI from "../../components/ChatUI/ChatUI";
import IDE from "../../components/IDE/IDE";
import Transition from "react-transition-group/Transition";

function Chat() {
  const [closev2, setClosev2] = useState(false);
  const toggleClosev2 = (val) => {
    setClosev2(!closev2);
  };
  return (
    <div
      className={`${styles.bg_container} ${closev2 ? styles.close : styles.open}`}
    >
      <Transition in={closev2} timeout={300} mountOnEnter unmountOnExit>
        {(state) => <ShortSideBar open={toggleClosev2} show={state} />}
      </Transition>
      <Transition in={!closev2} timeout={300} mountOnEnter unmountOnExit>
        {(state) => (
          <LongSidebar
            onSelectMode={(id) => {
              console.log("ID: ", id);
            }}
            close={toggleClosev2}
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
