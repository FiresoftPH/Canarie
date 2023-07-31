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
import axios from "axios";

import ReactMarkdown from "react-markdown";

import DownV from "../../assets/DownV.svg";
import { chatAction } from "../../store/chatSlice";
import { StateEffect } from "@codemirror/state";

const defaultSelect = "PROGRAMMING LANGUAGE";

let codeee = "";
const IDE = (props) => {
  const ideRef = useRef(null);
  const textEditor = useRef(null);
  const codeMirror_ref = useRef(null);

  const [language, setLanguage] = useState(defaultSelect);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [y, setY] = useState("");

  const fileId = useSelector((state) => state.chat.fid);
  const { subjectId, assignmentId } = useParams();
  const dispatch = useDispatch();
  // const codeData = useSelector(state => state.chat.code)

  const codeData = useSelector((state) => state.chat.code);

  // console.log(codeData);
  const fid = useSelector((state) => state.chat.fid);

  const bigData = useSelector((state) => state.bigData);

  console.log(bigData);

  // Set code in the IDE everytime the code for ide or the file id is changed
  useEffect(() => {
    console.log(codeData);
    setCode(codeData);
    // codeee = codeData;
  }, [codeData, fid]);

  // IDE stuff //
  // const onChange = useCallback((value) => {
  //   setCode(value);
  // }, []);

  const onChange1 = (event) => {
    // console.log(event)
    setCode(event);
  };

  function handleLangChange(lang) {
    setLanguage(lang);
  }

  // console.log(code)

  const fileSaveHandler = () => {
    console.log("Saving file");
    console.log("codeData", { subjectId, assignmentId, fileId, code });
    console.log("code", code);

    dispatch(bigDataAction.editFile({ subjectId, assignmentId, fileId, code }));
    dispatch(chatAction.setCode(code));
    dispatch(chatAction.setShouldUpdate(false));
    console.log("ehe");

    // return () => {
    //   dispatch(chatAction.setShouldUpdate(true))

    //   console.log(code)
    // }
  };

  const executeCode = () => {
    try {
      let result;
      switch (language) {
        case "c++":
          result = exeCode(code, ".cpp");
          // console.log("1");
          break;
        case "csharp":
          result = exeCode(code, ".cs");
          // console.log("2");
          break;
        case "python":
          result = exeCode(code, ".py");
          // console.log("9");
          break;
        default:
          throw new Error(`Language mode "${language}" is not supported.`);
      }
      // Set the output with the result of code execution
      // setOutput(result);
    } catch (error) {
      // Set the output with the error message if any
      setOutput(error.toString());
    }
  };

  const usrData = JSON.parse(localStorage.getItem("data"));

  const exeCode = async (code, fType) => {
    const res = await axios.post("https://api.parrot.cmkl.ai/compileCode", {
      username: usrData.username,
      email: usrData.email,
      code: code,
      api_key: usrData.api_key,
      file_extension: fType,
    });

    console.log(res);

    setOutput(
      res.data.Error !== ""
        ? "An error has occured, please check if your file type is correct or your code is free of error"
        : res.data.Output
    );
  };

  // const excutePythonCode = (code) => {
  //   const cacheName = "file.py";
  //   const fileContent = code;

  //   const blob = new Blob([fileContent], { type: "text/plain" });

  //   const cachePromise = caches.open(cacheName).then((cache) => {
  //     const request = new Request(cacheName);
  //     const response = new Response(blob);
  //     return cache.put(request, response);
  //   });
  //   cachePromise.catch((error) => {
  //     console.error("Error saving code to cache:", error);
  //   });
  // };

  // const excuteJavascriptCode = (code) => {
  //   const cacheName = "file.js";
  //   const fileContent = code;

  //   // const blob = new Blob([fileContent], { type: 'text/plain' });

  //   const cachePromise = caches.open(cacheName).then((cache) => {
  //     const request = new Request(cacheName);
  //     const response = new Response(fileContent);
  //     return cache.put(request, response);
  //   });
  //   cachePromise.catch((error) => {
  //     console.error("Error saving code to cache:", error);
  //   });
  // };

  const fixedHeightEditor = EditorView.theme({
    "& ": { height: -y + 200 + "px" },
  });

  const langTemplate = {
    python: langs.python(),
    // java: langs.java(),
    // javascript: langs.javascript(),
    // typescript: langs.typescript(),
    // c: langs.c(),
    // css: langs.css(),
    csharp: langs.csharp(),
    // dockerfile: langs.dockerfile(),
    // go: langs.go(),
    // php: langs.php(),
    "c++": langs.cpp(),
  };

  // console.log(language)

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
          setY(y);
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

  const selectRef = useRef();

  return (
    <div className={styles.big_ide_container} ref={ideRef}>
      <div className={styles.sidin}></div>
      <div className={styles.ide_output}>
        <section ref={textEditor} className={styles.ide_container}>
          <div className={styles.ide_topbar}>
            <label>
              {/* <p>Languages:</p> */}
              <select
                className={styles.lang_selection}
                value={language}
                ref={selectRef}
                onChange={(evn) => handleLangChange(evn.target.value)}
              >
                <option value={defaultSelect} hidden>
                  {defaultSelect}
                </option>
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
              {/* <img onClick={() => {
                const synteticEvent = new MouseEvent('mousedown', {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                });
                
                selectRef.current.controlRef.dispatchEvent(synteticEvent);
              }} src={DownV} /> */}
            </label>
            {/* <div className={styles.new_file_btn}>new</div> */}
            <img
              className={styles.run_btn}
              src={runIcon}
              onClick={executeCode}
            />
            {/* <div className={saveStatus} /> */}
            {/* <img src={MinimizeIcon} /> */}
          </div>
          {/* i think we have to move the on focus and blur inside codemirror */}
          <div className={styles.ide_bottombar}>
            <CodeMirror
              className={styles.ide}
              value={code}
              ref={codeMirror_ref}
              theme={[alls.atomone]}
              extensions={[
                language !== defaultSelect ? langTemplate[language] : null,
                fixedHeightEditor,
                EditorView.lineWrapping,
              ].filter((exten) => exten !== null)}
              onBlur={fileSaveHandler}
              onChange={onChange1}
            />
          </div>
          <div className={styles.verticalSlide}>||</div>
        </section>
        <section className={styles.output}>
          <ReactMarkdown>{output}</ReactMarkdown>
        </section>
      </div>
    </div>
  );
};

export default IDE;
