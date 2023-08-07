import { useEffect, useState } from "react";
import FileCard from "../FileCard/FileCard";
import styles from "./FileList.module.css";
// import BigData from "../ChatUI/BigData.json";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { chatAction } from "../../store/chatSlice";
import { bigDataAction } from "../../store/bigDataSlice";
// import Transition from "react-transition-group/Transition";

let shouldUpdateId = true;
// let hadRendered = false;

const FileList = (props) => {
  const { subjectId, assignmentId } = useParams();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.bigData);
  const shouldUp = useSelector((state) => state.chat.shouldUpdate);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState();

  //   const mh = props.maxHeight;

  // console.log("re rendered");

  // console.log(data
  //   .filter((sub) => sub.course === subjectId)[0]
  //   .files.map((file) => {
  //     return { id: file.id, name: file.name };
  //   }))

  // const dep = useMemo(
  //   () => data.filter((sub) => sub.course === subjectId)[0].files,
  //   [
  // data
  //   .filter((sub) => sub.course === subjectId)[0]
  //   .files.map((f) => {
  //     return { id: f.id, name: f.name };
  //   }),
  //   ]
  // );

  // console.log(dep);
  useEffect(() => {
    // if (assignmentId !== "General") {
    // console.log(data)
    // console.log("when file upload")
    if (shouldUp === true) {
      // console.log("I run");
      const transformedData = data.filter((sub) => sub.course === subjectId)[0]
        .files;
      // console.log(transformedData)
      setFiles(transformedData);
      // setSelectedFile(transformedData[0].id);
      if (transformedData.length > 0) {
        props.saveFile(transformedData[0].id);
        dispatch(chatAction.setCode(transformedData[0].code));
      }
    } else {
      // console.log("Nah I ain't running");
      dispatch(chatAction.setShouldUpdate(true));
    }
    // }
  }, [data.filter((sub) => sub.course === subjectId)[0].files]);
  // useEffect(() => {
  //   console.log("I run v2")
  // }, [])
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
      // console.log(transformedData);
      setSelectedFile(transformedData.id);
      dispatch(chatAction.setCode(transformedData.code));
      dispatch(chatAction.setFileId(transformedData.id));
      props.saveFile(transformedData.id);
      // console.log(transformedData)
    }
  };

  // When a file card is clicked, trigger this event
  const fileSelectHandler = (id, code) => {
    // console.log(files.filter(fie => fie.id === id)[0].code)
    if (shouldUpdateId === true) {
      // dispatch(
      //   chatAction.setCode(files.filter((fie) => fie.id === id)[0].code)
      // );
      // console.log("Selected file")
      // console.log(files.filter((fie) => fie.id === id)[0].code)
      // console.log(transformedData)
      setSelectedFile(id);
      // setSelectedFile(transformed
      dispatch(
        chatAction.setCode(
          data
            .filter((sub) => sub.course === subjectId)[0]
            .files.filter((f) => f.id === id)[0].code
        )
      );
      dispatch(chatAction.setShouldUpdate(true));
      dispatch(chatAction.setFileId(id));
      props.saveFile(id);
    } else {
      shouldUpdateId = true;
    }
    // props.saveFile(id);
  };

  return (
    <>
      <section className={styles.file_status}>
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
                  code={file.code}
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
