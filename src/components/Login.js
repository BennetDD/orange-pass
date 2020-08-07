import React, { useContext, useState } from "react";
import { auth, db } from "../fb config/firebase";
import { AppContext } from "../AppContext";
import history from "../history";
import logo from "../assets/OrangePass-Logo.png";

import "../styles/components/form.scss";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setCurrentActiveLocation } = useContext(AppContext);
  const { setCurrentUserId } = useContext(AppContext);
  const { setCurrentUserEmail } = useContext(AppContext);

  const handleLogin = (event) => {
    event.preventDefault();
    setErrorMessage("");

    auth
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        setCurrentUserId(resp.user.uid);
        setCurrentUserEmail(resp.user.email);

        if (resp.user.email === process.env.REACT_APP_SUPERUSER) {
          history.push("/portal");
        } else {
          db.collection("locations")
            .where("email", "==", email)
            .get()
            .then((snapshot) => {
              let resp = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              let activeLocation = resp[0].url;
              setCurrentActiveLocation(activeLocation);
              history.push(`/${activeLocation}/entry`);
            });
        }
      })
      .catch((error) => {
        setErrorMessage("wrong email or password, try again");
      });
  };

  return (
    <React.Fragment>
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo is here" />
      </div>
      <div className="main-container">
        <form className="form" name="login" onSubmit={handleLogin}>
          <h2>LogIn</h2>
          <div className="input-wraper">
            <input
              placeholder="Email"
              type="email"
              id="email"
              name="email"
              // autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-wraper">
            <input
              placeholder="Password"
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <a href="/resetpassword">Forgot password? </a>
          <p className="error-message">{errorMessage}</p>
          <button type="submit" disabled={false}>
            LogIn
          </button>
        </form>
      </div>
    </React.Fragment>
  );
}
