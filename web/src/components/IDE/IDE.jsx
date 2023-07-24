import styles from "./IDE.module.css";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import runIcon from "../../assets/RunBtn.svg";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { langs } from "@uiw/codemirror-extensions-langs";
import { useDispatch, useSelector } from "react-redux";
import { bigDataAction } from "../../store/bigDataSlice";

import interact from "interactjs";
import * as alls from "@uiw/codemirror-themes-all";

const IDE = (props) => {
  const ideRef = useRef(null);
  const textEditor = useRef(null);
  const prevCode = useRef();

  function handleLangChange(lang) {
    setLanguage(lang);
  }

  const [saveStatus, setSaveStatus] = useState(styles.save_icon)
  
  const fileSaveHandler = () => {
    dispatch(bigDataAction.editFile({ subjectId, assignmentId, fileId, code }));
    console.log('ehe')
    // if code changed the save icon color changed
    if (code !== prevCode.current){
      setSaveStatus(styles.save_icon_green);
      console.log('aroi changed');
    // if code doesn't change the save icon is the same
    } else if (code === prevCode.current){
      setSaveStatus(styles.save_icon);
    }
    // save the new code
    prevCode.current = code;
  };

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [y, setY] = useState("");

  const fileId = useSelector((state) => state.chat.fid);
  const { subjectId, assignmentId } = useParams();
  const dispatch = useDispatch();
  // const codeData = useSelector(state => state.chat.code)

  const codeData = useSelector((state) => state.chat.code);
  const fid = useSelector((state) => state.chat.fid);

  // Set code in the IDE everytime the code for ide or the file id is changed
  useEffect(() => {
    setCode(codeData);
  }, [codeData, fid]);

  // IDE stuff //
  // const onChange = useCallback((value) => {
  //   setCode(value);
  // }, []);
  const keystroke = useCallback((value) => {
    setSaveStatus(styles.save_icon_yellow)
  }, [])

  const onChange1 = event => {
    setCode(event);
    keystroke(event)
  };

  const executeCode = () => {
    try {
      let result;
      switch (language) {
        case "c":
          result = excuteJavascriptCode(code);
          console.log("1");
          break;
        case "csharp":
          result = excutePythonCode(code);
          console.log("2");
          break;
        case "css":
          result = excuteJavascriptCode(code);
          console.log("3");
          break;
        case "docker":
          result = excutePythonCode(code);
          console.log("4");
          break;
        case "go":
          result = excuteJavascriptCode(code);
          console.log("5");
          break;
        case "java":
          result = excutePythonCode(code);
          console.log("6");
          break;
        case "javascript":
          result = excuteJavascriptCode(code);
          console.log("7");
          break;
        case "php":
          result = excutePythonCode(code);
          console.log("8");
          break;
        case "python":
          result = excutePythonCode(code);
          console.log("9");
          break;
        case "typescript":
          result = excutePythonCode(code);
          console.log("10");
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
    "& ": { height:  -y + 200 + "px" }
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
    go: langs.go(),
    php: langs.php(),
  };

  // Initializes a listener event for resizing the ide after rendering
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
          setY(y)
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
      ref={ideRef}
    >
      <div
        className={styles.sidin}
      >
      
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
            <div className={styles.new_file_btn}>new</div>
            <img
              className={styles.run_btn}
              src={runIcon}
              onClick={executeCode}
            />
            <div className={saveStatus}/>
            {/* <img src={MinimizeIcon} /> */}
          </div>
          {/* i think we have to move the on focus and blur inside codemirror */}
          <div className={styles.ide_bottombar} >
            <CodeMirror
              className={styles.ide}
              value={code}
              theme={[alls.atomone]}
              extensions={[
                langTemplate[language],
                fixedHeightEditor,
                EditorView.lineWrapping,
              ]}
              onBlur={fileSaveHandler}
              onChange={onChange1}
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
