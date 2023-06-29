import { useState } from "react";
import "./Chat.css";
import SearchBox from "src/components/SearchBox/SearchBox";

function Chat() {
  return (
    <>
      <div className="container">
        <div className="sidebar-top">
          <img src="src/assets/Back Button.svg" />
          <section className="macow-chat">
            <p>Macaw Chat</p>
            <img src="src/assets/Collapse.svg" />
          </section>
          <section className="new-chat">
            <img src="src/assets/New button.svg" />
            <p>New Chat</p>
          </section>
          <section className="file-uploaded">
            <p>File-Uploaded</p>
            <img src="src/assets/Upload.svg" />
          </section>
          <section className="file-status">No files added</section>
        </div>
        <div className="sidebar-below">
          <section className="Header">
            <h3>Course</h3>
            <h3>Discrete Mathematics</h3>
          </section>
          <section className="assignment"># Assignments</section>
          <section className="general"># General</section>
        </div>

        <section className="chat"></section>
        <section className="ide"></section>
        <section className="output"></section>
      </div>
    </>
  );
}

export default Chat;
