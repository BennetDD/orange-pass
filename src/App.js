import React, { useState } from "react";
import { AppContext } from "./AppContext";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import Auth from "./Auth";
import PrivateRoute from "./PrivateRoute";

import Entry from "./components/Entry";
import Login from "./components/Login";
import Portal from "./components/portal/Portal";
import Rules from "./components/Rules";
import Questions from "./components/Questions";
import Submit from "./components/Submit";

import "./styles/styles.scss";

function App() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [rules, setRules] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [residents, setResidents] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [chosenLocationId, setChosenLocationId] = useState("");
  const [chosenLocationName, setChosenLocationName] = useState("");
  const [LocationDetails, setLocationDetails] = useState([]);

  const appContext = {
    currentUserId,
    setCurrentUserId,
    currentUserEmail,
    setCurrentUserEmail,
    locationData,
    setLocationData,
    rules,
    setRules,
    questions,
    setQuestions,
    residents,
    setResidents,
    inputs,
    setInputs,
    chosenLocationId,
    setChosenLocationId,
    chosenLocationName,
    setChosenLocationName,
    LocationDetails,
    setLocationDetails,
  };

  return (
    <React.Fragment>
      <Auth>
        <Router history={history}>
          <Switch>
            <AppContext.Provider value={appContext}>
              <Route path="/entry" component={Entry} />
              <Route path="/rules" component={Rules} />
              <Route path="/questions" component={Questions} />
              <Route path="/submit" component={Submit} />
              <Route path={"/portal"} component={Portal} />
              <Route exact path="/" component={Login} />
              <Route path="/login" component={Login} />
            </AppContext.Provider>
          </Switch>
        </Router>
      </Auth>
    </React.Fragment>
  );
}

export default App;
