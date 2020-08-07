import React from "react";
// import QRcode from "qrcode.react";
import history from "../history";
import logo from "../assets/OrangePass-Logo.png";

import "../styles/components/entry.scss";

export default function EntryPage({ match }) {
  return (
    <React.Fragment>
      <div className="main-container">
        <div className="qr-container">
          <div className="entry-option">
            <h2>
              <span>Enter</span> to continue with the pass
            </h2>
            <div className="logo-container">
              <img className="logo" src={logo} alt="Logo is here" />
            </div>
            <button
              onClick={() => history.push(`/${match.params.location}/rules`)}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
