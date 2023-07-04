import { useState } from "react";
import styles from "./Chat.module.css";
import Sidebar from "src/components/Sidebar/Sidebar";

function Chat() {
  return (
    <div className={styles.bg_container}>
      <Sidebar/>
      <section className={styles.chat}></section>
      <section className={styles.ide}></section>
      <section className={styles.output}></section>
    </div>
  );
}

export default Chat;
