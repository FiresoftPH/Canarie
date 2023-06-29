import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from 'src/pages/LoginPage/Login.jsx'
import Course from 'src/pages/CoursePage/Course.jsx'
import Term from 'src/pages/TermPage/Term.jsx'
import './index.css'
import { useMediaQuery } from 'react-responsive'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Login /> */}
    <Term />
    {/* <Course /> */}
  </React.StrictMode>,
)
