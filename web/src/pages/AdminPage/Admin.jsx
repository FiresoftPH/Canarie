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
                <p>Macow</p>
                <p>Admin</p>
              </div>
            </div>
            <div className="navigation">
              <p>Analytics</p>
              <p>Course</p>
              <p>Student</p>
            </div>
            <div className="chat-page">
              <p>Macow Chat</p>
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
                    <p>Macow</p>
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
                  <p>Macaw Chat</p>
                  <p>Chat with Parrot</p>
                </section>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Admin;
