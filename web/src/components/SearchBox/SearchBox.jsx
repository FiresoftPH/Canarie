import styles from './SearchBox.module.css'

export default function SearchBox(props) {
  return (
    <>
      <div className={styles.box}>
        <img className={styles.icon} src="src/assets/SearchIcon.svg" alt="searchIcon" />
        {/* {props} */}
        <div className={styles.placeholder}>Search up course</div>
      </div>
    </>
  )
}