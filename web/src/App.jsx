import {
  BrowserRouter,
  Routes,
  Route } from 'react-router-dom';
import Login from "src/pages/LoginPage/Login.jsx";
import Course from "src/pages/CoursePage/Course.jsx";
import Term from "src/pages/TermPage/Term.jsx";
import Chat from "src/pages/ChatPage/Chat.jsx";

function App() {
  return(
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Term" element={<Term/>}/>
        <Route path="/Course" element={<Course/>}/>
        <Route path="/Chat" element={<Chat/>}/>
      </Routes>
    </>
  )
}

export default App;