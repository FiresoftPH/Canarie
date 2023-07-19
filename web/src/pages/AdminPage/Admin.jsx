import { useState } from "react";
import "./Admin.css";

function Admin() {
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
                <p>Parrot</p>
                <p>Admin</p>
              </div>
            </div>
            <div className="navigation">
              <p>Analytics</p>
              <a style={{ textDecoration: "none" }} href="/AdminCourse">
                Courses
              </a>
              <a style={{ textDecoration: "none" }} href="/">
                Student
              </a>
            </div>
            <div className="chat-page">
              <p>Parrot Chat</p>
              <img src="src/assets/Linkto.svg" />
            </div>
          </div>
          <div className="content-below">
            <div className="profile-cover">
              <div className="profile">
                <section className="profile-pic"></section>
                <section className="info-text">
                  <div className="username">
                    <p>Hi,Admin User</p>
                    <p>Blank</p>
                    <p>Parrot</p>
                  </div>
                </section>
              </div>
            </div>
            <div className="user-online">
              <section className="user-online-title">
                <img src="src/assets/Online icon.svg" />
                <p>Online</p>
              </section>
              <section className="user-online-list">
                <p>$num</p>
                <p> &nbsp;Users</p>
              </section>
            </div>
            <div className="nav-app">
              <section className="macaw-nav">
                <section className="nav-app-macaw-icon">
                  <img src="src/assets/Macaw-admin-nav-icon.svg" />
                </section>
                <section className="nav-app-macaw-text">
                  <p>Parrot Chat</p>
                  <p>Chat with Parrot</p>
                </section>
              </section>
              <section className="horizontal-line"></section>
              <section className="course-nav">
                <section className="nav-app-Course-icon">
                  <img src="src/assets/Course-admin-nav-icon.svg" />
                </section>
                <section className="nav-app-Course-text">
                  <p>Course</p>
                  <p>
                    See the insight in <br />
                    each Compentencies
                  </p>
                </section>
              </section>
              <section className="horizontal-line"></section>
              <section className="Student-nav">
                <section className="nav-app-Student-icon">
                  <img src="src/assets/Student-admin-nav-icon.svg" />
                </section>
                <section className="nav-app-Student-text">
                  <p>Student</p>
                  <p>
                    See the Activity <br />
                    and Chatlog
                  </p>
                </section>
              </section>
              <section className="horizontal-line"></section>
            </div>
            <div className="feedback-dash">
              <div className="feedback-dash-bar">
                <img src="src/assets/Feedback icon.svg" />
                <section className="feedback-text">
                  <p>Feedback</p>
                  <p>Performance of the AI model</p>
                </section>
              </div>
            </div>
            <div className="analytics-dash">
              <div className="analytics-dash-bar">
                <img src="src/assets/Analytics icon.svg" />
                <section className="analytics-text">
                  <p>Analytics</p>
                  <p>Total</p>
                </section>
              </div>
            </div>
            <div className="competencies-rank">
              <div className="competencies-rank-bar">
                <section className="competencies-rank-title-left">
                  <img src="src/assets/Analytics icon.svg" />
                  <section className="competencies-rank-left-text">
                    <p>Compentencies</p>
                    <p>Stats</p>
                  </section>
                </section>
                <section className="competencies-rank-title-right">
                  <section className="competencies-rank-right-text">
                    <p>Most Engaged Competency Rank</p>
                  </section>
                  <img src="src/assets/Sort icon.svg" />
                </section>
              </div>
              <div className="competencies-rank-list">
                <p>Compentencies rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Admin;
