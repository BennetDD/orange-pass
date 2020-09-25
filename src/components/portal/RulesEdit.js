import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db, analytics } from "../../fb config/firebase";
import loadingGif from "../../assets/Loading.png";
import uid from "uid";

export default function RulesEdit() {
  const [rules, setRules] = useState([]);
  const [saved, setSaved] = useState(false);
  const [edit, setEdit] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
            snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
          );
          setIsButtonDisabled(false);
        })
        .catch((error) => {
          analytics.logEvent("exception", { description: `${error.message}` });
        });
    }
  }, [chosenLocationId]);

  const handleChange = (value, id) => {
    setEdit(
      rules.map((rule) => {
        if (rule.id === id) {
          rule.content = value;
        }
      })
    );
  };

  const handleUpload = () => {
    rules.forEach((rule) => {
      db.collection("locations")
        .doc(chosenLocationId)
        .collection("rules")
        .doc(rule.id)
        .set({
          content: rule.content,
        })
        .catch((error) => {
          analytics.logEvent("exception", { description: `${error.message}` });
        });
    });
    setSaved(true);

    setTimeout(function () {
      setSaved(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    setRules(
      rules.filter((rule) => {
        return rule.id !== id;
      })
    );

    db.collection("locations")
      .doc(chosenLocationId)
      .collection("rules")
      .doc(id)
      .delete()
      .catch((error) => {
        analytics.logEvent("exception", { description: `${error.message}` });
      });
  };

  const createEditBox = () => {
    setRules([
      ...rules,
      {
        content: "",
        id: uid(20),
      },
    ]);
  };

  return (
    <React.Fragment>
      <div className="components-container">
        <div>
          <h2>Review rules</h2>
          <p>
            Location:
            <span className="location-name">{chosenLocationName}</span>
          </p>
        </div>
        {saved ? (
          <img className="loading" src={loadingGif} alt="Loading is here" />
        ) : null}
        <div>
          <button
            className="add-btn"
            onClick={() => createEditBox()}
            disabled={isButtonDisabled}
          >
            Add
          </button>
          <button
            className="save-btn"
            onClick={() => handleUpload()}
            disabled={isButtonDisabled}
          >
            Save
          </button>
        </div>
      </div>

      <div className="edit-container">
        {rules.map((rule) => (
          <div key={rule.id} className="textarea-container">
            <textarea
              placeholder="type the rule and click save"
              name="rule"
              value={rule.content}
              onChange={(e) => handleChange(e.target.value, rule.id)}
            ></textarea>
            <div>
              <button
                className="delete-btn"
                onClick={() => {
                  if (
                    window.confirm(
                      "This action will delete the question from database, are you sure?"
                    )
                  )
                    handleDelete(rule.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
