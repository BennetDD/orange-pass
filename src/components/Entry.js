import React from "react";
import QRcode from "qrcode.react";
import history from "../history";
import logo from "../assets/OrangePass-Logo.png";

import "../styles/components/entry.scss";

export default function EntryPage({ match }) {
  const url = `/${match.params.location}/rules`;

  return (
    <React.Fragment>
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo is here" />
      </div>
      <div className="main-container">
        <div className="qr-container">
          <h2 className="entry-message">Choose either one</h2>
          <div className="entry-options">
            <div className="entry-option">
              <h2>
                <span>Scan</span> QR code with your camera
              </h2>
              <QRcode
                value={url}
                size={300}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={true}
                renderAs={"svg"}
              />
            </div>
            <div className="entry-option">
              <h2>
                <span>Press</span> enter to continue with the pass
              </h2>
              <button
                onClick={() => history.push(`/${match.params.location}/rules`)}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
