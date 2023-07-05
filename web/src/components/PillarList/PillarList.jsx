import styles from "./PillarList.module.css";

function PillarList(props) {
  const pillarList = [
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

  const pillar_output = pillarList.map((pillar) => (
    <div className="pillar-container">
      <div className="pillar-icon">
        <img src={pillar.icon} />
      </div>
      <div className="pillar-name">
        <p>{pillar.pillar_name}</p>
      </div>
    </div>
  ));

  return (
    <div className={styles.pillar}>
      <div className={styles.pillar_title}>
        <section className={styles.pillar_list}>
          {pillar_output.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default PillarList;
