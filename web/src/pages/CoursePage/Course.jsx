import { useState } from 'react'
import './Course.css'
import CourseCard from 'src/components/CourseCard/CourseCard.jsx'
import SearchBox from 'src/components/SearchBox/SearchBox'

function Course() {
  const [inputbox, setInputbox] = useState('');

  function inputChangeHandler(event) {
    setInputbox(event.target.value);
  }

  return(
    <>
      <div className="bg-container">
          <div className="glass-layer-course">
            <header className="header">
              <p className="title">Enrolled Course</p>
              <SearchBox onInputChange={inputChangeHandler}/>
            </header>
            <header className="user-tab">
              <p className="user-name"> Good <span>morning</span>, <span>Mr/Mrs</span> <span>Username</span></p>
              <div className="user-img"> img </div>
              <div className="dropdown"> V </div>
            </header>
            <div className="course-container">
              <p>{inputbox}</p>
              <CourseCard></CourseCard>
            </div>
          </div>
          <div className="mask">
            <div className="red-circle-course"></div>
            <div className="yellow-circle-course"></div>
          </div>
        </div>
    </>
  )
}

export default Course