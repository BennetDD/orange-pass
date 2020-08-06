import React, { useContext, useEffect, useState } from "react";
import { db } from "../fb config/firebase";
import { AppContext } from "../AppContext";
import logo from "../assets/OrangePass-ICON.png";

import history from "../history";
import Bar from "./Bar";

import "../styles/components/rules.scss";

export default function Rules({ match }) {
  const [rules, setRules] = useState([]);

  const { setProgressBar } = useContext(AppContext);
  const { setInputs } = useContext(AppContext);
  const { setQuestions } = useContext(AppContext);

  useEffect(() => {
    setProgressBar(35);

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
  }, []);

  const fetchData = (id) => {
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
      <Bar />
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo is here" />
      </div>
      <div className="main-container">
        <div className="rules-questiuons-container">
          <h2>Rules to comply with</h2>
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
