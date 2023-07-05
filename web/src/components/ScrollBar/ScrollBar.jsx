import styles from "./ScrollBar.module.css";

const ScrollBar = (props) => {
  return <div className={styles.wrapper}>{props.children}</div>;
};

export default ScrollBar;
