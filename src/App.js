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
import ResetPassword from "./components/ResetPassword";

import "./styles/styles.scss";

function App() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentActiveLocation, setCurrentActiveLocation] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [rules, setRules] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [residents, setResidents] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [chosenLocationId, setChosenLocationId] = useState("");
  const [chosenLocationName, setChosenLocationName] = useState("");
  const [LocationDetails, setLocationDetails] = useState([]);
  const [inputsTable, setInputsTable] = useState({
    mobile: true,
    email: true,
    name: true,
    unit: true,
  });
  const [progressBar, setProgressBar] = useState(35);

  const appContext = {
    currentUserId,
    setCurrentUserId,
    currentUserEmail,
    setCurrentUserEmail,
    currentActiveLocation,
    setCurrentActiveLocation,
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
    inputsTable,
    setInputsTable,
    progressBar,
    setProgressBar,
  };

  return (
    <React.Fragment>
      <Auth>
        <Router history={history}>
          <Switch>
            <AppContext.Provider value={appContext}>
              <Route path="/:location/entry" component={Entry} />
              <Route path="/:location/rules" component={Rules} />
              <Route path="/:location/questions" component={Questions} />
              <Route path="/:location/submit" component={Submit} />
              <Route path={"/portal"} component={Portal} />
              <Route path="/login" component={Login} />
              <Route path="/resetpassword" component={ResetPassword} />
              <Route exact path="/" component={Login} />
            </AppContext.Provider>
          </Switch>
        </Router>
      </Auth>
    </React.Fragment>
  );
}

export default App;
