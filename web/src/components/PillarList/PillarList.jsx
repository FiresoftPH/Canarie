import styles from "./PillarList.module.css";
import { motion } from "framer-motion";
import { useState } from "react";

function PillarList(props) {
  let pillarList = [
    {
      pillar_name: "Artificial Intelligence Core",
      icon: "src/assets/Artificial Intelligence Core icon.svg",
    },
    {
      pillar_name: "Human-Centered Design",
      icon: "src/assets/Human-Centered Design icon.svg",
    },
    {
      pillar_name: "Scalable Systems",
      icon: "src/assets/Scalable Systems icon.svg",
    },
    { pillar_name: "Cybersecurity", icon: "src/assets/Cybersecurity icon.svg" },
    {
      pillar_name: "Entrepreneurship and Innovation",
      icon: "src/assets/Entrepreneurship and Innovation icon.svg",
    },
    { pillar_name: "Mathematics", icon: "src/assets/Mathematics icon.svg" },
    { pillar_name: "Science", icon: "src/assets/Science icon.svg" },
    {
      pillar_name: "Arts, Humanities and Social Sciences",
      icon: "src/assets/Arts, Humanities and Social Sciences icon.svg",
    },
    {
      pillar_name: "Communications and Presentation",
      icon: "src/assets/Communications and Presentation icon.svg",
    },
  ];

  const [clickedIndex, setClickedIndex] = useState(null);

  const handleClick = (index) => {
    setClickedIndex(index);
  };

  const pillar_output = pillarList.map((pillar, index) => (
    <div
      key={index}
      className={`${styles.pillar_container} ${
        clickedIndex === index ? styles.clicked : ""
      }`}
      onClick={() => handleClick(index)}
    >
      <div className={styles.pillar_icon}>
        <img src={pillar.icon} alt="" />
      </div>
      <div className={styles.pillar_name}>
        <p>{pillar.pillar_name}</p>
      </div>
    </div>
  ));

  return (
    <div className={styles.pillar}>
      <div className={styles.pillar_title}>
        <section className={styles.pillar_list}>{pillar_output}</section>
      </div>
    </div>
  );
}

export default PillarList;
