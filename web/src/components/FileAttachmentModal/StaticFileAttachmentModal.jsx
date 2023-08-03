import styles from "./FileAttachmentModal.module.css";
import StaticFileCard from '../FileCard/StaticFileCard.jsx';

const StaticFileAttachmentModal = (props) => {
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
          {props.files[0].map((file) => {
            // if (typeof file === "string") {
            //   return (
            //     <StaticFileCard
            //       fileName={file.name}
            //     />
            //   );
            // } else {
              return (
                <StaticFileCard fileName={file} />
              )
              // console.log(file)
            // }
          })}
        </div>
      </div>
    </div>
  );
};

export default StaticFileAttachmentModal;
