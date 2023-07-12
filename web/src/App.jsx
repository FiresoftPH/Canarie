import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "src/pages/LoginPage/Login.jsx";
import Course from "src/pages/CoursePage/Course.jsx";
import Term from "src/pages/TermPage/Term.jsx";
import ChatPage from "src/pages/ChatPage/ChatPage.jsx";
import Admin from "src/pages/AdminPage/Admin.jsx";
import AdminCourse from "src/pages/AdminCoursePage/AdminCourse.jsx";

/*
REQUIRED DEPENDENCIES:

npm install
npm install react-redux
npm install @reduxjs/toolkit
npm install boxicons --save
npm install js-cookie
*/

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Term" element={<Term/>}/>
        <Route path="/Course" element={<Course/>}/>
        {/* <Route path="/Chat/:subject" element={<Chat/>}/> */}
        <Route path="/Chat/:subjectId/:assignmentId" element={<ChatPage/>}/>
        <Route path="/Admin" element={<Admin />} />
        <Route path="/AdminCourse" element={<AdminCourse />} />
      </Routes>
    </>
  );
}

export default App;
