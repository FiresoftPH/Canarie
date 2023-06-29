import styles from './Coursecard.module.css'


export default function CourseCard(props) {
  return (
  <div>
  {
    props.data.map((post) => (
      <div key={post.id}>
        <p>{post.first_name} {post.last_name}</p>
      </div>
    ))
  }
  </div>
)}