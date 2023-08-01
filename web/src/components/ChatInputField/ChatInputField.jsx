import styles from "./ChatInputField.module.css";

import FileAttachmentIcon from "src/assets/FileAttachmentIcon.svg";
import SendIcon from "src/assets/SendIcon.svg";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bigDataAction } from "../../store/bigDataSlice";
import { useParams } from "react-router-dom";

const ChatInputField = (props) => {
  const [question, setQuestion] = useState("");

  const [] = useState();
  const dispatch = useDispatch();
  const { subjectId, assignmentId } = useParams();

  const bigD = useSelector((state) => state.bigData);

  const askHandler = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (question === "") {
      return;
    }
    props.onSend(question);
    setQuestion("");
  };

  let fr;
  let fname = "Unnamed";
  const fileUploadHandler = async (e) => {
    console.log(e.target.files);
    if (!e.target.files[0]) {
      return;
    }

    let uploadedFiles = [];
    
    const allFilesRead = () => {
      if (e.target.files.length === uploadedFiles.length) {
        console.log("COMPLETED UPLOAD")
        props.onUploadFile(uploadedFiles);
      }
      // console.log("Been executed")
      // console.log(uploadedFiles)
    }

    // fd = new FormData();
    for (let f = 0; f < e.target.files.length; f++) {
      const fileName = e.target.files[f]["name"];

      console.log(fileName);

      // fname = e.target.files[f].name;

      fr = new FileReader();
      fr.onload = (f) => {
        // fileReaderHandler(e, fname);
        dispatch(
          bigDataAction.addFiles({
            subjectId,
            assignmentId,
            name: fileName,
            code: f.target.result,
          })
        );

        uploadedFiles.push(
          {
            subjectId,
            assignmentId,
            name: fileName,
            code: f.target.result,
          },
        )

        allFilesRead()
      };

      fr.readAsText(e.target.files[f]);

      // fd.append("file", e.target.files[f]);
    }

    // console.log(uploadedFiles.length)

    // console.log(uploadedFiles)
    // while (true) {
    //   if (e.target.files.length === fliesUploaded) {
    //     console.log(uploadedFiles)
    //     break
    //   } else {
    //     console.log(e.target.files.length, fliesUploaded)
    //     continue
    //   }
    // }
  };

  const textareaRef = useRef(null);

  return (
    <div className={`${styles.wrapper} ${props.typing ? styles.lower : ""}`}>
      <div
        // onClick={() => {
        //   if (props.lock === false) props.onFileAttach();
        // }}
        className={`${styles.attachment} ${props.lock ? styles.locked : ""}`}
      >
        {!props.lock ? (
          <label>
            <input
              onChange={(e) => {
                fileUploadHandler(e);
              }}
              multiple
              type="file"
            />
          </label>
        ) : (
          ""
        )}
        <img
          // onClick={() => {
          //   props.onFileAttach();
          // }}
          src={FileAttachmentIcon}
        />
      </div>
      <div className={`${styles.searchBar} ${props.lock ? styles.locked : ""}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askHandler(e.target.files);
          }}
        >
          {props.lock ? (
            ""
          ) : (
            <textarea
              onChange={(e) => {
                setQuestion(e.target.value);
                console.log(e.target.rows);

                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                }
              }}
              ref={textareaRef}
              value={question}
              className={styles.inputField}
              // rows={question.length === 0 ? 1 : null}
              rows={1}
            />
          )}
        </form>
        <img onClick={askHandler} className={styles.send} src={SendIcon} />
      </div>
      <div className={styles.bottomBlur} />
      {props.typing ? (
        <div className={styles.typing}>
          <div className={styles.typing1}></div>
          <div className={styles.typing2}></div>
          <div className={styles.typing3}></div>
          <p>Parrot is typing</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ChatInputField;
