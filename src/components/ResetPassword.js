import React, { useState } from "react";
import { auth, analytics } from "../fb config/firebase";
import history from "../history";
import logo from "../assets/OrangePass-Logo.png";

export default function ResetPassword() {
  const [resetMessage, setResetMessage] = useState("");
  const [email, setEmail] = useState("");

  const resetPassword = (event) => {
    event.preventDefault();
    setResetMessage("");

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setResetMessage("Reset link sent to your email");

        setTimeout(function () {
          history.push("/login");
        }, 5000);
      })
      .catch((error) => {
        setResetMessage("Reset link sent to your email");
        analytics.logEvent("exception", error.message);

        setTimeout(function () {
          history.push("/login");
        }, 5000);
      });
  };

  const fontSize = {
    fontSize: "14px",
    marginTop: "10px",
  };

  return (
    <React.Fragment>
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo is here" />
      </div>
      <div className="main-container">
        <form className="form" name="login" onSubmit={resetPassword}>
          <h2>Reset password</h2>

          <div className="input-wraper">
            <input
              placeholder="Registered email"
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <p style={fontSize} className="update-message">
            {resetMessage}
          </p>
          <button type="submit" disabled={false}>
            Reset
          </button>
        </form>
      </div>
    </React.Fragment>
  );
}
