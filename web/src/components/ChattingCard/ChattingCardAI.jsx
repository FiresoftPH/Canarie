import styles from "./ChattingCardAI.module.css";

import ParrotIcon from "src/assets/ParrotIcon.svg";
// import UserImage from "src/assets/UserImage.svg";
// import LikeIcon from "src/assets/LikeIcon.svg";
// import DislikeIcon from "src/assets/DislikeIcon.svg";
// import FileIcon from "src/assets/FileIcon.svg";
// import LikeIconFilled from "src/assets/LikeIconFilled.svg";
import { useState } from "react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import detectLanguage from "../../utils/detectLangulage";
import { useRef, useEffect } from "react";
// import CopySuccessfulPopup from "../CopySuccessfulPopup/CopySuccessfulPopup";
import axios from "axios";
// import { detect } from 'program-language-detector';

let poem = "";
const ChattingCardAI = memo(function ChattingCardAI(props) {
  // console.log("ChattingCardAI component is called");
  const wholeDiv = useRef(null);
  // var detectLang = require('lang-detector');
  const [copy, setCopy] = useState("");
  // const usrData = localStorage.getItem("data")
  const usrData = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    const cleanUp = async () => {
      const shakeSpear = await axios
          .post("https://api.canarie.cmkl.ai/ai/shakespeare", {
            username: usrData.username,
            email: usrData.email,
            api_key: usrData.api_key,
          })
          .then((res) => res.data.message)
      setCopy(shakeSpear)
    }
    cleanUp()
  }, [])

  return (
    <div
      className={styles.wrapper}
      ref={wholeDiv}
      onCopy={async (e) => {
        e.preventDefault();

        // setCopy("COPYING")
        // const shakeSpear = await axios
        //   .post("https://api.canarie.cmkl.ai/ai/shakespeare", {
        //     username: usrData.username,
        //     email: usrData.email,
        //     api_key: usrData.api_key,
        //   })
        //   .then((res) => res.data.message)
        //   .then((res) => {
        //     console.log(res);
        //     return res;
        //   });
        // // .then((res) => {
        // //   console.log(res)
        // //   // e.clipboardData.setData("text/plain", res);
        // // });
        // // setCopy("ENDED")

        // console.log(shakeSpear);
        // navigator.clipboard.writeText(shakeSpear);

        // e.clipboardData.setData("text/plain", shakeSpear)

        // e.clipboardData.setData(
        //   "text/plain",
        //   `Hello ${usrData.username}.\nFirst of all, nice try bro.\nSecondly, this act will be notified to the supervisor for this course.\nTry negotiating with them and see how it goes.\n-Sincerely, Canarie`
        // );
        e.clipboardData.setData(
          "text/plain",
          copy
        );
        window.open("https://www.youtube.com/watch?v=6a_PHeYO7OI");
        // setCopy(true);
      }}
    >
      <img src={ParrotIcon} />
      {/* {copy && ( */}
      {/* <CopySuccessfulPopup
        close={() => {
          setCopy(false);
        }}
        copyStatus={copy}
      /> */}
      {/* )} */}
      {/* {props.assignments
        ? props.assignments.map((assignment) => {


            // return <p>{assignment.name}</p>;
          })
        : ""} */}
      <div className={styles.message}>
        <div className={styles.markdown_container}>
          {/* <p>{props.message}</p> */}
          <ReactMarkdown
            children={props.message}
            components={{
              code({ node, inline, className, children, ...props }) {
                // const match = /language-(\w+)/.exec(className || "");
                const match = detectLanguage(children[0]);
                // console.log(match)

                // console.log(match)
                // console.log(inline)
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    children={String(children).replace(/\n$/, "")}
                    style={dark}
                    language={match}
                    PreTag="div"
                    // useInlineStyles={false}
                    // customStyle={{
                    //   fontSize: "1rem"
                    // }}
                    // useInlineStyles={false}
                  />
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          />
          <div className={styles.assignmentList}>
            {props.assignments
              ? props.assignments.map((assignment) => {
                  if (assignment !== undefined) {
                    return (
                      <>
                        <p
                          onClick={() => {
                            props.chooseSubject(assignment.id);
                          }}
                        >
                          {assignment.name}
                        </p>
                        &nbsp;&nbsp;&nbsp;
                      </>
                    );
                  }
                })
              : ""}
          </div>
        </div>
        {/* DON'T DELETE THIS */}
        {/* {props.rating === "none" ? (
          <div className={styles.preference}>
            <img
              onClick={() => {
                props.onRate("good", props.id);
              }}
              className={styles.like}
              src={LikeIcon}
            />
            <img
              onClick={() => {
                props.onRate("bad", props.id);
              }}
              src={DislikeIcon}
            />
          </div>
        ) : props.rating === "good" ? (
          <div className={styles.preferenceSelected}>
            <img className={styles.likeFilled} src={LikeIconFilled} />
          </div>
        ) : (
          <div className={styles.preference}>
            <img src={DislikeIcon} />
          </div>
        )} */}
      </div>
    </div>
  );
});

export default ChattingCardAI;
