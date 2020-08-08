import React, { useContext, useState, useEffect } from "react";
import { db, analytics } from "../fb config/firebase";
import { AppContext } from "../AppContext";
import history from "../history";
import logo from "../assets/OrangePass-Logo.png";

import Bar from "./Bar";

import "../styles/components/form.scss";

export default function Submit({ match }) {
  const [fullname, setFullname] = useState("");
  const [unit, setUnit] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [form, setForm] = useState(true);
  const [inputs, setInputs] = useState([]);

  const { setProgressBar } = useContext(AppContext);

  useEffect(() => {
    setProgressBar(100);
    setInputs(JSON.parse(sessionStorage.getItem("inputs"))[0]);

    if (fullname.trim() && unit.trim() && email.trim() && mobile.trim()) {
      setWarningMessage("");
    } else {
      setWarningMessage("fill in all fields");
    }
  }, [fullname, unit, email, mobile, setProgressBar]);

  const handleSubmit = (event) => {
    event.preventDefault();

    db.collection("locations")
      .where("url", "==", match.params.location)
      .get()
      .then((snapshot) => {
        let resp = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        uploadData(resp[0].id);
      });
  };

  const uploadData = (id) => {
    db.collection("locations")
      .doc(id)
      .collection("residents")
      .add({
        fullname,
        unit,
        email,
        mobile,
        answer: sessionStorage.getItem("answer"),
        time: new Date(),
      })
      .catch((error) => {
        analytics.logEvent("exception", error.message);
        setForm(true);
      });

    setForm(false);

    setTimeout(function () {
      history.push(`/${match.params.location}/pass`);
    }, 5000);
  };

  const style = {
    marginTop: "50px",
  };

  return (
    <React.Fragment>
      <Bar />
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo is here" />
      </div>
      <div className="main-container">
        {form ? (
          <form className="form" name="submit" onSubmit={handleSubmit}>
            <h2>Your information</h2>
            {inputs.name ? (
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

            {inputs.unit ? (
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

            {inputs.email ? (
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

            {inputs.mobile ? (
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
          <div style={style} className="message-container">
            <h2 className="orangepass-message">
              Thank you! You are now safe to enjoy the venue!
            </h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
