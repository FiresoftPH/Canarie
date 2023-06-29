import styles from './Coursecard.module.css'


export default function CourseCard(props) {
  return (
  <div>
  {
    props.data.map((post) => (
      <div key={post.id}>
        <p>{post.course_name1} {post.course_name2} {post.course_name3}</p>
      </div>
    ))
  }
  </div>
)}