import ChattingCardAI from "../ChattingCard/ChattingCardAI";
import ChattingCardUser from "../ChattingCard/ChattingCardUser";
import styles from "./ChatScreen.module.css";

const ChatScreen = (props) => {
  return (
    <>
      <div className={styles.wrapper}>
        {props.history.map((message) => {
            if (message.sender === "ai") {
                return <ChattingCardAI message={message.message} />
            }

            return <ChattingCardUser message={message.message} file_attachment />
        })}
      </div>
    </>
  );
};

export default ChatScreen;
