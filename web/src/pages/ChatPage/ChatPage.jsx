import { useState, useCallback, useEffect } from "react";
import styles from "./ChatPage.module.css";
import LongSidebar from "src/components/Sidebar/LongSidebar";
import ShortSideBar from "../../components/Sidebar/ShortSideBar";
import { useParams } from "react-router-dom";
import ChatUI from "../../components/ChatUI/ChatUI";
import axios from 'axios'

import CodeMirror from '@uiw/react-codemirror'
import { EditorView } from "@codemirror/view"
import { langs } from '@uiw/codemirror-extensions-langs'
import * as alls from '@uiw/codemirror-themes-all'
import { javascript } from "@codemirror/lang-javascript";
import { useDispatch, useSelector } from "react-redux";
import { bigDataAction } from "../../store/bigDataSlice";

function Dimension(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginLeft"]) + parseFloat(styles["marginRight"]);

  return el.offsetWidth + margin;
}

function Dimension2(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return el.offsetHeight + margin;
}

function Chat() {
  const [close, setClose] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const [mode, setMode] = useState("General")

  const fileId = useSelector(state => state.chat.fid)
  const { subjectId, assignmentId } = useParams()
  const dispatch = useDispatch()

  // const codeData = useSelector(state => state.chat.code)

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

  const codeData = useSelector(state => state.chat.code)

  useEffect(() => {
    setCode(codeData)
  }, [codeData])

  // IDE stuff //
  const onChange = useCallback((value) => {
    setCode(value)
  }, []);

  const executeCode = () => {
    try {
      let result;
      switch (language) {
        case 'javascript':
          result = excuteJavascriptCode(code);
          console.log('1');
          break;
        case 'python':
          result = excutePythonCode(code);
          console.log('2');
          break;
        default:
          throw new Error(`Language mode "${language}" is not supported.`);
      }
      // Set the output with the result of code execution
      setOutput(result);
    } catch (error) {
      // Set the output with the error message if any
      setOutput(error.toString());
    }
  };

  const excutePythonCode = (code) => {
    // CacheStorage.bind('python:',code);
    const cacheName = 'file.py';
    const fileContent = code;

    const blob = new Blob([fileContent], { type: 'text/plain' });

    const cachePromise = caches.open(cacheName).then((cache) => {
      const request = new Request(cacheName);
      const response = new Response(blob);
      return cache.put(request, response);
    });
    cachePromise.catch((error) => {
      console.error('Error saving code to cache:', error);
    });
  };
  
  const getSavedCodeFromLocalSorage = () => {
    return localStorage.getItem('python')
  }

  const excuteJavascriptCode = (code) => {
    const cacheName = 'file.js';
    const fileContent = code;

    // const blob = new Blob([fileContent], { type: 'text/plain' });

    const cachePromise = caches.open(cacheName).then((cache) => {
      const request = new Request(cacheName);
      const response = new Response(fileContent);
      return cache.put(request, response);
    });
    cachePromise.catch((error) => {
      console.error('Error saving code to cache:', error);
    });
  }
  
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

  const fileSaveHandler = () => {
    // console.log("File saved!1!!")
    // console.log(fileId)
    dispatch(bigDataAction.editFile({ subjectId, assignmentId, fileId, code }))
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
          <select className={styles.lang_selection} value={language} onChange={(evn) => handleLangChange(evn.target.value)}>
            {Object.keys(langTemplate).sort().map((item, key) => {
              return (
                <option key = {key} value={item}>
                  {item}
                </option>
              )
            })}
          </select>
        </label>
        <button onClick={executeCode}>RUN</button>
        <div onBlur={fileSaveHandler}>
        <CodeMirror
          className={styles.ide}
          value={code}
          theme={ [alls.atomone] }
          extensions={[langTemplate[language], fixedHeightEditor, EditorView.lineWrapping]}
          onChange = { onChange }
        />
        </div>
      </section>
      <section className={styles.output}>
        {output}
      </section>
    </div>
  );
}

export default Chat;
