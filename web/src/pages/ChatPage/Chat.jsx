import { useState, useCallback } from "react";
import styles from "./Chat.module.css";
import Sidebar from "src/components/Sidebar/Sidebar";
import CodeMirror from '@uiw/react-codemirror'

import { javascript } from '@codemirror/lang-javascript'
import { darcula } from '@uiw/codemirror-theme-darcula'

function Chat() {
const onChange = useCallback((value,viewUpdate) => {
  console.log('value:', value);
}, []);

  return (
    <div className={styles.bg_container}>
      <Sidebar/>
      <section className={styles.chat}></section>
      <CodeMirror
        value="console.log('helloworld!')"
        theme={ darcula }
        extensions={[javascript({ jsx:true})]}
        onChange = { onChange }
      />
      <section className={styles.output}></section>
    </div>
  );
}

export default Chat;
