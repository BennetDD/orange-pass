import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { db } from "../../fb config/firebase";

export default function RulesEdit() {
  const [rules, setRules] = useState([]);
  const [saved, setSaved] = useState(false);
  const [edit, setEdit] = useState(null);

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
        })
        .catch((error) => {
          console.log(error.message);
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
          console.log(error.message);
        });
    });
    setSaved(true);
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
        console.log(error.message);
      });
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
        {saved ? <p className="changes-meassage">changes saved</p> : null}
        <div>
          <button className="add-btn">Add</button>
          <button className="save-btn" onClick={() => handleUpload()}>
            Save
          </button>
        </div>
      </div>

      <div className="edit-container">
        {rules.map((rule) => (
          <div key={rule.id} className="textarea-container">
            <textarea
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
