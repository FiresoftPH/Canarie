import styles from './Coursecard.module.css'


export default function CourseCard(props) {
  return (
    <>
      {
        props.data.map((post) => (
          <div className={styles.container} key={post.id}>
            <p className={styles.text}>{post.course_name1}</p>
          </div>
        ))
      }
    </>

)}