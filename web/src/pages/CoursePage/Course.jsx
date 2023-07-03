import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Course.module.css";
import CourseList from "src/components/CourseList/CourseList.jsx";
import SearchBox from "src/components/SearchBox/SearchBox";
import Data from "../../mockDB/MOCK_DATA.json";
import { userActions } from "../../store/userSlice";
import 'boxicons';
import { useNavigate } from "react-router-dom";

function Course() {
  // Demo data set to user store (Logic will be added at login page)
  const dispatch = useDispatch();
  const nav = useNavigate()

  const courses = useSelector((state) => state.user.courses);
  const user = useSelector((state) => state.user);

  const [inputbox, setInputbox] = useState("");

  function inputChangeHandler(event) {
    setInputbox(event.target.value);
  }

  // console.log(Data.map((txt) => txt.enrolled_courses));

  const separatedValues = Data.map((txt) => txt.enrolled_courses.split(", "));
  // console.log(separatedValues.map((value) => value));

  const filterkeys = ["enrolled_courses"];

  const search = (data) => {
    return data.filter((item) =>
      item.toLowerCase().includes(inputbox.toLowerCase())
    );
  };

  const headerValue = Data.enrolled_courses;

  return (
    <>
      <div className={styles.bg_container}>
        <div className={styles.glass_layer_course}>
          <header className={styles.header}>
            <p className={styles.title}>Enrolled Course</p>
            <SearchBox onInputChange={inputChangeHandler} />
          </header>
          <header className={styles.userdropdown}>
            <p className={styles.username}>
              {" "}
              Good <span>morning</span>, <span>Mr/Mrs</span>{" "}
              <span>Username</span>
            </p>
            <div className={styles.user_img}> img </div>
            {"  "}
            <div onClick={() => {
              dispatch(userActions.logout())
              nav("/")
            }} className={styles.dropdown}>
            <box-icon color="white" size="3rem" name='log-out'></box-icon>
            </div>
          </header>
          <CourseList displayData={search(courses)} />
          <h1>{JSON.stringify(user)}</h1>
        </div>
        <div className={styles.mask}>
          <div className={styles.red_circle_course}></div>
          <div className={styles.yellow_circle_course}></div>
        </div>
      </div>
    </>
  );
}

export default Course;
