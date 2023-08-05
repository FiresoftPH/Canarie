import { useState } from "react";
import Transition from "react-transition-group/Transition";
import ShortSideBar from "./ShortSideBar";
import LongSidebar from "./LongSidebar";

function Sidebar({ bigDivRef }) {
  const [closev2, setClosev2] = useState(false);

  const toggleClosev2 = (val) => {
    setClosev2(!closev2);

    console.log(closev2)

    if (closev2 == true) {
        bigDivRef.current.style.gridTemplateColumns = "0.55fr 1fr 1fr"
    } else {
        bigDivRef.current.style.gridTemplateColumns = "0.1fr 1fr 1fr"
    }
    // console.log(bigDivRef.current.style.gridTemplateColumns);
  };

  return (
    <>
      <Transition in={closev2} timeout={300} mountOnEnter unmountOnExit>
        {(state) => <ShortSideBar open={toggleClosev2} show={state} />}
      </Transition>
      <Transition in={!closev2} timeout={300} mountOnEnter unmountOnExit>
        {(state) => <LongSidebar close={toggleClosev2} show={state} />}
      </Transition>
    </>
  );
}

export default Sidebar;
