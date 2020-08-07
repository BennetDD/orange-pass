import React, { useContext, useEffect, useState } from "react";
import { db } from "../fb config/firebase";
import { AppContext } from "../AppContext";
import logo from "../assets/OrangePass-ICON.png";

import history from "../history";
import Bar from "./Bar";

import "../styles/components/rules.scss";

export default function Rules({ match }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setProgressBar } = useContext(AppContext);

  useEffect(() => {
    setProgressBar(35);
    setLoading(true);

    db.collection("locations")
      .where("url", "==", match.params.location)
      .get()
      .then((snapshot) => {
        let resp = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        fetchData(resp[0].id);
      });
  }, [setProgressBar, match.params.location]);

  const fetchData = (id) => {
    db.collection("locations")
      .doc(id)
      .collection("rules")
      .get()
      .then((snapshot) => {
        let rules = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setRules(rules);
      })
      .catch((error) => {
        console.log(error.message);
      });

    db.collection("locations")
      .doc(id)
      .collection("questions")
      .get()
      .then((snapshot) => {
        let questions = snapshot.docs.map((doc) => {
          return doc.data();
        });
        sessionStorage.setItem("questions", JSON.stringify(questions));
      })
      .catch((error) => {
        console.log(error.message);
      });

    db.collection("locations")
      .doc(id)
      .collection("inputs")
      .get()
      .then((snapshot) => {
        let inputs = snapshot.docs.map((doc) => {
          return doc.data();
        });
        sessionStorage.setItem("inputs", JSON.stringify(inputs));
      })
      .catch((error) => {
        console.log(error.message);
      });
    setLoading(false);
  };

  const style = {
    marginBottom: "10px",
  };

  return (
    <React.Fragment>
      <Bar />
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo is here" />
      </div>
      <div className="main-container">
        <div className="rules-questiuons-container">
          <h2>Rules to comply with</h2>
          {loading ? (
            <p style={style} className="update-message">
              | | | Loading | | |
            </p>
          ) : null}
          {rules.map((rule, index) => (
            <div key={index} className="rules-questions">
              <h1>R{index + 1}</h1>
              <p>{rule.content}</p>
            </div>
          ))}
          <button
            onClick={() => {
              history.push(`/${match.params.location}/questions`);
              setProgressBar(65);
            }}
          >
            Accept all
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
