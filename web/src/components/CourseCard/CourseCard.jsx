import styles from './Coursecard.module.css'
import Data from '../../mockDB/MOCK_DATA.json'

export default function CourseCard(props) {
  return (
  <div>
  {
    Data.map((post) => (
      <div key={post.id}>
        <p>{post.first_name} {post.last_name}</p>
      </div>
    ))
  }
  </div>
)}