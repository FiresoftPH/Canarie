import { useState } from "react";
import styles from "./Chat.module.css";
import LongSidebar from "src/components/Sidebar/LongSidebar";
import ShortSideBar from "../../components/Sidebar/ShortSideBar";

function Chat() {
  const [close, setClose] = useState(false);

  const toggleClose = (val) => {
    setClose((state) => {
      return !state;
    });
  };

  return (
    // <div className={`styles.bg_container ` + (close ? "close" : "open")}>
    <div className={`${styles.bg_container} ${close ? styles.close : styles.open}`}>
      {close ? (
        <ShortSideBar open={toggleClose} />
      ) : (
        <LongSidebar close={toggleClose} />
      )}
      <section className={styles.chat}></section>
      <section className={styles.ide}></section>
      <section className={styles.output}></section>
    </div>
  );
}

export default Chat;
