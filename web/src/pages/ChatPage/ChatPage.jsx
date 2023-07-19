import { useState, useCallback, useEffect } from "react";
import styles from "./ChatPage.module.css";
import LongSidebar from "src/components/Sidebar/LongSidebar";
import ShortSideBar from "../../components/Sidebar/ShortSideBar";
import { useParams } from "react-router-dom";
import ChatUI from "../../components/ChatUI/ChatUI";
import { useDispatch, useSelector } from "react-redux";
import { bigDataAction } from "../../store/bigDataSlice";
import IDE from "../../components/IDE/IDE";
import MinimizeIcon from "../../assets/MinimizeIcon.svg";
import Transition from "react-transition-group/Transition";

function Dimension(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginLeft"]) + parseFloat(styles["marginRight"]);

  return el.offsetWidth + margin;
}

function Dimension2(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return el.offsetHeight + margin;
}

function Chat() {
  const [close, setClose] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const [mode, setMode] = useState("General");

  const fileId = useSelector((state) => state.chat.fid);
  const { subjectId, assignmentId } = useParams();
  const dispatch = useDispatch();

  // const codeData = useSelector(state => state.chat.code)

  useEffect(() => {
    setTimeout(() => {
      const getWidth =
        window.innerWidth - Dimension(document.getElementById("total"));

      const getHeight =
        window.innerHeight - Dimension2(document.getElementById("coding"));
      setWidth(getWidth);
      setHeight(getHeight);
    }, 100);
  }, []);

  const toggleClose = (val) => {
    setClose((state) => {
      return !state;
    });

    setTimeout(() => {
      const getWidth =
        window.innerWidth - Dimension(document.getElementById("total"));

      const getHeight =
        window.innerHeight - Dimension2(document.getElementById("coding"));
      setWidth(getWidth);
      setHeight(getHeight);
    }, 100);
  };

  const codeData = useSelector((state) => state.chat.code);
  const fid = useSelector((state) => state.chat.fid);

  useEffect(() => {
    setCode(codeData);
  }, [codeData, fid]);

  const [mouseDown, setMouseDown] = useState(false);
  const [mousePos, setMousePos] = useState({});
  const [ideDimention, setIdeDimention] = useState({ x: "10rem", y: "20rem" });

  useEffect(() => {
    if (mouseDown == false) {
      return;
    }

    console.log(window.innerHeight - mousePos.y);
    setIdeDimention({ y: window.innerHeight - mousePos.y + 10 });
    console.log(mousePos);
  }, [mousePos]);

  let interv;
  const resizeY = (e) => {
    console.log(e.clientY);
  };

  // IDE stuff //
  return (
    // <div className={`styles.bg_container ` + (close ? "close" : "open")}>
    <div
      className={`${styles.bg_container} ${close ? styles.close : styles.open}`}
    >
      <Transition in={close} timeout={300} mountOnEnter unmountOnExit>
        {(state) => <ShortSideBar open={toggleClose} show={state} />}
      </Transition>
      <Transition in={!close} timeout={300} mountOnEnter unmountOnExit>
        {(state) => (
          <LongSidebar
            onSelectMode={(id) => {
              setMode(id);
              console.log("ID: ", id);
            }}
            close={toggleClose}
            show={state}
          />
        )}
      </Transition>
      {/* {close ? (
        <ShortSideBar open={toggleClose} />
      ) : (
        <LongSidebar
          onSelectMode={(id) => {
            setMode(id);
            console.log("ID: ", id);
          }}
          close={toggleClose}
        />
      )} */}
      <div className={styles.leftSide}>
        <section id="ChatUI" className={styles.chat}>
          <ChatUI mode={mode} height={height} width={width} />
        </section>
        <IDE />
      </div>
    </div>
  );
}

export default Chat;
