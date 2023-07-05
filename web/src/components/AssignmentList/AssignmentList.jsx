import { useState } from "react";
import AssignmentCard from "../AssignmentCard/AssignmentCard";
import styles from "./AssignmentList.module.css";

const DUMMY_DATA = [
  { id: 1, name: "Assignment 1" },
  { id: 2, name: "Assignment 2" },
  { id: 3, name: "Lab 1" },
];

const AssignmentList = (props) => {
  //   const [assignments, setAssignments] = useState(DUMMY_DATA)
  const [selectedAssignment, setSelectedAssignment] = useState(
    DUMMY_DATA[0].id
  );

  const assginmentSelectHandler = (id) => {
    console.log(id)
    setSelectedAssignment(id)
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
