import { useState } from "react";
import "./AdminCourse.css";
import { Link } from "react-router-dom";
import PillarList from "src/components/PillarList/PillarList.jsx";

function AdminCourse() {
  return (
    <>
      <div className="background-admin">
        <div className="mask-A">
          <div className="red-circle-A"></div>
          <div className="yellow-circle-A"></div>
          <div className="red-circle-B"></div>
          <div className="yellow-circle-B"></div>
        </div>
        <div className="container-admin">
          <div className="nav-bar">
            <div className="logo-admin">
              <img src="src/assets/Logo.svg" />
              <div className="name-admin">
                <p>Macow</p>
                <p>Admin</p>
              </div>
            </div>
            <div className="navigation">
              <a style={{ textDecoration: "none" }} href="/admin">
                Analytics
              </a>
              <p>Courses</p>
              <a style={{ textDecoration: "none" }} href="/">
                Student
              </a>
            </div>
            <div className="chat-page">
              <p>Macow Chat</p>
              <img src="src/assets/Linkto.svg" />
            </div>
          </div>
          <div className="course-content">
            <div className="course-pillar">
              <div className="course-pillar-title">
                <p>Courses</p>
                <p>All courses</p>
              </div>
              <section className="line"></section>
              <PillarList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminCourse;