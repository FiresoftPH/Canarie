import { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Course.module.css";
import CourseList from "src/components/CourseList/CourseList.jsx";
import SearchBox from "src/components/SearchBox/SearchBox";
import { userActions } from "../../store/userSlice";
import "boxicons";
import { useNavigate } from "react-router-dom";
import user_with_suit from '../../assets/user-with-suit.jpeg'
import { loginAction } from "../../store/loginSlice";
import { bigDataAction } from "../../store/bigDataSlice";

function Course() {
  // Demo data set to user store (Logic will be added at login page)
  const dispatch = useDispatch();
  const nav = useNavigate();
  const name = JSON.parse(localStorage.getItem("data")).username
  const courses = JSON.parse(localStorage.getItem("data")).courses
  const user = useSelector((state) => state.user);
  const history = useSelector(state => state.bigData)

  const [inputbox, setInputbox] = useState("");
  const [greet, setGreet] = useState("")

  function inputChangeHandler(event) {
    setInputbox(event.target.value);
  }

  const search = (query, data) => {
    if (!query) {
      return data;
    }
    if (Array.isArray(data)) {
      return data.filter((item) => search(query, item));
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).some(([key, value]) => {
        return search(query, value)
      })
    }
    return String(data).toLowerCase().includes(inputbox.toLowerCase());
  };

  const filteredSearch = search(inputbox, courses)

  useEffect(() => {
    const hour = new Date().getHours()
    setGreet(`${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}`)
    // console.log(courses)
    dispatch(bigDataAction.setHistory(courses.map(course => course.competency_code)))
    // console.log(history)
  }, [])
  return (
    <>
      <div className={styles.bg_container}>
        <div className={styles.glass_layer_course}>
          <header className={styles.header_topleft}>
            <p className={styles.title}>Competencies</p>
            <SearchBox onInputChange={inputChangeHandler} />
          </header>
          <header className={styles.header_topright}>
            <p className={styles.username}>
              Good {greet},<br />{name}
            </p>
            <div className={styles.user_img}> <img src={user_with_suit} /> </div>
            <box-icon color="white"
                      size="3rem"
                      name="log-out"
                      onClick={() => {
                        dispatch(userActions.logout());
                        dispatch(loginAction.setLoggedIn(false))
                        localStorage.clear()
                        nav("/");
                      }}
                      className={styles.dropdown}></box-icon>
          </header>
          <CourseList displayData={filteredSearch} />
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
