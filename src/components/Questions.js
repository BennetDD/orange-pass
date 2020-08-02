import React, { useContext, useState } from "react";
import { AppContext } from "../AppContext";

import history from "../history";
import Bar from "./Bar";

import "../styles/components/questions.scss";

export default function Questions() {
  const [answerIsYes, setAnswerIsYes] = useState(true);

  const { questions } = useContext(AppContext);
  const { setProgressBar } = useContext(AppContext);

  return (
    <React.Fragment>
      <Bar />
      <div className="main-container">
        {answerIsYes ? (
          <div className="rules-questiuons-container">
            <h2>Do any of below apply?</h2>
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
                  history.push("/submit");
                  setProgressBar(100);
                }}
              >
                None apply
              </button>
            </div>
          </div>
        ) : (
          <div className="message-container">
            <h2 className="warning-message">
              You are working out at your own risk
            </h2>
            <p>
              For full terms and conditions <a>click here</a>
            </p>
            <button
              onClick={() => {
                history.push("/submit");
                setProgressBar(100);
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
