import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from 'src/pages/LoginPage/Login.jsx'
import Course from 'src/pages/CoursePage/Course.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Login /> */}
    <Course />
  </React.StrictMode>,
)
