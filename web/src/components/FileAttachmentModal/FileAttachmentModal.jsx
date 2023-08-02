import styles from "./FileAttachmentModal.module.css";
import FileCard from "../FileCard/FileCard";
import { useState } from "react";

const FileAttachmentModal = (props) => {
  const [selectedFiles, setSelectFiles] = useState([]);

  const fileSelectHandler = (id, name) => {
    if (!selectedFiles.includes(id)) {
      setSelectFiles([...selectedFiles, id]);
    } else {
      // console.log("not here");
      setSelectFiles(selectedFiles.filter((file) => file !== id));
    }
  };

  const submitHandler = () => {
    const transformedData = props.files.filter((file) =>
      selectedFiles.includes(file.id)
    );

    // console.log(transformedData)
    props.onSubmit(transformedData);
    props.toggle();
  };

  return (
    <div className={`${styles.total}`}>
      <div
        className={styles.backdrop}
        onClick={() => {
          props.toggle();
        }}
      />
      <div className={styles.content}>
        <p>
          {props.static ? "The file you asked" : "Please choose which files you want to ask"}
        </p>
        <div className={`${styles.files} ${props.static ? styles.static : ""}`}>
          {props.files.map((file) => {
            // console.log(file)

            return (
              <FileCard
                onSelect={() => {
                  fileSelectHandler(file.id, file.name);
                }}
                id={file.id}
                name={file.name}
                selected={props.static ? false : selectedFiles.includes(file.id)}
                noDelete
              />
            );
          })}
        </div>
        {selectedFiles.length !== 0 && !props.static ? (
          <div onClick={submitHandler} className={styles.submit}>
            Attach File
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default FileAttachmentModal;
