import { useState, useCallback, useEffect } from "react";
import styles from "./ChatPage.module.css";
import LongSidebar from "src/components/Sidebar/LongSidebar";
import ShortSideBar from "../../components/Sidebar/ShortSideBar";
import { useParams } from "react-router-dom";
import ChatUI from "../../components/ChatUI/ChatUI";

import CodeMirror from '@uiw/react-codemirror'
import { EditorView } from "@codemirror/view"
import { langs } from '@uiw/codemirror-extensions-langs'
import * as alls from '@uiw/codemirror-themes-all'
import { javascript } from "@codemirror/lang-javascript";

function Dimension(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginLeft"]) + parseFloat(styles["marginRight"]);

  return Math.ceil(el.offsetWidth + margin);
}

function Dimension2(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return Math.ceil(el.offsetHeight + margin);
}

function Chat() {
  const [close, setClose] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [language, setLanguage] = useState('javascript');

  const [mode, setMode] = useState("General")

  useEffect(() => {
    setTimeout(() => {
      const getWidth = window.innerWidth - Dimension(document.getElementById("total"))

      const getHeight = window.innerHeight - Dimension2(document.getElementById("coding"))
      setWidth(getWidth);
      setHeight(getHeight)
    }, 100);
  }, []);

  const toggleClose = (val) => {
    setClose((state) => {
      return !state;
    });

    
    setTimeout(() => {
      const getWidth = window.innerWidth - Dimension(document.getElementById("total"))

      const getHeight = window.innerHeight - Dimension2(document.getElementById("coding"))
      setWidth(getWidth);
      setHeight(getHeight)
    }, 100);
  };

  // IDE stuff //
  const onChange = useCallback((value,viewUpdate) => {
    console.log('value:', value);
  }, []);
  const fixedHeightEditor = EditorView.theme({
    "&": {height: "40vh"},
    ".cm-content" : { overflow: "auto"},
  })
  const langTemplate = { 
    python: langs.python(),
    java : langs.java(),
    javascript: langs.javascript(),
    typescript : langs.typescript(),
    c : langs.c(),
    css : langs.css(),
    csharp : langs.csharp(),
    dockerfile : langs.dockerfile(),
    dart : langs.dart(),
    go : langs.go(),
    html : langs.html(),
    jsx : langs.jsx(),
    lua : langs.lua(),
    mysql : langs.mysql(),
    php : langs.php(),
  };
  function handleLangChange(lang) {
    setLanguage(lang)
  }
  // IDE stuff //

  return (
    // <div className={`styles.bg_container ` + (close ? "close" : "open")}>
    <div className={`${styles.bg_container} ${close ? styles.close : styles.open}`}>
      {close ? (
        <ShortSideBar open={toggleClose} />
      ) : (
        <LongSidebar onSelectMode={(id) => {
          setMode(id)
          console.log("ID: ", id)
        }} close={toggleClose} />
      )}
      <section className={styles.chat}>
        <ChatUI mode={mode} height={height} width={width} />
      </section>
      <section id="coding" className={styles.ide_container}>
        <label >
          Languages:
          <select className={styles.lang_selection} onChange={(evn) => handleLangChange(evn.target.value)}>
            {Object.keys(langTemplate).sort().map((item, key) => {
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
          extensions={[langTemplate[language], fixedHeightEditor, EditorView.lineWrapping]}
          onChange = { onChange }
        />
      </section>
      <section className={styles.output}></section>
    </div>
  );
}

export default Chat;
