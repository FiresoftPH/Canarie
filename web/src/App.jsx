import { RouterProvider } from "react-router-dom";
import Login from "../src/pages/LoginPage/Login";
import Course from "../src/pages/CoursePage/Course.jsx";
import Term from "../src/pages/TermPage/Term.jsx";
import ChatPage from "../src/pages/ChatPage/ChatPage.jsx";
import Admin from "../src/pages/AdminPage/Admin.jsx";
import AdminCourse from "../src/pages/AdminCoursePage/AdminCourse.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { useSelector } from "react-redux";
import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/RootPage/Root";
import AdminRoot from "./pages/RootPage/AdminRoot";

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
npm install axios
npm install react-syntax-highlighter --save
npm install highlight.js
npm i --save react-select
npm i lottie-react

*/

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <ErrorPage
        message={"Something went wrong!"}
        back={"/Course"}
        name={"Course"}
      />
    ),
    children: [
      { path: "/", element: <Login /> },
      { path: "/Term", element: <Term /> },
      { path: "/Course", element: <Course /> },
      { path: "/Chat/:subjectId/:assignmentId", element: <ChatPage /> },
      // { path: "*", element: <ErrorPage /> },
    ],
  },
]);

const adminRouter = createBrowserRouter([
  {
    path: "/",
    element: <AdminRoot />,
    errorElement: (
      <ErrorPage
        message={"Something went wrong!"}
        back={"/"}
        name={"Admin Page"}
      />
    ),
    children: [
      { path: "/Admin", element: <Admin /> },
      { path: "/AdminCourse/:pillarName", element: <AdminCourse /> },
      { path: "/AdminCourse", element: <AdminCourse /> },
      { path: "/", element: <Login /> },
      { path: "/Term", element: <Term /> },
      { path: "/Course", element: <Course /> },
      { path: "/Chat/:subjectId/:assignmentId", element: <ChatPage /> },
      // { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  const loggedIn = useSelector((state) => state.login.loggedIn);
  const admin = true;

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

  return <RouterProvider router={admin ? adminRouter : router} />;
}

export default App;
