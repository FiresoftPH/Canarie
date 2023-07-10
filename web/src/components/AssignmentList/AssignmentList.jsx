import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AssignmentCard from "../AssignmentCard/AssignmentCard";
import styles from "./AssignmentList.module.css";

const DUMMY_DATA = [
  { id: "w1", name: "Assignment 1" },
  { id: "w2", name: "Assignment 2" },
  { id: "w3", name: "Assignment 3" },
  { id: "w4", name: "Lab 1" },
  { id: "w5", name: "Lab 2" },
  { id: "w6", name: "Lab 3" },
];

const AssignmentList = (props) => {
  //   const [assignments, setAssignments] = useState(DUMMY_DATA)
  const [selectedAssignment, setSelectedAssignment] = useState(
    DUMMY_DATA[0].id
  );

  const { subjectId } = useParams()
  const nav = useNavigate()

  const assginmentSelectHandler = (id, name) => {
    console.log(id)
    setSelectedAssignment(id)
    props.onSelect(name)

    nav(`../Chat/${subjectId}/${id}`, {
      replace: true,
    });
  }

  return (
    <>
      <div className={styles.assignments}>
        {/* <AssignmentCard pressed name="Thingy" />
        <AssignmentCard name="Thingy2" />
        <AssignmentCard name="Thingy3" /> */}
        {DUMMY_DATA.map((assginment) => {
          let selected = false;
          if (assginment.id === selectedAssignment) {
            selected = true;
          }

          return (
            <AssignmentCard
              pressed={selected}
              onSelect={assginmentSelectHandler}
              name={assginment.name}
              id={assginment.id}
            />
          );
        })}
      </div>
    </>
  );
};

export default AssignmentList;
