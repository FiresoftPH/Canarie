import { useEffect, useState } from "react";
import FileCard from "../FileCard/FileCard";

import styles from "./FileList.module.css";

// const DUMMY_DATA = [
// { id: 1, name: "Untitled-1" },
// { id: 2, name: "Untitled-2" },
// { id: 3, name: "Untitled-3" },
// { id: 4, name: "Untitled-4" },
// { id: 5, name: "Untitled-5" },
// { id: 6, name: "Untitled-6" },
// ];

// import DUMMY_DATA from './FileNames.json'
import BigData from "../ChatUI/BigData.json";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { chatAction } from "../../store/chatSlice";
import { bigDataAction } from "../../store/bigDataSlice";
import Transition from "react-transition-group/Transition";

let shouldUpdateId = true;
let hadRendered = false;

const FileList = (props) => {
  const { subjectId, assignmentId } = useParams();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.bigData);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState();

  //   const mh = props.maxHeight;

  // console.log("re rendered");

  // console.log(data
  //   .filter((sub) => sub.course === subjectId)[0]
  //   .files.map((file) => {
  //     return { id: file.id, name: file.name };
  //   }))

  useEffect(() => {
    // if (assignmentId !== "General") {

    // console.log(data)
    console.log("when file upload")

    const transformedData = data.filter((sub) => sub.course === subjectId)[0]
      .files;
    // console.log(transformedData)

    setFiles(transformedData);
    // setSelectedFile(transformedData[0].id);
    if (transformedData.length > 0) {
      props.sf(transformedData[0].id);
      dispatch(chatAction.setCode(transformedData[0].code));
    }
    // }
  }, [
    data
      .filter((sub) => sub.course === subjectId)[0]
      .files.map((file) => {
        return { id: file.id, name: file.name };
      }),
  ]);

  // When a file card is deleted, trigger this event
  const fileDeleteHandler = (id) => {
    shouldUpdateId = false;
    const filteredData = files.filter((file) => {
      return file.id !== id;
    });

    dispatch(bigDataAction.deleteFile({ subjectId, fileId: id }));
    setFiles(filteredData);

    if (files.length !== 0) {
      const transformedData = filteredData[0];

      console.log(transformedData);

      setSelectedFile(transformedData.id);
      dispatch(chatAction.setCode(transformedData.code));
      dispatch(chatAction.setFileId(transformedData.id));
      props.sf(transformedData.id);

      // console.log(transformedData)
    }
  };

  // When a file card is clicked, trigger this event
  const fileSelectHandler = (id) => {
    // console.log(files.filter(fie => fie.id === id)[0].code)
    if (shouldUpdateId === true) {
      dispatch(
        chatAction.setCode(files.filter((fie) => fie.id === id)[0].code)
      );
      dispatch(chatAction.setFileId(id));
      setSelectedFile(id);
    } else {
      shouldUpdateId = true;
    }
    props.sf(id);
  };

  return (
    <>
      <section
        // style={{
        //   maxHeight: props.mh,
        // }}
        className={styles.file_status}
      >
        {/* <FileCard selected name="Untitled-1" />
        <FileCard name="Untitled-2" />
        <FileCard name="Untitled-3" /> */}
        {files.length > 0
          ? files.map((file) => {
              return (
                <FileCard
                  onSelect={fileSelectHandler}
                  onDelete={fileDeleteHandler}
                  name={file.name}
                  id={file.id}
                  selected={selectedFile === file.id}
                />
              );
            })
          : "Please upload a file"}
      </section>
    </>
  );
};

export default FileList;
