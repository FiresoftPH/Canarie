import { useState, useCallback, useEffect } from "react";
import styles from "./Chat.module.css";
import LongSidebar from "src/components/Sidebar/LongSidebar";
import ShortSideBar from "../../components/Sidebar/ShortSideBar";
import CodeMirror from '@uiw/react-codemirror'

import { EditorView } from "@codemirror/view"
import { langs } from '@uiw/codemirror-extensions-langs'
import * as alls from '@uiw/codemirror-themes-all'
import { dracula } from '@uiw/codemirror-theme-dracula'

function Chat() {
  const [close, setClose] = useState(false);

  const toggleClose = (val) => {
    setClose((state) => {
      return !state;
    });
  };

  const onChange = useCallback((value,viewUpdate) => {
    console.log('value:', value);
  }, []);
  const fixedHeightEditor = EditorView.theme({
    "&": {height: "40vh"},
    ".cm-content" : { overflow: "auto"},
  })

  return (
    // <div className={`styles.bg_container ` + (close ? "close" : "open")}>
    <div className={`${styles.bg_container} ${close ? styles.close : styles.open}`}>
      {close ? (
        <ShortSideBar open={toggleClose} />
      ) : (
        <LongSidebar close={toggleClose} />
      )}
      <section className={styles.chat}></section>
      <section className={styles.ide_container}>
        <label >
          Languages:
          <select className={styles.lang_selection}  id="">
            {Object.keys(langs).sort().map((item, key) => {
              return (
                <option key = {key}>
                  {item}
                </option>
              )
            })}
          </select>
        </label>
        <CodeMirror
          className={styles.ide}
          value="console.log('helloworld!')"
          theme={ [alls.githubDark] }
          // theme={ dracula }
          extensions={[langs.python(), fixedHeightEditor, EditorView.lineWrapping]}
          onChange = { onChange }
        />
      </section>
      <section className={styles.output}></section>
    </div>
  );
}

export default Chat;
