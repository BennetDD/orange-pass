import React, { useContext } from "react";
import { AppContext } from "../AppContext";

import history from "../history";
import Bar from "./Bar";

import "../styles/components/rules.scss";

export default function Rules() {
  const { rules } = useContext(AppContext);

  return (
    <React.Fragment>
      <Bar />
      <div className="main-container">
        <div className="rules-questiuons-container">
          <h2>Rules to comply</h2>
          {rules.map((rule, index) => (
            <div key={index} className="rules-questions">
              <h1>R{index + 1}</h1>
              <p>{rule.content}</p>
            </div>
          ))}
          <button onClick={() => history.push("/questions")}>Accept all</button>
        </div>
      </div>
    </React.Fragment>
  );
}
