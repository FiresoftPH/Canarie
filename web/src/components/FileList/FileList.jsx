import { useState } from "react";
import FileCard from "../FileCard/FileCard";

import styles from "./FileList.module.css";

// const DUMMY_DATA = [
//   { id: 1, name: "Untitled-1" },
//   { id: 2, name: "Untitled-2" },
//   { id: 3, name: "Untitled-3" },
//   { id: 4, name: "Untitled-4" },
//   { id: 5, name: "Untitled-5" },
//   { id: 6, name: "Untitled-6" },
// ];

import DUMMY_DATA from './FileNames.json'

const FileList = (props) => {
  //   const mh = props.maxHeight;
  const [files, setFiles] = useState(DUMMY_DATA);
  const [selectedFile, setSelectedFile] = useState(DUMMY_DATA[0].id)

  const fileDeleteHandler = (id) => {
    setFiles(
      files.filter((file) => {
        return file.id !== id;
      })
    );
  };

  const fileSelectHandler = (id) => {
    console.log(id)
    setSelectedFile(id)
  }

  return (
    <>
      <section
        style={{
          maxHeight: props.mh,
        }}
        className={styles.file_status}
      >
        {/* <FileCard selected name="Untitled-1" />
        <FileCard name="Untitled-2" />
        <FileCard name="Untitled-3" /> */}
        {files.map((file) => {
          let selected = false
          
          if (selectedFile === file.id) {
            selected = true
          }

          return <FileCard onSelect={fileSelectHandler} name={file.name} id={file.id} onDelete={fileDeleteHandler} selected={selected} />;
        })}
      </section>
    </>
  );
};

export default FileList;
