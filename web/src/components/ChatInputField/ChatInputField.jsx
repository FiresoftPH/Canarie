import styles from "./ChatInputField.module.css";

import FileAttachmentIcon from "src/assets/FileAttachmentIcon.svg";
import SendIcon from "src/assets/SendIcon.svg";
import { useState } from "react";
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
  let fd;
  let fname = "Unnamed";
  const fileUploadHandler = (e) => {
    // console.log(e.target.files)
    if (!e.target.files[0]) {
      return;
    }

    fd = new FormData();
    fd.append("file", e.target.files[0]);

    fr = new FileReader();
    fr.onloadend = fileReaderHandler;
    fr.readAsText(e.target.files[0]);
    // console.log(e.target.files[0])
    fname = e.target.files[0].name;
    // console.log(fr.readAsText(e.target.files[0]))
    // console.log(fd.readAsText())
  };

  const fileReaderHandler = (f) => {
    dispatch(
      bigDataAction.addFiles({
        subjectId,
        assignmentId,
        name: fname,
        code: fr.result,
      })
    );

    props.onUploadFile([{
      subjectId,
      assignmentId,
      name: fname,
      code: fr.result,
    }])

    console.log("COMPLETED DISPATCH");
    console.log(bigD);
  };

  return (
    <div className={styles.wrapper}>
      <div
        // onClick={() => {
        //   if (props.lock === false) props.onFileAttach();
        // }}
        className={`${styles.attachment} ${props.lock ? styles.locked : ""}`}
      >
        {!props.lock ? <label>
          <input
            onChange={(e) => {
              fileUploadHandler(e);
            }}
            type="file"
          />
        </label> : ""}
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
            <input
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              value={question}
              className={styles.inputField}
            />
          )}
        </form>
        <img onClick={askHandler} className={styles.send} src={SendIcon} />
      </div>
    </div>
  );
};

export default ChatInputField;
