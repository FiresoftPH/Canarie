import styles from "./CompentenciesStats.module.css";
import AnalyticsIcon from "../../assets/Analytics icon.svg";
import SortIcon from "../../assets/Sort icon.svg";
import CompotencyCard from "./CompotencyCard";
import CompotencyRankCard from "./CompotencyRankCard";

const DUMMY_RANKS_DATA = [
  {
    code: "AIC-207",
    name: "Discrete Mathematics",
    rating: "GOOD",
    ranking: "#1",
  },
  {
    code: "AIC-208",
    name: "Discrete Mathematics 2",
    rating: "GOOD",
    ranking: "#2",
  },
  {
    code: "AIC-209",
    name: "Discrete Mathematics 3",
    rating: "BAD",
    ranking: "#3",
  },
  {
    code: "AIC-210",
    name: "Discrete Mathematics 4",
    rating: "GOOD",
    ranking: "#4",
  },
  {
    code: "AIC-212",
    name: "Discrete Mathematics 5",
    rating: "GOOD",
    ranking: "#5",
  },
  {
    code: "AIC-213",
    name: "Discrete Mathematics 6",
    rating: "BAD",
    ranking: "#6",
  },
  {
    code: "AIC-209",
    name: "Discrete Mathematics 3",
    rating: "BAD",
    ranking: "#7",
  },
  {
    code: "AIC-210",
    name: "Discrete Mathematics 4",
    rating: "GOOD",
    ranking: "#8",
  },
  {
    code: "AIC-212",
    name: "Discrete Mathematics 5",
    rating: "GOOD",
    ranking: "#9",
  },
  {
    code: "AIC-213",
    name: "Discrete Mathematics 6",
    rating: "BAD",
    ranking: "#10",
  },
  {
    code: "AIC-210",
    name: "Discrete Mathematics 4",
    rating: "GOOD",
    ranking: "#11",
  },
  {
    code: "AIC-212",
    name: "Discrete Mathematics 5",
    rating: "GOOD",
    ranking: "#12",
  },
  {
    code: "AIC-213",
    name: "Discrete Mathematics 6",
    rating: "BAD",
    ranking: "#13",
  },
];

const ConpentenciesStats = () => {
//   console.log(DUMMY_RANKS_DATA.slice(3))

  return (
    <>
      <div className={styles.competencies_rank}>
        <div className={styles.competencies_rank_bar}>
          <section className={styles.competencies_rank_title_left}>
            <img src={AnalyticsIcon} />
            <section className={styles.competencies_rank_left_text}>
              <p>Compentencies</p>
              <p>Stats</p>
            </section>
          </section>
          <section className={styles.competencies_rank_title_right}>
            <section className={styles.competencies_rank_right_text}>
              <p>Most Engaged Competency Rank</p>
            </section>
            <img src={SortIcon} />
          </section>
        </div>
        <div className={styles.competencies_rank_list}>
          {DUMMY_RANKS_DATA.splice(0, 3).map((c) => (
            <CompotencyCard
              code={c.code}
              name={c.name}
              rating={c.rating}
              ranking={c.ranking}
            />
          ))}
        </div>
        <div className={styles.competencies_rankings}>
          {DUMMY_RANKS_DATA.map((c) => (
            <CompotencyRankCard ranking={c.ranking} name={c.name} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ConpentenciesStats;
