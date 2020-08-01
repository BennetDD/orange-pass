import React from "react";
import QRcode from "qrcode.react";
import history from "../history";

import "../styles/components/entry.scss";

export default function EntryPage({ match }) {
  const url = `http://localhost:3000/${match.params.location}/entry`;

  return (
    <React.Fragment>
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
              <button onClick={() => history.push("/rules")}>Enter</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}