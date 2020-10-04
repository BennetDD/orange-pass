import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import logo from "../assets/OrangePass-Logo.png";

import history from "../history";
import Bar from "./Bar";

import "../styles/components/rules.scss";

export default function Rules({ match }) {
  const [rules, setRules] = useState([]);

  const { setProgressBar } = useContext(AppContext);

  useEffect(() => {
    setProgressBar(35);
    setRules(JSON.parse(sessionStorage.getItem("rules")));
  }, [setProgressBar]);

  const navigatePage = () => {
    if (
      JSON.parse(sessionStorage.getItem("questions")).length > 0 &&
      JSON.parse(sessionStorage.getItem("questions"))[0].content !== ""
    ) {
      history.push(`/${match.params.location}/questions`);
    } else {
      sessionStorage.setItem("answer", "Not required");
      history.push(`/${match.params.location}/submit`);
    }
  };

  return (
    <React.Fragment>
      <Bar />
      <div className="logo-container">
        <img className="logo" src={logo} alt="logo" />
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
          <button onClick={() => navigatePage()}>Accept all</button>
        </div>
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
