import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db } from "../../fb config/firebase";

export default function RulesEdit() {
  const [rules, setRules] = useState([]);

  const { chosenLocationId } = useContext(AppContext);
  const { chosenLocationName } = useContext(AppContext);

  useEffect(() => {
    if (chosenLocationId !== "") {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("rules")
        .get()
        .then((snapshot) => {
          setRules(
            snapshot.docs.map((doc) => {
              return doc.data();
            })
          );
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [chosenLocationId]);

  return (
    <React.Fragment>
      <div className="components-container">
        <div>
          <h2>Review rules</h2>
          <p>
            Chosen location:
            <span className="location-name">{chosenLocationName}</span>
          </p>
        </div>
        <div className="btnset-container">
          <button className="add-btn">Add</button>
          <button className="save-btn">Save</button>
        </div>
      </div>
      <div className="edit-container">
        {rules.map((rule, index) => (
          <div key={index} className="textarea-container">
            <textarea name="rule" value={rule.content}></textarea>
            <div>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
