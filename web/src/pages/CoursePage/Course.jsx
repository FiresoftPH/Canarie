import { useState } from 'react'
import './Course.css'
import CourseCard from 'src/components/CourseCard/CourseCard.jsx'
import SearchBox from 'src/components/SearchBox/SearchBox'
import Data from '../../mockDB/MOCK_DATA.json'

function Course() {
  const [inputbox, setInputbox] = useState('');

  function inputChangeHandler(event) {
    setInputbox(event.target.value);
  }

  const filterkeys = ["course_name1", "course_name2", "course_name3"]

  const search = (data) =>{
    return data.filter((item)=> filterkeys.some((key) => item[key].toLowerCase().includes(inputbox.toLowerCase()))
    );
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
            <CourseCard data={search(Data)}/>
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