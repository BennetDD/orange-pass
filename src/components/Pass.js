import React, { useEffect, useState } from "react";
import { db, analytics } from "../fb config/firebase";
import history from "../history";
import logo from "../assets/OrangePass-Logo.png";

import "../styles/components/entry.scss";

export default function Pass({ match }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    analytics.logEvent("page_view", match.params.location);
  }, [match.params.location]);

  const fetchData = (id) => {
    db.collection("locations")
      .doc(id)
      .collection("rules")
      .get()
      .then((snapshot) => {
        let rules = snapshot.docs.map((doc) => {
          return doc.data();
        });
        sessionStorage.setItem("rules", JSON.stringify(rules));
      })
      .catch((error) => {
        analytics.logEvent("exception", error.message);
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
        analytics.logEvent("exception", error.message);
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
        analytics.logEvent("exception", error.message);
      });
    setLoading(false);
  };

  return (
    <React.Fragment>
      <div className="main-container">
        <div className="qr-container">
          {loading ? (
            <p className="update-message">| | | Loading | | |</p>
          ) : null}
          <div className="entry-option">
            <h2>
              <span>Enter</span> to continue with the pass
            </h2>
            <div className="logo-container">
              <img className="logo" src={logo} alt="Logo is here" />
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
