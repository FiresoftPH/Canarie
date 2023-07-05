import FileCard from "../FileCard/FileCard";

import styles from "./FileList.module.css";

const FileList = (props) => {
  //   const mh = props.maxHeight;

  return (
    <>
      <section
        style={{
          maxHeight: props.mh,
        }}
        className={styles.file_status}
      >
        <FileCard selected name="Untitled-1" />
        <FileCard name="Untitled-2" />
        <FileCard name="Untitled-3" />
      </section>
    </>
  );
};

export default FileList;
