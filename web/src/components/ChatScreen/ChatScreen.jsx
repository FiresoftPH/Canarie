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

  console.log(props.history)

  return (
    <>
      <div id="chatScroll" className={styles.wrapper}>
        {props.history.chatHistory.map((message) => {
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
