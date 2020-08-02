import React, { useState } from "react";
import { auth } from "../../fb config/firebase";
import history from "../../history";

import Locations from "./Locations";
import Residents from "./Residents";
import RulesEdit from "./RulesEdit";
import QuestionsEdit from "./QuestionsEdit";

import "../../styles/components/portal.scss";

export default function Portal() {
  const [locations, setLocations] = useState(true);
  const [residents, setResident] = useState(false);
  const [rules, setRules] = useState(false);
  const [questions, setQuestions] = useState(false);

  const toggleComponent = (component) => {
    if (component === "locations") {
      setLocations(true);
      setResident(false);
      setRules(false);
      setQuestions(false);
    } else if (component === "residents") {
      setLocations(false);
      setResident(true);
      setRules(false);
      setQuestions(false);
    } else if (component === "rules") {
      setLocations(false);
      setResident(false);
      setRules(true);
      setQuestions(false);
    } else {
      setLocations(false);
      setResident(false);
      setRules(false);
      setQuestions(true);
    }
  };

  const logout = () => {
    auth.signOut();
    history.push("/login");
  };

  const activeNav = {
    borderBottom: "2px solid #f66d51",
    color: "#f66d51",
  };

  return (
    <React.Fragment>
      <div className="nav-container">
        <p
          style={locations ? activeNav : null}
          onClick={() => {
            toggleComponent("locations");
          }}
        >
          Locations
        </p>

        <p
          style={residents ? activeNav : null}
          onClick={() => toggleComponent("residents")}
        >
          Residents
        </p>
        <p
          style={rules ? activeNav : null}
          onClick={() => toggleComponent("rules")}
        >
          Rules
        </p>
        <p
          style={questions ? activeNav : null}
          onClick={() => toggleComponent("questions")}
        >
          Questions
        </p>
        <p onClick={() => logout()}>LogOut</p>
      </div>

      <div className="portal-container">
        {locations ? <Locations /> : null}
        {residents ? <Residents /> : null}
        {rules ? <RulesEdit /> : null}
        {questions ? <QuestionsEdit /> : null}
      </div>
    </React.Fragment>
  );
}
