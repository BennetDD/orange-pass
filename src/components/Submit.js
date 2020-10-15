import React, { useContext, useState, useEffect } from "react";
import { db, analytics } from "../fb config/firebase";
import { AppContext } from "../AppContext";
import history from "../history";
import logo from "../assets/OrangePass-Logo.png";
import uid from "uid";

import Bar from "./Bar";

import "../styles/components/form.scss";

export default function Submit({ match }) {
  const [fullname, setFullname] = useState("");
  const [unit, setUnit] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [form, setForm] = useState(true);
  const [inputs, setInputs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [message, setMessage] = useState([]);
  const [messageBox, setMessageBox] = useState(false);
  const [returnUserForm, setReturnUserForm] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { setProgressBar } = useContext(AppContext);
  const { returnUser, setReturnUser } = useContext(AppContext);
  const { returnUserData } = useContext(AppContext);

  useEffect(() => {
    setProgressBar(100);
    setInputs(JSON.parse(sessionStorage.getItem("inputs"))[0]);
    setMessage(JSON.parse(sessionStorage.getItem("message"))[0]);

    if (fullname.trim() && unit.trim() && email.trim() && mobile.trim()) {
      setWarningMessage("");
    } else {
      setWarningMessage("fill in all fields");
    }

    if (mobile.trim().length < 8 && mobile.trim()) {
      setWarningMessage("provide a valid phone number");
      setIsButtonDisabled(true);
    }

    if (mobile.trim().length >= 8) {
      setIsButtonDisabled(false);
    }

    if (returnUser) {
      setForm(false);

      if (returnUserData.fullname !== "") {
        setFullname(returnUserData.fullname);
      }

      if (returnUserData.email !== "") {
        setEmail(returnUserData.email);
      }

      if (returnUserData.mobile !== "") {
        setMobile(returnUserData.mobile);
      }

      if (returnUserData.unit !== "") {
        setUnit(returnUserData.unit);
      }
    }
  }, [
    fullname,
    unit,
    email,
    mobile,
    setProgressBar,
    returnUser,
    returnUserData.fullname,
    returnUserData.email,
    returnUserData.mobile,
    returnUserData.unit,
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setReturnUser(false);
    setReturnUserForm(false);

    analytics.logEvent("checkout_progress", {
      checkout_option: `${match.params.location}`,
    });

    db.collection("locations")
      .where("url", "==", match.params.location)
      .get()
      .then((snapshot) => {
        let resp = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        uploadData(resp[0].id);
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
        setErrorMessage(error.message);
      });
  };

  const uploadData = (id) => {
    let customId = uid(20);
    localStorage.setItem("OrangePassCustomId", JSON.stringify(customId));

    db.collection("locations")
      .doc(id)
      .collection("residents")
      .doc(customId)
      .set({
        fullname,
        unit,
        email,
        mobile,
        answer: sessionStorage.getItem("answer"),
        time: new Date(),
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
        setForm(true);
      });

    setForm(false);
    setMessageBox(true);

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
        <a
          href="https://www.orangesafepass.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="logo" src={logo} alt="logo" />
        </a>
      </div>
      <div className="main-container">
        {returnUser ? (
          <div className="return-container">
            <div className="return-box">
              <h2>{returnUserData.fullname},</h2>
              <h3>You have already given us your contact information.</h3>
            </div>
            <p
              onClick={() => {
                setForm(false);
                setReturnUser(false);
                setReturnUserForm(true);
              }}
            >
              Edit information
            </p>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        ) : null}

        {returnUserForm ? (
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
                  value={returnUserData.fullname}
                  onChange={(e) => {
                    setFullname(e.target.value);
                    returnUserData.fullname = e.target.value;
                  }}
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
                  value={returnUserData.unit}
                  onChange={(e) => {
                    setUnit(e.target.value);
                    returnUserData.unit = e.target.value;
                  }}
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
                  value={returnUserData.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    returnUserData.email = e.target.value;
                  }}
                  required
                />
              </div>
            ) : null}

            {inputs.mobile ? (
              <div className="input-wraper">
                <input
                  className="phone-number"
                  placeholder="Phone No"
                  type="number"
                  id="mobile"
                  name="mobile"
                  autoComplete="off"
                  value={returnUserData.mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    returnUserData.mobile = e.target.value;
                  }}
                  required
                />
              </div>
            ) : null}

            <p className="warning-message">{warningMessage}</p>
            <p className="error-message">{errorMessage}</p>
            <button type="submit">Submit</button>
          </form>
        ) : null}

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
                  className="phone-number"
                  placeholder="Phone No"
                  type="number"
                  id="mobile"
                  name="mobile"
                  autoComplete="off"
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
            ) : null}

            <p className="warning-message">{warningMessage}</p>
            <p className="error-message">{errorMessage}</p>
            <button disabled={isButtonDisabled} type="submit">
              Submit
            </button>
          </form>
        ) : null}

        {messageBox ? (
          <div style={style} className="message-container">
            <h2 className="orangepass-message">{message.content}</h2>
          </div>
        ) : null}

        <a
          className="website-link"
          href="https://www.orangesafepass.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.orangesafepass.com
        </a>
      </div>
    </React.Fragment>
  );
}
