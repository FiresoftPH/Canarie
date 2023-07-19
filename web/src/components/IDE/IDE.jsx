import styles from "./IDE.module.css";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import runIcon from "../../assets/RunBtn.svg";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useDispatch, useSelector } from "react-redux";
import { bigDataAction } from "../../store/bigDataSlice";

import interact from "interactjs";

import * as alls from "@uiw/codemirror-themes-all";
import { useRef } from "react";

const IDE = (props) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [mousePos, setMousePos] = useState({});
  const [ideDimention, setIdeDimention] = useState({ x: "10rem", y: "20rem" });

  const ideRef = useRef(null);
  const textEditor = useRef(null);

  useEffect(() => {
    if (mouseDown == false) {
      return;
    }

    // console.log(window.innerHeight - mousePos.y);
    setIdeDimention({ y: window.innerHeight - mousePos.y + 10 });
  }, [mousePos]);

  function handleLangChange(lang) {
    setLanguage(lang);
  }

  const fileSaveHandler = () => {
    // console.log("File saved!1!!")
    // console.log(fileId)
    dispatch(bigDataAction.editFile({ subjectId, assignmentId, fileId, code }));
  };

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const fileId = useSelector((state) => state.chat.fid);
  const { subjectId, assignmentId } = useParams();
  const dispatch = useDispatch();

  // const codeData = useSelector(state => state.chat.code)

  const codeData = useSelector((state) => state.chat.code);
  const fid = useSelector((state) => state.chat.fid);

  useEffect(() => {
    setCode(codeData);
  }, [codeData, fid]);

  // IDE stuff //
  const onChange = useCallback((value) => {
    setCode(value);
  }, []);

  const executeCode = () => {
    try {
      let result;
      switch (language) {
        case "javascript":
          result = excuteJavascriptCode(code);
          console.log("1");
          break;
        case "python":
          result = excutePythonCode(code);
          console.log("2");
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
    const cacheName = "file.py";
    const fileContent = code;

    const blob = new Blob([fileContent], { type: "text/plain" });

    const cachePromise = caches.open(cacheName).then((cache) => {
      const request = new Request(cacheName);
      const response = new Response(blob);
      return cache.put(request, response);
    });
    cachePromise.catch((error) => {
      console.error("Error saving code to cache:", error);
    });
  };

  const excuteJavascriptCode = (code) => {
    const cacheName = "file.js";
    const fileContent = code;

    // const blob = new Blob([fileContent], { type: 'text/plain' });

    const cachePromise = caches.open(cacheName).then((cache) => {
      const request = new Request(cacheName);
      const response = new Response(fileContent);
      return cache.put(request, response);
    });
    cachePromise.catch((error) => {
      console.error("Error saving code to cache:", error);
    });
  };

  const fixedHeightEditor = EditorView.theme({
    // "&": { height: "inherit" },
    ".cm-content": { overflow: "scroll" },
  });

  const langTemplate = {
    python: langs.python(),
    java: langs.java(),
    javascript: langs.javascript(),
    typescript: langs.typescript(),
    c: langs.c(),
    css: langs.css(),
    csharp: langs.csharp(),
    dockerfile: langs.dockerfile(),
    dart: langs.dart(),
    go: langs.go(),
    html: langs.html(),
    lua: langs.lua(),
    mysql: langs.mysql(),
    php: langs.php(),
  };

  useEffect(() => {
    interact(ideRef.current).resizable({
      edges: { top: true, left: false, bottom: false, right: false },
      listeners: {
        move: function (event) {
          let { x, y } = event.target.dataset;

          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate3D(${x}px, ${y}px)`,
          });

          Object.assign(event.target.dataset, { x, y });
        },
      },
    });

    interact(textEditor.current).resizable({
      edges: { top: false, left: false, bottom: false, right: true },
      listeners: {
        move: function (event) {
          let { x, y } = event.target.dataset;

          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate3D(${x}px, ${y}px)`,
          });

          Object.assign(event.target.dataset, { x, y });
        },
      },
    });
  });

  return (
    <div
      className={styles.big_ide_container}
      style={{
        height: ideDimention.y,
      }}
      ref={ideRef}
    >
        <div
          className={styles.sidin}
        >
          =
        </div>
        <div className={styles.ide_output}>
          <section ref={textEditor} className={styles.ide_container}>
            <div className={styles.ide_topbar}>
              <label>
                Languages:
                <select
                  className={styles.lang_selection}
                  value={language}
                  onChange={(evn) => handleLangChange(evn.target.value)}
                >
                  {Object.keys(langTemplate)
                    .sort()
                    .map((item, key) => {
                      return (
                        <option key={key} value={item}>
                          {item}
                        </option>
                      );
                    })}
                </select>
              </label>
              <img
                className={styles.run_btn}
                src={runIcon}
                onClick={executeCode}
              />
              {/* <img src={MinimizeIcon} /> */}
            </div>
            <div onBlur={fileSaveHandler}>
              <CodeMirror
                className={styles.ide}
                value={code}
                theme={[alls.atomone]}
                extensions={[
                  langTemplate[language],
                  fixedHeightEditor,
                  EditorView.lineWrapping,
                ]}
                onChange={onChange}
              />
            </div>
            <div className={styles.verticalSlide}>||</div>
          </section>
          <section className={styles.output}>{output}</section>
        </div>
      </div>
  );
};

export default IDE;
