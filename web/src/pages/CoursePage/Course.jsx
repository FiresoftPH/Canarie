import { useState, useEffect } from 'react'
import styles from './Course.module.css'
import CourseList from 'src/components/CourseList/CourseList.jsx'
import SearchBox from 'src/components/SearchBox/SearchBox'
import Data from '../../mockDB/MOCK_DATA.json'

function Course() {
  const [inputbox, setInputbox] = useState('');

  function inputChangeHandler(event) {
    setInputbox(event.target.value);
  }


  const headerValue = Data.enrolled_courses;
  
  console.log(Data.map((txt)=> txt.enrolled_courses))

  const separatedValues = Data.map((txt)=> txt.enrolled_courses.split(', '));
  console.log(separatedValues.map((value)=> value))


  const filterkeys = ["enrolled_courses"]

  const search = (data) =>{
    return data.filter((item)=> filterkeys.some((key) => item[key].toLowerCase().includes(inputbox.toLowerCase()))
    );
  }

  return(
    <>
      <div className={styles.bg_container}>
        <div className={styles.glass_layer_course}>
          <header className={styles.header}>
            <p className={styles.title}>Enrolled Course</p>
            <SearchBox onInputChange={inputChangeHandler}/>
          </header>
          <header className={styles.userdropdown}>
            <p className={styles.username}> Good <span>morning</span>, <span>Mr/Mrs</span> <span>Username</span></p>
            <div className={styles.user_img}> img </div>
            <div className={styles.dropdown}> V </div>
          </header>
          <CourseList displayData={search(Data)}/>
        </div>
        <div className={styles.mask}>
          <div className={styles.red_circle_course}></div>
          <div className={styles.yellow_circle_course}></div>
        </div>
      </div>
    </>
  )
}

export default Course