import { useEffect, useState } from "react";
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

// import DUMMY_DATA from './FileNames.json'
import BigData from '../ChatUI/BigData.json';
import { useParams } from "react-router-dom";

const FileList = (props) => {
  const { subjectId, assignmentId } = useParams()

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState()
  const [show, setShow] = useState(false)

  //   const mh = props.maxHeight;
  useEffect(() => {
    if (assignmentId !== "General") {
      setShow(true)
  
      const transformedData = BigData.filter(sub => sub.course === subjectId)[0].assignments.filter(ass => ass.assignmentId === assignmentId)[0].files
      // console.log(transformedData)
      setFiles(transformedData)
      setSelectedFile(transformedData[0].id)
    }
  }, [assignmentId])

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
        {show ? files.map((file) => {
          return <FileCard onSelect={fileSelectHandler} name={file.name} id={file.id} onDelete={fileDeleteHandler} selected={selectedFile === file.id} />;
        }) : "Please select an assignment to work on"}
      </section>
    </>
  );
};

export default FileList;
