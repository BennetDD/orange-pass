import React, { useEffect, useState } from "react";
import { db, analytics } from "../fb config/firebase";
import history from "../history";

import "../styles/components/pass.scss";

export default function Pass({ match }) {
  const [loading, setLoading] = useState(false);
  const [clientLogo, setClientLogo] = useState(null);

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
        setClientLogo(resp[0].logo);
        fetchData(resp[0].id);
      })
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    analytics.logEvent("page_view", {
      locationName: `${match.params.location}`,
    });
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
        analytics.logEvent("exception", { description: `${error.message}` });
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
        analytics.logEvent("exception", { description: `${error.message}` });
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
        analytics.logEvent("exception", { description: `${error.message}` });
      });

    setLoading(false);
  };

  return (
    <React.Fragment>
      <div className="main-container">
        <div className="qr-container">
          {loading ? (
            <p className="update-message">| . | . | loading | . | . |</p>
          ) : null}
          <div className="entry-option">
            <div>
              <span>Enter</span>
              <h2>to continue with the pass</h2>
            </div>
            <div className="logo-container">
              <img className="client-logo" src={clientLogo} alt="" />
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
