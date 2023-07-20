import { useState } from "react";
import "./Term.css";

function Term(props) {
  // const [agreed, setAgreed] = useState(false)

  const agreeHandler = () => {
    // setAgreed(true)
    props.onAgree();
  };

  const cssClasses = [
    "glass-layer",
    props.show === "entering"
      ? "modalOpen"
      : props.show === "exiting"
      ? "modalClose"
      : null,
  ];

  console.log(cssClasses)

  return (
    <>
      <div className="bg-container">
        <div style={{
          // opacity: props.show === "entering" ? 1 : 0,
        }} className={cssClasses.join(' ')}>
          <div className="top-bar">
            <h1 className="termandcondition">
              Terms and
              <br />
              conditions.
            </h1>
            <div className="close-btn">
              <p>
                I agree with <br /> Terms and conditions
              </p>
              <div onClick={agreeHandler} className="agree-btn">
                <div className="unclicked"></div>
                {props.agree ? <div className="clicked"></div> : ""}
              </div>
            </div>
            <div className="line-landscape"></div>
          </div>
          <div className="detail-notes">
            <h2 className="date">
              Date
              <br />
              June 20, 2023
            </h2>
            <div className="line-potrait"></div>
            <div className="term-container">
              <p className="scroll-term">
              1. YOU UNDERSTAND AND AGREE THAT THIS SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT EXPRESS OR IMPLIED WARRANTY OR CONDITION OF ANY KIND. CMKL UNIVERSITY MAKE NO REPRESENTATIONS AND DISCLAIM ANY WARRANTIES OR CONDITIONS OF SATISFACTORY QUALITY, MERCHANTABILITY, OR NON-INFRINGEMENT. CMKL UNIVERSITY MAKE NO WARRANTS THAT THE THIS SERVICE IS FREE OF MALWARE OR OTHER HARMFUL COMPONENTS. IN ADDITION, CMKL UNIVERSITY MAKES NO REPRESENTATION NOR DOES IT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY THIRD-PARTY APPLICATIONS (OR THE CONTENT THEREOF) OR DEVICES.
            NO ADVICE OR INFORMATION WHETHER ORAL OR IN WRITING OBTAINED BY YOU FROM CMKL UNIVERSITY SHALL CREATE ANY WARRANTY ON BEHALF OF CMKL UNIVERSITY. 
<br />
2. You acknowledge that while using this service there might be an unexpected incident or error that might, in result, damage or loss of your data. You must create a backup of your data or any information uploaded to the infrastructure at all time. Incase of any damage or loss of your data, CMKL University has no responsibilities nor duty to compensate you of any damage occurred during using this service.     
Do Expect data loss to happen due to an ongoing configuration process.
<br />
3. You shall have responsible to secure your access, username or password, and shall not share your access, username or password, to any third parties without prior consent from CMKL University. Incase of any data breaches, CMKL University has no responsibilities nor duty to compensate you of any damage occurred from data breaches.      
<br />
4. You acknowledge that after the trial phase ends, your account information and all of your data on the infrastructure WILL BE ERASED from the system. You shall not have right to claim for any compensation from CMKL University. We advise you to backup or download all of your data prior the end of the trial phase. 
<br />
5. The following type of data or information is prohibited and not allow to be upload into the system <br />
5.1 Personal data or any data that might be used to identify individuals. <br />
5.2 Illegal data including but not limited to intellectual property infringement data, sensitive data, violent data, or data that might affect national security.
<br />
CMKL University has right to delete any prohibited data uploaded into the system without prior notice. CMKL University reserved the right to file a lawsuit claiming for compensations from you. You agree to solely responsible for all the information or data uploaded into the system by you if anyone brings a claim against CMKL University. CMKL University is not responsible for any claim against such information or data uploaded by you.
<br />
6. YOU AGREE THAT YOUR SOLE AND EXCLUSIVE REMEDY FOR ANY PROBLEMS OR DISSATISFACTION WITH THIS SERVICE IS TO RETURN THE USERNAME AND PASSWORD TO CMKL UNIVERSITY AND TO STOP USING THIS SERVICE.
<br />
7. You agree to indemnify and hold CMKL University harmless from and against all damages, losses, and expenses of any kind.
              </p>
            </div>
          </div>
        </div>
        <div
          className="backdrop"
          onClick={() => {
            props.toggle();
          }}
        ></div>
      </div>
    </>
  );
}

export default Term;
