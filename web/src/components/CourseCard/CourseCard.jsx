import styles from './Coursecard.module.css'
import { Link } from "react-router-dom";

export default function CourseCard(props) {
  const {datas} = props
  const bgProperty = {backgroundSize: '200% 200%'};
  return (
    <>
      {
        datas.map((data) => {
          const cardColor = {background: data.card_color}
          const mergeProperty = {...cardColor, ...bgProperty}
          const store = {
            data: data.competency_code
          };
          const storeToJSON = JSON.stringify(store);
          const onClickHandler = async() => {
            localStorage.setItem('course_code', storeToJSON)
          }
          return (
            <Link to={`/Chat/${data.competency_code}/General`}
                  onClick={onClickHandler}
                  className={styles.card_container} style={mergeProperty}>
              <div className={styles.competency_name}>
                <p className={styles.text_code}>{data.competency_code}</p>
                <p className={styles.text_pillar}>{data.pillar}</p>
                <p className={styles.text}>{data.title}</p>
              </div>
            </Link>
          )
        })
      }
    </>
  );
}
