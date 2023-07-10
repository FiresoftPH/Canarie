import ChattingCardAI from "../ChattingCard/ChattingCardAI";
import ChattingCardUser from "../ChattingCard/ChattingCardUser";
import styles from "./ChatScreen.module.css";

const ChatScreen = (props) => {
  if (props.history == undefined) {
    return <div className={styles.wrapper}></div>;
  }

  const ratingHandler = (rate, id) => {
    props.onRate(rate, id)
  };

  return (
    <>
      <div className={styles.wrapper}>
        {props.history.map((message) => {
          if (message.sender === "ai") {
            return (
              <ChattingCardAI
                onRate={ratingHandler}
                rating={message.rating}
                message={message.message}
                id={message.id}
              />
            );
          }

          return <ChattingCardUser message={message.message} file_attachment />;
        })}
      </div>
    </>
  );
};

export default ChatScreen;
