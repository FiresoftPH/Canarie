import './Course.css'
import CourseCard from 'src/components/CourseCard/CourseCard.jsx'
import SearchBox from 'src/components/SearchBox/SearchBox'

function Course() {

  return(
    <>
      <div className="bg-container">
          <div className="glass-layer-course">
            <header className="header">
              <p className="title">Enrolled Course</p>
              <SearchBox></SearchBox>
            </header>
            <header className="user-tab">
              <p className="user-name"> Good <span>morning</span>, <span>Mr/Mrs</span> <span>Username</span></p>
              <div className="user-img"> img </div>
              <div className="dropdown"> V </div>
            </header>
            <div className="course-container">
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