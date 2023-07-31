import { useEffect } from 'react';
import styles from './Coursecard.module.css'
import { Link } from "react-router-dom";

export default function CourseCard(props) {
  const {data} = props
  const bgProperty = {backgroundSize: '200% 200%'};
  return (
    <>
      {
        data.map((post, index) => {
          const cardColor = {background: post.card_color}
          const mergeProperty = {...cardColor, ...bgProperty}
          const store = {
            key: index, data: post.competency_code
          };
          const storeToJSON = JSON.stringify(store);
          const onClickHandler = async() => {
            localStorage.setItem('course_code', storeToJSON)
          }
          return (
            <Link to={`/Chat/${post.competency_code}/General`}
                  onClick={onClickHandler}
                  className={styles.card_container} style={mergeProperty}>
              <div key={index} className={styles.competency_name}>
                <p className={styles.text_code}>{post.competency_code}</p>
                <p className={styles.text_pillar}>{post.pillar}</p>
                <p className={styles.text}>{post.title}</p>
              </div>
            </Link>
          )
        })
      }
    </>
)}