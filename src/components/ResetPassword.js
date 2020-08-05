import React, { useState } from "react";
import { auth } from "../fb config/firebase";
import history from "../history";
import logo from "../assets/OrangePass-Logo.png";

export default function ResetPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const [email, setEmail] = useState("");

  const resetPassword = (event) => {
    event.preventDefault();
    setErrorMessage("");

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setResetMessage("Reset link sent to your email");

        setTimeout(function () {
          history.push("/login");
        }, 5000);
      })
      .catch((error) => {
        setErrorMessage(error.message);
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
              required
            />
          </div>
          <p style={fontSize} className="update-message">
            {resetMessage}
          </p>
          <p className="error-message">{errorMessage}</p>
          <button type="submit" disabled={false}>
            Reset
          </button>
        </form>
      </div>
    </React.Fragment>
  );
}
