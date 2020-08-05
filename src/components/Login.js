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

  const { setCurrentUserId } = useContext(AppContext);
  const { setCurrentUserEmail } = useContext(AppContext);
  const { setLocationData } = useContext(AppContext);
  const { setRules } = useContext(AppContext);
  const { setQuestions } = useContext(AppContext);
  const { setResidents } = useContext(AppContext);
  const { setInputs } = useContext(AppContext);

  const handleLogin = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        setCurrentUserId(resp.user.uid);
        setCurrentUserEmail(resp.user.email);

        fetchAllData(resp.user.uid);

        if (resp.user.email === "orangesafepass@gmail.com") {
          history.push("/portal");
        } else {
          history.push("/entry");
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const fetchAllData = (id) => {
    // fetch location data
    db.collection("locations")
      .doc(id)
      .get()
      .then((snapshot) => {
        setLocationData(snapshot.data());
      })
      .catch((error) => {
        console.log(error.message);
      });

    // fetch residents
    db.collection("locations")
      .doc(id)
      .collection("residents")
      .get()
      .then((snapshot) => {
        setResidents(
          snapshot.docs.map((doc) => {
            return doc.data();
          })
        );
      })
      .catch((error) => {
        console.log(error.message);
      });

    // fetch rules
    db.collection("locations")
      .doc(id)
      .collection("rules")
      .get()
      .then((snapshot) => {
        setRules(
          snapshot.docs.map((doc) => {
            return doc.data();
          })
        );
      })
      .catch((error) => {
        console.log(error.message);
      });

    // fetch questions
    db.collection("locations")
      .doc(id)
      .collection("questions")
      .get()
      .then((snapshot) => {
        setQuestions(
          snapshot.docs.map((doc) => {
            return doc.data();
          })
        );
      })
      .catch((error) => {
        console.log(error.message);
      });

    // fetch inputs
    db.collection("locations")
      .doc(id)
      .collection("inputs")
      .get()
      .then((snapshot) => {
        setInputs(
          snapshot.docs.map((doc) => {
            return doc.data();
          })
        );
      })
      .catch((error) => {
        console.log(error.message);
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
