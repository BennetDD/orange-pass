import React, { useState, useCallback, useContext, useEffect } from "react";
import { auth, db } from "../../fb config/firebase";
import history from "../../history";
import { AppContext } from "../../AppContext";

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

  const { currentUserId } = useContext(AppContext);

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

  return (
    <React.Fragment>
      <div className="nav-container">
        <h3 onClick={() => toggleComponent("locations")}>Locations</h3>
        <h3 onClick={() => toggleComponent("residents")}>Residents</h3>
        <h3 onClick={() => toggleComponent("rules")}>Rules</h3>
        <h3 onClick={() => toggleComponent("questions")}>Questions</h3>
        <h3 onClick={() => logout()}>LogOut</h3>
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
