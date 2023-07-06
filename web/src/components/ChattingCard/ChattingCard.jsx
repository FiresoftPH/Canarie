import ParrotIcon from "src/assets/ParrotIcon.svg";
import UserImage from 'src/assets/UserImage.svg';
import LikeIcon from "src/assets/LikeIcon.svg";
import DislikeIcon from "src/assets/DislikeIcon.svg";
import FileIcon from 'src/assets/FileIcon.svg';

const ChattingCard = (props) => {
  if (props.ai) {
    return (
      <div>
        <img src={ParrotIcon} />
        <p>{props.message}</p>
        {props.assignments
          ? props.assignments.map((assignment) => {
              return <p>{assignment.name}</p>;
            })
          : ""}
        <div>
          <img src={LikeIcon} />
          <img src={DislikeIcon} />
        </div>
      </div>
    );
  } else {
    return (
        <div>
            {props.file_attachment ? <img src={FileIcon} /> : ""}
            <p>{props.message}</p>
            <img src={UserImage} />
        </div>
    )
  }
};

export default ChattingCard;
