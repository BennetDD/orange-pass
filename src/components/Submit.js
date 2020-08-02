import React, { useContext, useState, useEffect } from "react";
import { db } from "../fb config/firebase";
import { AppContext } from "../AppContext";
import history from "../history";

import Bar from "./Bar";

import "../styles/components/form.scss";

export default function Submit() {
  const [fullname, setFullname] = useState("");
  const [unit, setUnit] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [form, setForm] = useState(true);

  const { currentUserId } = useContext(AppContext);
  const { inputs } = useContext(AppContext);

  useEffect(() => {
    if (fullname.trim() && unit.trim() && email.trim() && mobile.trim()) {
      setWarningMessage("");
    } else {
      setWarningMessage("fill in all fields");
    }
  }, [fullname, unit, email, mobile]);

  const handleSubmit = (event) => {
    event.preventDefault();

    db.collection("locations")
      .doc(currentUserId)
      .collection("residents")
      .add({
        fullname,
        unit,
        email,
        mobile,
        answer: "yes",
        time: new Date(),
      })
      .catch((error) => {
        console.log(error.message);
        setForm(true);
      });

    setForm(false);

    setTimeout(function () {
      history.push("/entry");
    }, 5000);
  };

  return (
    <React.Fragment>
      <Bar />
      <div className="main-container">
        {form ? (
          <form className="form" name="submit" onSubmit={handleSubmit}>
            <h2>Your information</h2>
            {inputs[0].name ? (
              <div className="input-wraper">
                <input
                  placeholder="Full name"
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="off"
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>
            ) : null}

            {inputs[0].unit ? (
              <div className="input-wraper">
                <input
                  placeholder="Unit No"
                  type="text"
                  id="unit"
                  name="unit"
                  autoComplete="off"
                  onChange={(e) => setUnit(e.target.value)}
                  required
                />
              </div>
            ) : null}

            {inputs[0].email ? (
              <div className="input-wraper">
                <input
                  placeholder="Email"
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : null}

            {inputs[0].mobile ? (
              <div className="input-wraper">
                <input
                  placeholder="Mobile No"
                  type="text"
                  id="mobile"
                  name="mobile"
                  autoComplete="off"
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
            ) : null}

            <p className="warning-message">{warningMessage}</p>
            <button type="submit">Submit</button>
          </form>
        ) : (
          <div className="message-container">
            <h2 className="orangepass-message">
              Thank you and enjoy your exercise
            </h2>
            <h1>Orange Pass Issued</h1>
            <p>Orange pass is valid for 30 days</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
