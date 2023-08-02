import styles from './CopySuccessfulPopup.module.css';

const CopySuccessfulPopup = (props) => {
//   setTimeout(() => {
//     props.close()
//   }, 1000)

  

  return (
    <div style={{
        opacity: props.copyStatus === "ENDED" ? 0 : 1
    }} className={styles.wrapper}>
        <p>{props.copyStatus === "ENDED" ? "Copied to clipboard sucessful!" : "Copying text to clipboard..."}</p>
    </div>
  )
}

export default CopySuccessfulPopup