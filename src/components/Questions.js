import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import logo from "../assets/OrangePass-ICON.png";

import history from "../history";
import Bar from "./Bar";

import "../styles/components/questions.scss";

export default function Questions({ match }) {
  const [answerIsYes, setAnswerIsYes] = useState(true);

  const { questions } = useContext(AppContext);
  const { setProgressBar } = useContext(AppContext);

  useEffect(() => {
    setProgressBar(65);
  }, [setProgressBar]);

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
        {answerIsYes ? (
          <div className="rules-questiuons-container">
            <h2>Do any of below apply to you?</h2>
            {questions.map((question, index) => (
              <div key={index} className="rules-questions">
                <h1>Q{index + 1}</h1>
                <p>{question.content}</p>
              </div>
            ))}
            <div className="btn-container">
              <button onClick={() => setAnswerIsYes(false)}>Yes</button>
              <button
                onClick={() => {
                  history.push(`/${match.params.location}/submit`);
                  setProgressBar(100);
                }}
              >
                None apply
              </button>
            </div>
          </div>
        ) : (
          <div style={style} className="message-container">
            <h2 className="warning-message">
              You are working out at your own risk
            </h2>
            <p>
              For full terms and conditions <a href="/login">click here</a>
            </p>
            <button
              onClick={() => {
                history.push(`/${match.params.location}/submit`);
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
