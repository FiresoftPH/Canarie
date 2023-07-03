import styles from './Sidebar.module.css'
import SearchBox from 'src/components/SearchBox/SearchBox'

function Sidebar() {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar_top}>
        <div className={styles.top}>
          <img src="src/assets/Back Button.svg" />
          <p>Macaw Chat</p>
          <img src="src/assets/Collapse.svg" />
          <SearchBox />
        </div>
        <section className={styles.new_chat}>
          <img src="src/assets/New button.svg" />
          <p>New Chat</p>
        </section>
        <section className={styles.file_uploaded}>
          <p>File-Uploaded</p>
          <img src="src/assets/Upload.svg" />
        </section>
        <section className={styles.file_status}>No files added yet!</section>
      </div>
      <div className={styles.sidebar_below}>
        <section className={styles.Header}>
          <h3>Course</h3>
          <h3>Discrete Mathematics</h3>
        </section>
        <section className={styles.assignment}># Assignments</section>
        <section className={styles.general}># General</section>
      </div>
    </div>
  )
}

export default Sidebar