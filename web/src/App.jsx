import { Routes, Route } from "react-router-dom";
import Login from "../src/pages/LoginPage/Login";
import Course from "../src/pages/CoursePage/Course.jsx";
import Term from "../src/pages/TermPage/Term.jsx";
import ChatPage from "../src/pages/ChatPage/ChatPage.jsx";
import Admin from "../src/pages/AdminPage/Admin.jsx";
import AdminCourse from "../src/pages/AdminCoursePage/AdminCourse.jsx";
import { useSelector } from "react-redux";

/*
REQUIRED DEPENDENCIES:

npm install
npm install react-redux
npm install @reduxjs/toolkit
npm install boxicons --save
npm install js-cookie
*/

function App() {
  const loggedIn = useSelector((state) => state.login.loggedIn);

  console.log(loggedIn)

  return (
    <>
      <Routes>
        {loggedIn ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/Term" element={<Term />} />
            <Route path="/Course" element={<Course />} />
            {/* <Route path="/Chat/:subject" element={<Chat/>}/> */}
            <Route
              path="/Chat/:subjectId/:assignmentId"
              element={<ChatPage />}
            />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/AdminCourse" element={<AdminCourse />} />
          </>
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </>
  );
}

export default App;
