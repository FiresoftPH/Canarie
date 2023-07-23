import { Routes, Route, RouterProvider } from "react-router-dom";
import Login from "../src/pages/LoginPage/Login";
import Course from "../src/pages/CoursePage/Course.jsx";
import Term from "../src/pages/TermPage/Term.jsx";
import ChatPage from "../src/pages/ChatPage/ChatPage.jsx";
import Admin from "../src/pages/AdminPage/Admin.jsx";
import AdminCourse from "../src/pages/AdminCoursePage/AdminCourse.jsx";
import { useSelector } from "react-redux";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/RootPage/Root";

/*
REQUIRED DEPENDENCIES:

npm install
npm install react-redux
npm install @reduxjs/toolkit
npm install boxicons --save
npm install js-cookie
npm install --save interactjs
npm install react-transition-group --save
npm install nanoid

*/

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/Term", element: <Term /> },
      { path: "/Course", element: <Course /> },
      { path: "/Chat/:subjectId/:assignmentId", element: <ChatPage /> },
      { path: "/Admin", element: <Admin /> },
      { path: "/AdminCourse", element: <AdminCourse /> },
      // { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  const loggedIn = useSelector((state) => state.login.loggedIn);

  console.log(loggedIn);

  // return (
  //   <>
  //     <RouterProvider router={router} />
  //     {/* <Routes>
  //       {true ? (
  //         <>
  //           <Route path="/" element={<Login />} />
  //           <Route path="/Term" element={<Term />} />
  //           <Route path="/Course" element={<Course />} />
  //           <Route path="/Chat/:subjectId/:assignmentId" element={<ChatPage />}/>
  //           <Route path="/Admin" element={<Admin />} />
  //           <Route path="/AdminCourse" element={<AdminCourse />} />
  //           <Route path="*" element={<ErrorPage />} />
  //         </>
  //       ) : (
  //         <Route path="*" element={<Login />} />
  //       )}
  //     </Routes> */}
  //   </>
  // );

  return <RouterProvider router={router} />
}

export default App;
