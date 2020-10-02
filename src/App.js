import React, { useState } from "react";
import { AppContext } from "./AppContext";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import Auth from "./Auth";
import PrivateRoute from "./PrivateRoute";

import Pass from "./components/Pass";
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
  const [returnUser, setReturnUser] = useState(false);
  const [returnUserData, setReturnUserData] = useState([]);

  const appContext = {
    currentUserId,
    setCurrentUserId,
    currentUserEmail,
    setCurrentUserEmail,
    currentActiveLocation,
    setCurrentActiveLocation,
    locationData,
    setLocationData,
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
    returnUser,
    setReturnUser,
    returnUserData,
    setReturnUserData,
  };

  return (
    <React.Fragment>
      <Auth>
        <Router history={history}>
          <Switch>
            <AppContext.Provider value={appContext}>
              <Route path={"/portal"} component={Portal} />
              <Route path="/:location/pass" component={Pass} />
              <Route path="/:location/rules" component={Rules} />
              <Route path="/:location/questions" component={Questions} />
              <Route path="/:location/submit" component={Submit} />
              <Route path="/login" component={Login} />
              <Route path="/resetpassword" component={ResetPassword} />
            </AppContext.Provider>
          </Switch>
        </Router>
      </Auth>
    </React.Fragment>
  );
}

export default App;
