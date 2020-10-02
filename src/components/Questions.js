import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import logo from "../assets/OrangePass-Logo.png";

import history from "../history";
import Bar from "./Bar";

import "../styles/components/questions.scss";

export default function Questions({ match }) {
  const [answerIsYes, setAnswerIsYes] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [warning, setWarning] = useState([]);

  const { setProgressBar } = useContext(AppContext);

  useEffect(() => {
    setProgressBar(65);
    setQuestions(JSON.parse(sessionStorage.getItem("questions")));
    setWarning(JSON.parse(sessionStorage.getItem("warning"))[0]);
  }, [setProgressBar]);

  const style = {
    marginTop: "50px",
  };

  const residentAnswer = (answer) => {
    if (answer === "yes") {
      sessionStorage.setItem("answer", "Yes");
    } else {
      sessionStorage.setItem("answer", "None apply");
    }
  };

  return (
    <React.Fragment>
      <Bar />
      <div className="logo-container">
        <img className="logo" src={logo} alt="logo" />
      </div>
      <div className="main-container">
        {answerIsYes ? (
          <div className="rules-questiuons-container">
            <h2>Do any apply to you?</h2>
            {questions.map((question, index) => (
              <div key={index} className="rules-questions">
                <h1>Q{index + 1}</h1>
                <p>{question.content}</p>
              </div>
            ))}
            <div className="btn-container">
              <button
                onClick={() => {
                  setAnswerIsYes(false);
                  residentAnswer("yes");
                }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  history.push(`/${match.params.location}/submit`);
                  setProgressBar(100);
                  residentAnswer("none apply");
                }}
              >
                None apply
              </button>
            </div>
          </div>
        ) : (
          <div style={style} className="message-container">
            <h2 className="warning-message">{warning.content}</h2>
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
