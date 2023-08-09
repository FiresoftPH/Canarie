import { useState } from "react";
import Analytics from "../../components/AdminComponents/Analytics";
import Feedback from "../../components/AdminComponents/Feedback";
import HelloCard from "../../components/AdminComponents/HelloCard";
import QuickActions from "../../components/AdminComponents/QuickActions";
import Status from "../../components/AdminComponents/Status";
import CompentenciesStats from '../../components/AdminComponents/CompentenciesStats';
import "./Admin.css";

function Admin() {
  return (
    <>
      <div className="content-below">
        {/* <div className="profile-cover">
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
        </div> */}
        <HelloCard />
        {/* <div className="user-online">
          <section className="user-online-title">
            <img src="src/assets/Online icon.svg" />
            <p>Online</p>
          </section>
          <section className="user-online-list">
            <p>$num</p>
            <p> &nbsp;Users</p>
          </section>
        </div> */}
        <Status />
        {/* <div className="nav-app">
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
        </div> */}
        <QuickActions />
        {/* <div className="feedback-dash">
          <div className="feedback-dash-bar">
            <img src="src/assets/Feedback icon.svg" />
            <section className="feedback-text">
              <p>Feedback</p>
              <p>Performance of the AI model</p>
            </section>
          </div>
        </div> */}
        <Feedback />
        {/* <div className="analytics-dash">
          <div className="analytics-dash-bar">
            <img src="src/assets/Analytics icon.svg" />
            <section className="analytics-text">
              <p>Analytics</p>
              <p>Total</p>
            </section>
          </div>
        </div> */}
        <Analytics />
        {/* <div className="competencies-rank">
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
        </div> */}
        <CompentenciesStats />
      </div>
      {/* </div>
      </div> */}
    </>
  );
}
export default Admin;
